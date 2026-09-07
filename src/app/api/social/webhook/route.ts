import { NextResponse, after } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { decrypt, encrypt, isLegacyFormat } from '@/lib/whatsapp/encryption'
import { sendSocialText } from '@/lib/social/meta-api'
import { dispatchInboundToAiReply } from '@/lib/ai/auto-reply'
import { verifyMetaWebhookSignature } from '@/lib/whatsapp/webhook-signature'

type SocialEntry = { id?: string; messaging?: Array<{ sender?: { id?: string }; recipient?: { id?: string }; timestamp?: number; message?: { mid?: string; text?: string; is_echo?: boolean } }> }
type SocialBody = { entry?: SocialEntry[] }
type SocialConfigRow = { id: string; verify_token: string | null; account_id: string; page_id: string; instagram_account_id: string | null; created_by: string }

let adminClient: ReturnType<typeof createClient> | null = null
// This project does not generate Supabase database types for migrations;
// keep this route aligned with the existing WhatsApp webhook client.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function db(): any {
  if (!adminClient) adminClient = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
  return adminClient
}

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams
  if (params.get('hub.mode') !== 'subscribe' || !params.get('hub.challenge') || !params.get('hub.verify_token')) return NextResponse.json({ error: 'Missing verification parameters' }, { status: 400 })
  const token = params.get('hub.verify_token')
  const { data: configs } = await db().from('social_channel_configs').select('id, verify_token')
  const match = (configs as SocialConfigRow[] | null)?.find((config: SocialConfigRow) => {
    if (!config.verify_token) return false
    try { return decrypt(config.verify_token) === token } catch { return false }
  })
  if (!match) return NextResponse.json({ error: 'Verification token mismatch' }, { status: 403 })
  if (match.verify_token && isLegacyFormat(match.verify_token)) void db().from('social_channel_configs').update({ verify_token: encrypt(token!) }).eq('id', match.id)
  return new Response(params.get('hub.challenge'), { headers: { 'Content-Type': 'text/plain' } })
}

export async function POST(request: Request) {
  const rawBody = await request.text()
  if (!verifyMetaWebhookSignature(rawBody, request.headers.get('x-hub-signature-256'))) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
  }
  let body: SocialBody
  try { body = JSON.parse(rawBody) as SocialBody } catch { return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 }) }
  after(async () => processSocialWebhook(body))
  return NextResponse.json({ status: 'received' })
}

async function processSocialWebhook(body: SocialBody) {
  for (const entry of body.entry ?? []) {
    for (const event of entry.messaging ?? []) {
      const senderId = event.sender?.id
      const recipientId = event.recipient?.id
      const text = event.message?.text?.trim()
      if (!senderId || !recipientId || !text || event.message?.is_echo) continue

      const { data: configs } = await db().from('social_channel_configs').select('*').or(`page_id.eq.${recipientId},instagram_account_id.eq.${recipientId}`)
      const config = configs?.[0]
      if (!config) continue
      const channel = config.instagram_account_id === recipientId ? 'instagram' : 'messenger'
      const syntheticPhone = `${channel}:${senderId}`
      let { data: contact } = await db().from('contacts').select('*').eq('account_id', config.account_id).eq('phone', syntheticPhone).maybeSingle()
      if (!contact) {
        const created = await db().from('contacts').insert({ account_id: config.account_id, user_id: config.created_by, phone: syntheticPhone, name: `${channel} ${senderId}` }).select().single()
        contact = created.data
      }
      if (!contact) continue
      let { data: conversation } = await db().from('conversations').select('*').eq('account_id', config.account_id).eq('channel', channel).eq('external_contact_id', senderId).maybeSingle()
      if (!conversation) {
        const created = await db().from('conversations').insert({ account_id: config.account_id, user_id: config.created_by, contact_id: contact.id, channel, external_contact_id: senderId }).select().single()
        conversation = created.data
      }
      if (!conversation) continue
      const duplicate = event.message?.mid ? await db().from('messages').select('id').eq('message_id', event.message.mid).maybeSingle() : { data: null }
      if (duplicate.data) continue
      await db().from('messages').insert({ conversation_id: conversation.id, sender_type: 'customer', content_type: 'text', content_text: text, message_id: event.message?.mid ?? null, status: 'delivered', created_at: event.timestamp ? new Date(event.timestamp).toISOString() : undefined })
      await db().from('conversations').update({ last_message_text: text, last_message_at: new Date().toISOString(), unread_count: (conversation.unread_count ?? 0) + 1, updated_at: new Date().toISOString() }).eq('id', conversation.id)
      await dispatchInboundToAiReply({ accountId: config.account_id, conversationId: conversation.id, contactId: contact.id, configOwnerUserId: config.created_by, channel })
    }
  }
}
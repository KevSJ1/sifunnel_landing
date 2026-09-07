import { decrypt } from '@/lib/whatsapp/encryption'
import { sendSocialText, type SocialChannel } from './meta-api'
import { supabaseAdmin } from '@/lib/flows/admin-client'

export async function sendSocialTextToConversation(args: {
  accountId: string
  conversationId: string
  text: string
  senderType: 'agent' | 'bot'
  senderId?: string
  aiGenerated?: boolean
}) {
  const db = supabaseAdmin()
  const { data: conversation } = await db
    .from('conversations')
    .select('id, channel, external_contact_id')
    .eq('id', args.conversationId)
    .eq('account_id', args.accountId)
    .maybeSingle()
  if (!conversation || !['instagram', 'messenger'].includes(conversation.channel) || !conversation.external_contact_id) {
    throw new Error('Social conversation not found')
  }

  const channel = conversation.channel as SocialChannel
  const { data: config } = await db
    .from('social_channel_configs')
    .select('*')
    .eq('account_id', args.accountId)
    .eq('channel', channel)
    .maybeSingle()
  if (!config) throw new Error(`${channel} is not configured for this account`)

  const result = await sendSocialText({
    channel,
    pageId: config.page_id,
    instagramAccountId: config.instagram_account_id,
    accessToken: decrypt(config.access_token),
    recipientId: conversation.external_contact_id,
    text: args.text,
  })

  const { data: message, error } = await db.from('messages').insert({
    conversation_id: args.conversationId,
    sender_type: args.senderType,
    sender_id: args.senderId ?? null,
    content_type: 'text',
    content_text: args.text,
    message_id: result.messageId,
    status: 'sent',
    ai_generated: args.aiGenerated ?? false,
  }).select('id').single()
  if (error) throw new Error(`sent to Meta but DB insert failed: ${error.message}`)

  await db.from('conversations').update({
    last_message_text: args.text,
    last_message_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }).eq('id', args.conversationId)

  return { messageId: message.id, socialMessageId: result.messageId }
}
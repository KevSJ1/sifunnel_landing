import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireRole, toErrorResponse } from '@/lib/auth/account'
import { encrypt } from '@/lib/whatsapp/encryption'
import { verifySocialPage, type SocialChannel } from '@/lib/social/meta-api'

const CHANNELS: SocialChannel[] = ['instagram', 'messenger']

export async function GET(request: Request) {
  try {
    const { accountId } = await requireRole('viewer')
    const channel = new URL(request.url).searchParams.get('channel') as SocialChannel | null
    if (!channel || !CHANNELS.includes(channel)) return NextResponse.json({ error: 'Invalid channel' }, { status: 400 })
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('social_channel_configs')
      .select('id, channel, page_id, instagram_account_id, status, connected_at')
      .eq('account_id', accountId)
      .eq('channel', channel)
      .maybeSingle()
    if (error) throw error
    return NextResponse.json(data ? { ...data, access_token: '********' } : null)
  } catch (error) {
    return toErrorResponse(error)
  }
}

export async function POST(request: Request) {
  try {
    const { accountId, userId } = await requireRole('admin')
    const body = await request.json() as {
      channel?: SocialChannel
      page_id?: string
      instagram_account_id?: string
      access_token?: string
      verify_token?: string
    }
    const channel = body.channel
    if (!channel || !CHANNELS.includes(channel) || !body.page_id?.trim()) {
      return NextResponse.json({ error: 'Channel and Page ID are required' }, { status: 400 })
    }
    if (!body.access_token?.trim()) {
      return NextResponse.json({ error: 'Access Token is required' }, { status: 400 })
    }
    const verified = await verifySocialPage(
      body.page_id.trim(),
      body.access_token.trim(),
      channel,
      body.instagram_account_id?.trim(),
    )
    const supabase = await createClient()
    const { data: existing } = await supabase
      .from('social_channel_configs')
      .select('id')
      .eq('account_id', accountId)
      .eq('channel', channel)
      .maybeSingle()
    const values = {
      account_id: accountId,
      channel,
      page_id: body.page_id.trim(),
      instagram_account_id: body.instagram_account_id?.trim() || null,
      access_token: encrypt(body.access_token.trim()),
      verify_token: body.verify_token?.trim() ? encrypt(body.verify_token.trim()) : null,
      status: 'connected',
      connected_at: new Date().toISOString(),
      created_by: userId,
    }
    const query = existing
      ? supabase.from('social_channel_configs').update(values).eq('id', existing.id)
      : supabase.from('social_channel_configs').insert(values)
    const { error } = await query
    if (error) throw error
    return NextResponse.json({ connected: true, name: verified.name })
  } catch (error) {
    console.error('Social config save failed:', error)
    return toErrorResponse(error)
  }
}
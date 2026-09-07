const META_API_VERSION = 'v21.0'
const META_API_BASE = `https://graph.facebook.com/${META_API_VERSION}`

export type SocialChannel = 'instagram' | 'messenger'

export async function verifySocialPage(
  pageId: string,
  accessToken: string,
  channel: SocialChannel,
  instagramAccountId?: string | null,
): Promise<{ id: string; name?: string }> {
  const target = channel === 'instagram' ? instagramAccountId || pageId : pageId
  const response = await fetch(
    `${META_API_BASE}/${target}?fields=id,name,username&access_token=${encodeURIComponent(accessToken)}`,
    { cache: 'no-store' },
  )
  const data = (await response.json()) as { id?: string; name?: string; error?: { message?: string } }
  if (!response.ok || !data.id) {
    throw new Error(data.error?.message || `Meta API error (${response.status})`)
  }
  return { id: data.id, name: data.name }
}

export async function sendSocialText(args: {
  channel: SocialChannel
  pageId: string
  instagramAccountId?: string | null
  accessToken: string
  recipientId: string
  text: string
}): Promise<{ messageId: string }> {
  const senderId = args.channel === 'instagram'
    ? args.instagramAccountId || args.pageId
    : args.pageId
  const response = await fetch(`${META_API_BASE}/${senderId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      recipient: { id: args.recipientId },
      message: { text: args.text },
      access_token: args.accessToken,
    }),
  })
  const data = (await response.json()) as { message_id?: string; error?: { message?: string } }
  if (!response.ok || !data.message_id) {
    throw new Error(data.error?.message || `Meta API error (${response.status})`)
  }
  return { messageId: data.message_id }
}
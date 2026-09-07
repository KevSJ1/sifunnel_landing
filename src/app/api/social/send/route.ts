import { NextResponse } from 'next/server'
import { requireRole, toErrorResponse } from '@/lib/auth/account'
import { sendSocialTextToConversation } from '@/lib/social/send-message'

export async function POST(request: Request) {
  try {
    const { accountId, userId } = await requireRole('agent')
    const body = await request.json() as { conversation_id?: string; content_text?: string }
    if (!body.conversation_id || !body.content_text?.trim()) {
      return NextResponse.json({ error: 'conversation_id and content_text are required' }, { status: 400 })
    }
    const result = await sendSocialTextToConversation({
      accountId,
      conversationId: body.conversation_id,
      text: body.content_text.trim(),
      senderType: 'agent',
      senderId: userId,
    })
    return NextResponse.json({ success: true, message_id: result.messageId, social_message_id: result.socialMessageId })
  } catch (error) {
    console.error('Social send failed:', error)
    return toErrorResponse(error)
  }
}
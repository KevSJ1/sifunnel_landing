'use client'

import { useEffect, useState } from 'react'
import { Camera, CheckCircle2, Loader2, MessageCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/hooks/use-auth'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { SettingsPanelHead } from './settings-panel-head'

type Channel = 'instagram' | 'messenger'
type ChannelConfig = { page_id: string; instagram_account_id?: string | null; status?: string }

const CHANNEL_META: Record<Channel, { title: string; description: string; icon: typeof Camera }> = {
  instagram: { title: 'Instagram', description: 'Recibe mensajes de Instagram y responde desde el Inbox con agentes o IA.', icon: Camera },
  messenger: { title: 'Facebook Messenger', description: 'Conecta una página de Facebook para centralizar sus conversaciones.', icon: MessageCircle },
}

function ChannelForm({ channel, canEdit }: { channel: Channel; canEdit: boolean }) {
  const meta = CHANNEL_META[channel]
  const Icon = meta.icon
  const [config, setConfig] = useState<ChannelConfig | null>(null)
  const [pageId, setPageId] = useState('')
  const [instagramId, setInstagramId] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [verifyToken, setVerifyToken] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    let cancelled = false
    fetch(`/api/social/config?channel=${channel}`, { cache: 'no-store' })
      .then((response) => response.json())
      .then((data: ChannelConfig | null) => {
        if (cancelled) return
        setConfig(data)
        setPageId(data?.page_id ?? '')
        setInstagramId(data?.instagram_account_id ?? '')
      })
      .catch(() => toast.error(`No se pudo cargar la configuración de ${meta.title}.`))
      .finally(() => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [channel, meta.title])

  async function save() {
    if (!pageId.trim() || !accessToken.trim()) {
      toast.error('Page ID y Access Token son obligatorios para verificar Meta.')
      return
    }
    setSaving(true)
    try {
      const response = await fetch('/api/social/config', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ channel, page_id: pageId, instagram_account_id: channel === 'instagram' ? instagramId : undefined, access_token: accessToken, verify_token: verifyToken || undefined }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'No se pudo conectar el canal.')
      setConfig({ page_id: pageId, instagram_account_id: instagramId, status: 'connected' })
      setAccessToken(''); setVerifyToken('')
      toast.success(`${meta.title} conectado correctamente.`)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'No se pudo conectar el canal.')
    } finally { setSaving(false) }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start gap-3">
        <div className="rounded-md border p-2"><Icon className="size-5" /></div>
        <div className="min-w-0"><CardTitle>{meta.title}</CardTitle><CardDescription>{meta.description}</CardDescription></div>
        {config?.status === 'connected' && <CheckCircle2 className="ml-auto size-5 shrink-0 text-emerald-600" />}
      </CardHeader>
      <CardContent className="space-y-4">
        {loading ? <Loader2 className="size-4 animate-spin text-muted-foreground" /> : <>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2"><Label htmlFor={`${channel}-page`}>Facebook Page ID</Label><Input id={`${channel}-page`} value={pageId} onChange={(event) => setPageId(event.target.value)} disabled={!canEdit} placeholder="123456789" /></div>
            {channel === 'instagram' && <div className="space-y-2"><Label htmlFor="instagram-account">Instagram Business Account ID</Label><Input id="instagram-account" value={instagramId} onChange={(event) => setInstagramId(event.target.value)} disabled={!canEdit} placeholder="ID de Instagram" /></div>}
            <div className="space-y-2"><Label htmlFor={`${channel}-token`}>Page Access Token</Label><Input id={`${channel}-token`} type="password" value={accessToken} onChange={(event) => setAccessToken(event.target.value)} disabled={!canEdit} placeholder="Token permanente de Meta" /></div>
            <div className="space-y-2"><Label htmlFor={`${channel}-verify`}>Webhook Verify Token</Label><Input id={`${channel}-verify`} type="password" value={verifyToken} onChange={(event) => setVerifyToken(event.target.value)} disabled={!canEdit} placeholder="Token creado por ti" /></div>
          </div>
          <p className="text-xs text-muted-foreground">Webhook: {typeof window === 'undefined' ? '' : `${window.location.origin}/api/social/webhook`}</p>
          {canEdit && <Button onClick={save} disabled={saving}>{saving && <Loader2 className="mr-2 size-4 animate-spin" />}Guardar conexión</Button>}
        </>}
      </CardContent>
    </Card>
  )
}

export function SocialChannelsConfig() {
  const { canEditSettings } = useAuth()
  return <div className="space-y-6"><SettingsPanelHead title="Canales sociales" description="Centraliza Instagram y Facebook Messenger junto a tu WhatsApp principal." /><div className="grid gap-6 xl:grid-cols-2"><ChannelForm channel="instagram" canEdit={canEditSettings} /><ChannelForm channel="messenger" canEdit={canEditSettings} /></div></div>
}
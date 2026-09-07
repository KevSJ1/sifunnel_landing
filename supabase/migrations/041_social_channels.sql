-- Social channels (Instagram Messaging API + Facebook Messenger).
-- WhatsApp keeps its existing table and behavior; these rows are additive.

CREATE TABLE IF NOT EXISTS social_channel_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  channel TEXT NOT NULL CHECK (channel IN ('instagram', 'messenger')),
  page_id TEXT NOT NULL,
  instagram_account_id TEXT,
  access_token TEXT NOT NULL,
  verify_token TEXT,
  status TEXT NOT NULL DEFAULT 'disconnected' CHECK (status IN ('connected', 'disconnected')),
  connected_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (account_id, channel)
);

ALTER TABLE social_channel_configs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS social_channel_configs_select ON social_channel_configs;
CREATE POLICY social_channel_configs_select ON social_channel_configs
  FOR SELECT USING (is_account_member(account_id));
DROP POLICY IF EXISTS social_channel_configs_insert ON social_channel_configs;
CREATE POLICY social_channel_configs_insert ON social_channel_configs
  FOR INSERT WITH CHECK (is_account_member(account_id, 'admin'));
DROP POLICY IF EXISTS social_channel_configs_update ON social_channel_configs;
CREATE POLICY social_channel_configs_update ON social_channel_configs
  FOR UPDATE USING (is_account_member(account_id, 'admin'));
DROP POLICY IF EXISTS social_channel_configs_delete ON social_channel_configs;
CREATE POLICY social_channel_configs_delete ON social_channel_configs
  FOR DELETE USING (is_account_member(account_id, 'admin'));

CREATE OR REPLACE FUNCTION public.update_social_channel_configs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS social_channel_configs_updated_at ON social_channel_configs;
CREATE TRIGGER social_channel_configs_updated_at
  BEFORE UPDATE ON social_channel_configs
  FOR EACH ROW EXECUTE FUNCTION public.update_social_channel_configs_updated_at();

ALTER TABLE conversations
  ADD COLUMN IF NOT EXISTS channel TEXT NOT NULL DEFAULT 'whatsapp'
  CHECK (channel IN ('whatsapp', 'instagram', 'messenger'));

ALTER TABLE conversations
  ADD COLUMN IF NOT EXISTS external_contact_id TEXT;

CREATE INDEX IF NOT EXISTS idx_conversations_account_channel
  ON conversations(account_id, channel);
CREATE UNIQUE INDEX IF NOT EXISTS idx_conversations_social_contact
  ON conversations(account_id, channel, external_contact_id)
  WHERE external_contact_id IS NOT NULL;
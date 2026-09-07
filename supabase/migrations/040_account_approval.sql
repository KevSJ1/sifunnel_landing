-- New accounts remain blocked until an administrator approves them.
ALTER TABLE accounts
  ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;

-- Existing accounts were already active before this gate existed.
UPDATE accounts
SET approved_at = COALESCE(approved_at, created_at)
WHERE approved_at IS NULL;

CREATE OR REPLACE FUNCTION public.is_account_approved()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM profiles p
    JOIN accounts a ON a.id = p.account_id
    WHERE p.user_id = auth.uid()
      AND a.approved_at IS NOT NULL
  );
$$;

ALTER FUNCTION public.is_account_approved() OWNER TO postgres;
GRANT EXECUTE ON FUNCTION public.is_account_approved() TO authenticated, service_role;
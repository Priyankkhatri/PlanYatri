-- ── Add to existing schema (run in SQL Editor) ──

-- Trip Invites Table (for QR-based group joining)
CREATE TABLE IF NOT EXISTS public.trip_invites (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id     UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  created_by  UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  token       TEXT UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(24), 'base64url'),
  role        TEXT DEFAULT 'viewer' CHECK (role IN ('editor', 'viewer')),
  max_uses    INT DEFAULT 10,
  used_count  INT DEFAULT 0,
  expires_at  TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_invites_token   ON public.trip_invites(token);
CREATE INDEX IF NOT EXISTS idx_invites_trip    ON public.trip_invites(trip_id);

ALTER TABLE public.trip_invites ENABLE ROW LEVEL SECURITY;

-- Anyone (even unauthenticated) can READ an invite by token (to show trip preview)
DROP POLICY IF EXISTS "invites_select_by_token" ON public.trip_invites;
CREATE POLICY "invites_select_by_token" ON public.trip_invites FOR SELECT USING (TRUE);

-- Only trip owner can create invites
DROP POLICY IF EXISTS "invites_insert" ON public.trip_invites;
CREATE POLICY "invites_insert" ON public.trip_invites FOR INSERT WITH CHECK (
  trip_id IN (SELECT id FROM public.trips WHERE user_id = auth.uid())
);

-- Only trip owner can update/revoke invites
DROP POLICY IF EXISTS "invites_update" ON public.trip_invites;
CREATE POLICY "invites_update" ON public.trip_invites FOR UPDATE USING (
  trip_id IN (SELECT id FROM public.trips WHERE user_id = auth.uid())
);

DROP POLICY IF EXISTS "invites_delete" ON public.trip_invites;
CREATE POLICY "invites_delete" ON public.trip_invites FOR DELETE USING (
  trip_id IN (SELECT id FROM public.trips WHERE user_id = auth.uid())
);

-- Function: accept an invite (called from frontend with token)
CREATE OR REPLACE FUNCTION public.accept_trip_invite(p_token TEXT)
RETURNS JSONB LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_invite  public.trip_invites%ROWTYPE;
  v_trip    public.trips%ROWTYPE;
  v_user_id UUID := auth.uid();
BEGIN
  -- Must be logged in
  IF v_user_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'You must be logged in to join a trip.');
  END IF;

  -- Find invite
  SELECT * INTO v_invite FROM public.trip_invites WHERE token = p_token AND is_active = TRUE;
  IF NOT FOUND THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid or expired invite link.');
  END IF;

  -- Check expiry
  IF v_invite.expires_at < NOW() THEN
    RETURN jsonb_build_object('success', false, 'error', 'This invite has expired.');
  END IF;

  -- Check usage limit
  IF v_invite.used_count >= v_invite.max_uses THEN
    RETURN jsonb_build_object('success', false, 'error', 'This invite has reached its usage limit.');
  END IF;

  -- Get trip info
  SELECT * INTO v_trip FROM public.trips WHERE id = v_invite.trip_id;

  -- Add as member (ignore if already a member)
  INSERT INTO public.trip_members (trip_id, user_id, role)
  VALUES (v_invite.trip_id, v_user_id, v_invite.role)
  ON CONFLICT (trip_id, user_id) DO NOTHING;

  -- Increment usage
  UPDATE public.trip_invites SET used_count = used_count + 1 WHERE id = v_invite.id;

  RETURN jsonb_build_object(
    'success', true,
    'trip_id', v_invite.trip_id,
    'trip_title', v_trip.title,
    'trip_destination', v_trip.destination,
    'role', v_invite.role
  );
END;
$$;

-- ═══════════════════════════════════════════════════════════════════════
-- PLANYATRI — COMPLETE SUPABASE SCHEMA
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ═══════════════════════════════════════════════════════════════════════

-- ── Enable Required Extensions ──
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ══════════════════════════════════════════════════════════════════════
-- TABLE 1: PROFILES (extends auth.users)
-- ══════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name       TEXT,
  avatar_url      TEXT,
  bio             TEXT,
  location        TEXT,
  travel_style    TEXT DEFAULT 'Explorer',
  phone           TEXT,
  verified        BOOLEAN DEFAULT FALSE,
  trips_count     INT DEFAULT 0,
  countries_count INT DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ══════════════════════════════════════════════════════════════════════
-- TABLE 2: TRIPS
-- ══════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.trips (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title           TEXT NOT NULL,
  destination     TEXT NOT NULL,
  subtitle        TEXT,                        -- route e.g. "Paris → Rome → Barcelona"
  start_date      DATE,
  end_date        DATE,
  days            INT DEFAULT 1,
  status          TEXT DEFAULT 'Upcoming'
                  CHECK (status IN ('Upcoming','Ongoing','Completed','Wishlist')),
  budget_inr      NUMERIC(12,2) DEFAULT 0,
  spent_inr       NUMERIC(12,2) DEFAULT 0,
  progress        INT DEFAULT 0 CHECK (progress BETWEEN 0 AND 100),
  cover_image_url TEXT,
  notes           TEXT,
  is_public       BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- ══════════════════════════════════════════════════════════════════════
-- TABLE 3: TRIP MEMBERS (group trips / co-travellers)
-- ══════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.trip_members (
  id        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id   UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  role      TEXT DEFAULT 'viewer'
            CHECK (role IN ('owner','editor','viewer')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(trip_id, user_id)
);

-- ══════════════════════════════════════════════════════════════════════
-- TABLE 4: ITINERARY DAYS
-- ══════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.itinerary_days (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id     UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  day_number  INT NOT NULL,
  date        DATE,
  city        TEXT,
  theme       TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(trip_id, day_number)
);

-- ══════════════════════════════════════════════════════════════════════
-- TABLE 5: ACTIVITIES (per itinerary day)
-- ══════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.activities (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_id      UUID NOT NULL REFERENCES public.itinerary_days(id) ON DELETE CASCADE,
  trip_id     UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  time        TEXT,
  category    TEXT DEFAULT 'Sightseeing'
              CHECK (category IN ('Sightseeing','Food','Adventure','Hotel','Transport','Culture','Shopping','Other')),
  cost_inr    NUMERIC(10,2) DEFAULT 0,
  description TEXT,
  duration    TEXT,
  status      TEXT DEFAULT 'planned'
              CHECK (status IN ('planned','booked','completed','cancelled')),
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ══════════════════════════════════════════════════════════════════════
-- TABLE 6: BOOKINGS
-- ══════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.bookings (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id          UUID REFERENCES public.trips(id) ON DELETE SET NULL,
  user_id          UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type             TEXT NOT NULL
                   CHECK (type IN ('flight','hotel','activity','transfer','visa','insurance','other')),
  title            TEXT NOT NULL,
  provider         TEXT,
  reference_number TEXT,
  check_in         TIMESTAMPTZ,
  check_out        TIMESTAMPTZ,
  amount_inr       NUMERIC(12,2) DEFAULT 0,
  status           TEXT DEFAULT 'pending'
                   CHECK (status IN ('pending','confirmed','cancelled','completed')),
  documents_url    TEXT[],
  notes            TEXT,
  created_at       TIMESTAMPTZ DEFAULT NOW(),
  updated_at       TIMESTAMPTZ DEFAULT NOW()
);

-- ══════════════════════════════════════════════════════════════════════
-- TABLE 7: MESSAGES (real-time chat rooms)
-- ══════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.messages (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id      TEXT NOT NULL,               -- e.g. "contact_1" or "trip_<uuid>"
  user_id      UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  sender_name  TEXT,                         -- display name snapshot
  sender_type  TEXT DEFAULT 'user'
               CHECK (sender_type IN ('user','contact','ai','system')),
  text         TEXT NOT NULL,
  message_type TEXT DEFAULT 'text'
               CHECK (message_type IN ('text','image','system','ai')),
  read_by      UUID[] DEFAULT '{}',
  contact_id   TEXT,                         -- backwards-compat with existing code
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_messages_room_id   ON public.messages(room_id);
CREATE INDEX IF NOT EXISTS idx_messages_created   ON public.messages(created_at DESC);

-- ══════════════════════════════════════════════════════════════════════
-- TABLE 8: GROUP EXPENSES (Splitwise-like)
-- ══════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.group_expenses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id     UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  paid_by     UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  amount_inr  NUMERIC(12,2) NOT NULL CHECK (amount_inr > 0),
  split_type  TEXT DEFAULT 'equal'
              CHECK (split_type IN ('equal','individual','percentage')),
  category    TEXT DEFAULT 'General'
              CHECK (category IN ('Hotel','Food','Transport','Activity','Shopping','General','Other')),
  date        DATE DEFAULT CURRENT_DATE,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ══════════════════════════════════════════════════════════════════════
-- TABLE 9: EXPENSE SPLITS (who owes what)
-- ══════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.expense_splits (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  expense_id  UUID NOT NULL REFERENCES public.group_expenses(id) ON DELETE CASCADE,
  trip_id     UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  user_id     UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  member_name TEXT NOT NULL,                  -- name snapshot (works for non-users too)
  amount_owed NUMERIC(12,2) NOT NULL DEFAULT 0,
  settled     BOOLEAN DEFAULT FALSE,
  settled_at  TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ══════════════════════════════════════════════════════════════════════
-- TABLE 10: EMERGENCY CONTACTS
-- ══════════════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS public.emergency_contacts (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  phone        TEXT NOT NULL,
  relationship TEXT DEFAULT 'Family',
  country_code TEXT DEFAULT '+91',
  is_primary   BOOLEAN DEFAULT FALSE,
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- ════════════════════════════════════════════════════════════════════
-- INDEXES for performance
-- ════════════════════════════════════════════════════════════════════
CREATE INDEX IF NOT EXISTS idx_trips_user_id        ON public.trips(user_id);
CREATE INDEX IF NOT EXISTS idx_trips_status         ON public.trips(status);
CREATE INDEX IF NOT EXISTS idx_trip_members_trip    ON public.trip_members(trip_id);
CREATE INDEX IF NOT EXISTS idx_trip_members_user    ON public.trip_members(user_id);
CREATE INDEX IF NOT EXISTS idx_itinerary_trip       ON public.itinerary_days(trip_id);
CREATE INDEX IF NOT EXISTS idx_activities_trip      ON public.activities(trip_id);
CREATE INDEX IF NOT EXISTS idx_activities_day       ON public.activities(day_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user        ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_trip        ON public.bookings(trip_id);
CREATE INDEX IF NOT EXISTS idx_expenses_trip        ON public.group_expenses(trip_id);
CREATE INDEX IF NOT EXISTS idx_splits_expense       ON public.expense_splits(expense_id);
CREATE INDEX IF NOT EXISTS idx_splits_trip          ON public.expense_splits(trip_id);
CREATE INDEX IF NOT EXISTS idx_emergency_user       ON public.emergency_contacts(user_id);

-- ════════════════════════════════════════════════════════════════════
-- TRIGGER FUNCTIONS
-- ════════════════════════════════════════════════════════════════════

-- 1. Auto-create profile on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', NULL)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trips_updated_at ON public.trips;
CREATE TRIGGER trips_updated_at
  BEFORE UPDATE ON public.trips
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS bookings_updated_at ON public.bookings;
CREATE TRIGGER bookings_updated_at
  BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS activities_updated_at ON public.activities;
CREATE TRIGGER activities_updated_at
  BEFORE UPDATE ON public.activities
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- 3. Auto-recalculate trip spent_inr when activities change
CREATE OR REPLACE FUNCTION public.sync_trip_spent_inr()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE public.trips
  SET spent_inr = (
    SELECT COALESCE(SUM(cost_inr), 0)
    FROM public.activities
    WHERE trip_id = COALESCE(NEW.trip_id, OLD.trip_id)
  ) + (
    SELECT COALESCE(SUM(amount_inr), 0)
    FROM public.bookings
    WHERE trip_id = COALESCE(NEW.trip_id, OLD.trip_id)
      AND status = 'confirmed'
  )
  WHERE id = COALESCE(NEW.trip_id, OLD.trip_id);
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS activities_sync_spent ON public.activities;
CREATE TRIGGER activities_sync_spent
  AFTER INSERT OR UPDATE OR DELETE ON public.activities
  FOR EACH ROW EXECUTE FUNCTION public.sync_trip_spent_inr();

DROP TRIGGER IF EXISTS bookings_sync_spent ON public.bookings;
CREATE TRIGGER bookings_sync_spent
  AFTER INSERT OR UPDATE OR DELETE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.sync_trip_spent_inr();

-- 4. Auto-recalculate trip progress from completed activities
CREATE OR REPLACE FUNCTION public.sync_trip_progress()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
  v_total   INT;
  v_done    INT;
  v_trip_id UUID;
BEGIN
  v_trip_id := COALESCE(NEW.trip_id, OLD.trip_id);
  SELECT COUNT(*) INTO v_total FROM public.activities WHERE trip_id = v_trip_id;
  SELECT COUNT(*) INTO v_done  FROM public.activities WHERE trip_id = v_trip_id AND status = 'completed';
  IF v_total > 0 THEN
    UPDATE public.trips SET progress = ROUND((v_done::NUMERIC / v_total) * 100)
    WHERE id = v_trip_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS activities_sync_progress ON public.activities;
CREATE TRIGGER activities_sync_progress
  AFTER INSERT OR UPDATE OR DELETE ON public.activities
  FOR EACH ROW EXECUTE FUNCTION public.sync_trip_progress();

-- 5. Auto-add trip owner as trip_member on trip creation
CREATE OR REPLACE FUNCTION public.add_trip_owner_as_member()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  INSERT INTO public.trip_members (trip_id, user_id, role)
  VALUES (NEW.id, NEW.user_id, 'owner')
  ON CONFLICT (trip_id, user_id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trips_add_owner_member ON public.trips;
CREATE TRIGGER trips_add_owner_member
  AFTER INSERT ON public.trips
  FOR EACH ROW EXECUTE FUNCTION public.add_trip_owner_as_member();

-- 6. Update profile trips_count when trips are added/removed
CREATE OR REPLACE FUNCTION public.sync_profile_trips_count()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE public.profiles
  SET trips_count = (
    SELECT COUNT(*) FROM public.trips WHERE user_id = COALESCE(NEW.user_id, OLD.user_id)
  )
  WHERE id = COALESCE(NEW.user_id, OLD.user_id);
  RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS trips_sync_count ON public.trips;
CREATE TRIGGER trips_sync_count
  AFTER INSERT OR DELETE ON public.trips
  FOR EACH ROW EXECUTE FUNCTION public.sync_profile_trips_count();

-- ════════════════════════════════════════════════════════════════════
-- HELPER FUNCTIONS
-- ════════════════════════════════════════════════════════════════════

-- Get simplified debts for a trip (for expense splitter)
CREATE OR REPLACE FUNCTION public.get_trip_balances(p_trip_id UUID)
RETURNS TABLE (
  member_name TEXT,
  net_balance NUMERIC
) LANGUAGE sql STABLE AS $$
  SELECT
    es.member_name,
    SUM(
      CASE WHEN ge.paid_by = es.user_id THEN ge.amount_inr ELSE 0 END
      - es.amount_owed
    ) AS net_balance
  FROM public.expense_splits es
  JOIN public.group_expenses ge ON ge.id = es.expense_id
  WHERE ge.trip_id = p_trip_id
  GROUP BY es.member_name, es.user_id
  ORDER BY net_balance DESC;
$$;

-- ════════════════════════════════════════════════════════════════════
-- ROW LEVEL SECURITY
-- ════════════════════════════════════════════════════════════════════

ALTER TABLE public.profiles          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips             ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trip_members      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itinerary_days    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.group_expenses    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expense_splits    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_contacts ENABLE ROW LEVEL SECURITY;

-- ── profiles ──
DROP POLICY IF EXISTS "profiles_select" ON public.profiles;
CREATE POLICY "profiles_select" ON public.profiles FOR SELECT USING (
  auth.uid() = id OR
  id IN (SELECT user_id FROM public.trip_members WHERE trip_id IN (
    SELECT trip_id FROM public.trip_members WHERE user_id = auth.uid()
  ))
);
DROP POLICY IF EXISTS "profiles_insert" ON public.profiles;
CREATE POLICY "profiles_insert" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
DROP POLICY IF EXISTS "profiles_update" ON public.profiles;
CREATE POLICY "profiles_update" ON public.profiles FOR UPDATE USING (auth.uid() = id);
DROP POLICY IF EXISTS "profiles_delete" ON public.profiles;
CREATE POLICY "profiles_delete" ON public.profiles FOR DELETE USING (auth.uid() = id);

-- ── trips ──
DROP POLICY IF EXISTS "trips_select" ON public.trips;
CREATE POLICY "trips_select" ON public.trips FOR SELECT USING (
  user_id = auth.uid() OR
  is_public = TRUE OR
  id IN (SELECT trip_id FROM public.trip_members WHERE user_id = auth.uid())
);
DROP POLICY IF EXISTS "trips_insert" ON public.trips;
CREATE POLICY "trips_insert" ON public.trips FOR INSERT WITH CHECK (auth.uid() IS NOT NULL AND user_id = auth.uid());
DROP POLICY IF EXISTS "trips_update" ON public.trips;
CREATE POLICY "trips_update" ON public.trips FOR UPDATE USING (
  user_id = auth.uid() OR
  id IN (SELECT trip_id FROM public.trip_members WHERE user_id = auth.uid() AND role IN ('owner','editor'))
);
DROP POLICY IF EXISTS "trips_delete" ON public.trips;
CREATE POLICY "trips_delete" ON public.trips FOR DELETE USING (user_id = auth.uid());

-- ── trip_members ──
DROP POLICY IF EXISTS "trip_members_select" ON public.trip_members;
CREATE POLICY "trip_members_select" ON public.trip_members FOR SELECT USING (
  trip_id IN (SELECT trip_id FROM public.trip_members WHERE user_id = auth.uid())
);
DROP POLICY IF EXISTS "trip_members_insert" ON public.trip_members;
CREATE POLICY "trip_members_insert" ON public.trip_members FOR INSERT WITH CHECK (
  trip_id IN (SELECT id FROM public.trips WHERE user_id = auth.uid())
);
DROP POLICY IF EXISTS "trip_members_update" ON public.trip_members;
CREATE POLICY "trip_members_update" ON public.trip_members FOR UPDATE USING (
  trip_id IN (SELECT id FROM public.trips WHERE user_id = auth.uid())
);
DROP POLICY IF EXISTS "trip_members_delete" ON public.trip_members;
CREATE POLICY "trip_members_delete" ON public.trip_members FOR DELETE USING (
  trip_id IN (SELECT id FROM public.trips WHERE user_id = auth.uid())
);

-- ── itinerary_days ──
DROP POLICY IF EXISTS "itin_days_select" ON public.itinerary_days;
CREATE POLICY "itin_days_select" ON public.itinerary_days FOR SELECT USING (
  trip_id IN (SELECT id FROM public.trips WHERE user_id = auth.uid() OR is_public = TRUE)
  OR trip_id IN (SELECT trip_id FROM public.trip_members WHERE user_id = auth.uid())
);
DROP POLICY IF EXISTS "itin_days_insert" ON public.itinerary_days;
CREATE POLICY "itin_days_insert" ON public.itinerary_days FOR INSERT WITH CHECK (
  trip_id IN (SELECT id FROM public.trips WHERE user_id = auth.uid())
  OR trip_id IN (SELECT trip_id FROM public.trip_members WHERE user_id = auth.uid() AND role IN ('owner','editor'))
);
DROP POLICY IF EXISTS "itin_days_update" ON public.itinerary_days;
CREATE POLICY "itin_days_update" ON public.itinerary_days FOR UPDATE USING (
  trip_id IN (SELECT id FROM public.trips WHERE user_id = auth.uid())
  OR trip_id IN (SELECT trip_id FROM public.trip_members WHERE user_id = auth.uid() AND role IN ('owner','editor'))
);
DROP POLICY IF EXISTS "itin_days_delete" ON public.itinerary_days;
CREATE POLICY "itin_days_delete" ON public.itinerary_days FOR DELETE USING (
  trip_id IN (SELECT id FROM public.trips WHERE user_id = auth.uid())
);

-- ── activities ──
DROP POLICY IF EXISTS "activities_select" ON public.activities;
CREATE POLICY "activities_select" ON public.activities FOR SELECT USING (
  trip_id IN (SELECT id FROM public.trips WHERE user_id = auth.uid() OR is_public = TRUE)
  OR trip_id IN (SELECT trip_id FROM public.trip_members WHERE user_id = auth.uid())
);
DROP POLICY IF EXISTS "activities_insert" ON public.activities;
CREATE POLICY "activities_insert" ON public.activities FOR INSERT WITH CHECK (
  trip_id IN (SELECT id FROM public.trips WHERE user_id = auth.uid())
  OR trip_id IN (SELECT trip_id FROM public.trip_members WHERE user_id = auth.uid() AND role IN ('owner','editor'))
);
DROP POLICY IF EXISTS "activities_update" ON public.activities;
CREATE POLICY "activities_update" ON public.activities FOR UPDATE USING (
  trip_id IN (SELECT id FROM public.trips WHERE user_id = auth.uid())
  OR trip_id IN (SELECT trip_id FROM public.trip_members WHERE user_id = auth.uid() AND role IN ('owner','editor'))
);
DROP POLICY IF EXISTS "activities_delete" ON public.activities;
CREATE POLICY "activities_delete" ON public.activities FOR DELETE USING (
  trip_id IN (SELECT id FROM public.trips WHERE user_id = auth.uid())
);

-- ── bookings ──
DROP POLICY IF EXISTS "bookings_own" ON public.bookings;
CREATE POLICY "bookings_own" ON public.bookings FOR ALL USING (user_id = auth.uid());

-- ── messages ──
DROP POLICY IF EXISTS "messages_select" ON public.messages;
CREATE POLICY "messages_select" ON public.messages FOR SELECT USING (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "messages_insert" ON public.messages;
CREATE POLICY "messages_insert" ON public.messages FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
DROP POLICY IF EXISTS "messages_update" ON public.messages;
CREATE POLICY "messages_update" ON public.messages FOR UPDATE USING (user_id = auth.uid());

-- ── group_expenses ──
DROP POLICY IF EXISTS "expenses_select" ON public.group_expenses;
CREATE POLICY "expenses_select" ON public.group_expenses FOR SELECT USING (
  trip_id IN (SELECT trip_id FROM public.trip_members WHERE user_id = auth.uid())
  OR trip_id IN (SELECT id FROM public.trips WHERE user_id = auth.uid())
);
DROP POLICY IF EXISTS "expenses_insert" ON public.group_expenses;
CREATE POLICY "expenses_insert" ON public.group_expenses FOR INSERT WITH CHECK (
  trip_id IN (SELECT trip_id FROM public.trip_members WHERE user_id = auth.uid())
  OR trip_id IN (SELECT id FROM public.trips WHERE user_id = auth.uid())
);
DROP POLICY IF EXISTS "expenses_delete" ON public.group_expenses;
CREATE POLICY "expenses_delete" ON public.group_expenses FOR DELETE USING (
  trip_id IN (SELECT id FROM public.trips WHERE user_id = auth.uid())
  OR paid_by = auth.uid()
);

-- ── expense_splits ──
DROP POLICY IF EXISTS "splits_select" ON public.expense_splits;
CREATE POLICY "splits_select" ON public.expense_splits FOR SELECT USING (
  trip_id IN (SELECT trip_id FROM public.trip_members WHERE user_id = auth.uid())
  OR trip_id IN (SELECT id FROM public.trips WHERE user_id = auth.uid())
);
DROP POLICY IF EXISTS "splits_insert" ON public.expense_splits;
CREATE POLICY "splits_insert" ON public.expense_splits FOR INSERT WITH CHECK (
  trip_id IN (SELECT trip_id FROM public.trip_members WHERE user_id = auth.uid())
  OR trip_id IN (SELECT id FROM public.trips WHERE user_id = auth.uid())
);
DROP POLICY IF EXISTS "splits_update" ON public.expense_splits;
CREATE POLICY "splits_update" ON public.expense_splits FOR UPDATE USING (
  user_id = auth.uid() OR
  trip_id IN (SELECT id FROM public.trips WHERE user_id = auth.uid())
);

-- ── emergency_contacts ──
DROP POLICY IF EXISTS "emergency_own" ON public.emergency_contacts;
CREATE POLICY "emergency_own" ON public.emergency_contacts FOR ALL USING (user_id = auth.uid());

-- ════════════════════════════════════════════════════════════════════
-- ENABLE REALTIME for key tables
-- ════════════════════════════════════════════════════════════════════
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.trips;
ALTER PUBLICATION supabase_realtime ADD TABLE public.activities;
ALTER PUBLICATION supabase_realtime ADD TABLE public.group_expenses;
ALTER PUBLICATION supabase_realtime ADD TABLE public.expense_splits;

-- ════════════════════════════════════════════════════════════════════
-- STORAGE BUCKETS (run after schema)
-- ════════════════════════════════════════════════════════════════════
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('trip-covers',        'trip-covers',        TRUE,  5242880,  ARRAY['image/jpeg','image/png','image/webp']),
  ('activity-photos',    'activity-photos',     FALSE, 10485760, ARRAY['image/jpeg','image/png','image/webp']),
  ('booking-documents',  'booking-documents',   FALSE, 20971520, ARRAY['application/pdf','image/jpeg','image/png']),
  ('profile-avatars',    'profile-avatars',     TRUE,  3145728,  ARRAY['image/jpeg','image/png','image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Storage RLS for trip-covers (public read, auth upload)
DROP POLICY IF EXISTS "trip_covers_select" ON storage.objects;
CREATE POLICY "trip_covers_select" ON storage.objects FOR SELECT
  USING (bucket_id = 'trip-covers');

DROP POLICY IF EXISTS "trip_covers_insert" ON storage.objects;
CREATE POLICY "trip_covers_insert" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'trip-covers' AND auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "trip_covers_delete" ON storage.objects;
CREATE POLICY "trip_covers_delete" ON storage.objects FOR DELETE
  USING (bucket_id = 'trip-covers' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage RLS for profile-avatars (public read, own upload)
DROP POLICY IF EXISTS "avatars_select" ON storage.objects;
CREATE POLICY "avatars_select" ON storage.objects FOR SELECT
  USING (bucket_id = 'profile-avatars');

DROP POLICY IF EXISTS "avatars_insert" ON storage.objects;
CREATE POLICY "avatars_insert" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'profile-avatars' AND auth.uid() IS NOT NULL
    AND auth.uid()::text = (storage.foldername(name))[1]);

DROP POLICY IF EXISTS "avatars_update" ON storage.objects;
CREATE POLICY "avatars_update" ON storage.objects FOR UPDATE
  USING (bucket_id = 'profile-avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage RLS for booking-documents (private, own only)
DROP POLICY IF EXISTS "docs_own" ON storage.objects;
CREATE POLICY "docs_own" ON storage.objects FOR ALL
  USING (bucket_id = 'booking-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Storage RLS for activity-photos (trip members)
DROP POLICY IF EXISTS "activity_photos_insert" ON storage.objects;
CREATE POLICY "activity_photos_insert" ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'activity-photos' AND auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "activity_photos_select" ON storage.objects;
CREATE POLICY "activity_photos_select" ON storage.objects FOR SELECT
  USING (bucket_id = 'activity-photos' AND auth.uid() IS NOT NULL);

-- ════════════════════════════════════════════════════════════════════
-- SEED: Demo trip for new users (optional — remove if not needed)
-- ════════════════════════════════════════════════════════════════════
-- This is NOT inserted automatically; it's here as reference.
-- You can call supabaseService.seedDemoTrip(userId) from the frontend.

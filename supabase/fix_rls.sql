-- ============================================================
-- VisionFlow AI — RLS Fix
-- Run this in Supabase → SQL Editor → New Query
-- ============================================================

-- 1. Allow users to read profiles in their practice
drop policy if exists "profiles_select" on profiles;
create policy "profiles_select" on profiles for select
  using (
    id = auth.uid()
    or practice_id = get_my_practice_id()
  );

-- 2. Allow practices insert (for new signups)
drop policy if exists "practices_insert" on practices;
create policy "practices_insert" on practices for insert
  to authenticated
  with check (true);

-- 3. Allow conversations read
drop policy if exists "conversations_all" on conversations;
create policy "conversations_all" on conversations for all
  using (practice_id = get_my_practice_id());

-- 4. Allow messages read
drop policy if exists "messages_all" on messages;
create policy "messages_all" on messages for all
  using (practice_id = get_my_practice_id());

-- 5. Allow appointments read/write
drop policy if exists "appointments_all" on appointments;
create policy "appointments_all" on appointments for all
  using (practice_id = get_my_practice_id());

-- 6. Allow leads read
drop policy if exists "leads_all" on leads;
create policy "leads_all" on leads for all
  using (practice_id = get_my_practice_id());

-- 7. Allow escalations read
drop policy if exists "escalations_all" on escalations;
create policy "escalations_all" on escalations for all
  using (practice_id = get_my_practice_id());

-- 8. Allow kb_entries read
drop policy if exists "kb_entries_all" on kb_entries;
create policy "kb_entries_all" on kb_entries for all
  using (practice_id = get_my_practice_id());

-- 9. Fix the get_my_practice_id function to be more robust
create or replace function get_my_practice_id()
returns uuid language sql stable security definer
as $$
  select practice_id from profiles where id = auth.uid() limit 1
$$;

-- 10. Allow profile updates (for linking practice after signup)
drop policy if exists "profiles_update" on profiles;
create policy "profiles_update" on profiles for update
  using (id = auth.uid());

-- 11. Allow profile insert (for new users from auth trigger)
drop policy if exists "profiles_insert" on profiles;
drop policy if exists "profiles_insert_own" on profiles;
create policy "profiles_insert" on profiles for insert
  with check (id = auth.uid());

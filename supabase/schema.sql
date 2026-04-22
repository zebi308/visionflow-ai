-- ============================================================
-- VisionFlow AI — Supabase Schema
-- Run this entire file in Supabase > SQL Editor > New Query
-- ============================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── PRACTICES ───────────────────────────────────────────────────────────────
create table if not exists practices (
  id                      uuid primary key default uuid_generate_v4(),
  name                    text not null,
  type                    text not null default 'NHS & Private'
                            check (type in ('Independent','NHS & Private','Private Only','Domiciliary')),
  address                 text,
  city                    text,
  postcode                text,
  phone                   text,
  whatsapp_number         text,
  goc_number              text,
  cqc_registered          boolean not null default false,
  plan                    text not null default 'starter'
                            check (plan in ('starter','growth','practice','enterprise')),
  trial_ends_at           timestamptz,

  -- WhatsApp credentials (encrypted at rest by Supabase)
  wa_phone_number_id      text,
  wa_access_token         text,
  wa_verify_token         text,

  -- Knowledge base
  kb_doc_url              text,
  kb_namespace            text unique,

  -- AI config
  ai_personality          text not null default 'Friendly'
                            check (ai_personality in ('Professional','Friendly','Empathetic')),
  ai_greeting             text,
  ai_custom_instructions  text,

  -- Voice AI
  elevenlabs_voice        text not null default 'Sophie'
                            check (elevenlabs_voice in ('Sophie','James','Emma')),
  voice_forwarding_number text,
  after_hours_handling    text not null default 'continue',

  -- Notifications
  escalation_emails       text[],
  escalation_sms          text,
  out_of_hours_message    text,
  opening_hours           text,

  -- NHS region
  nhs_region              text,

  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

-- ─── PROFILES (extends Supabase auth.users) ───────────────────────────────────
create table if not exists profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  practice_id uuid references practices(id) on delete set null,
  name        text,
  role        text not null default 'Receptionist'
                check (role in ('Owner','Admin','Receptionist','Optometrist','Dispensing Optician','Support Manager')),
  created_at  timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, name)
  values (new.id, new.raw_user_meta_data->>'name');
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── CONVERSATIONS ────────────────────────────────────────────────────────────
create table if not exists conversations (
  id                 uuid primary key default uuid_generate_v4(),
  practice_id        uuid not null references practices(id) on delete cascade,
  patient_name       text,
  patient_phone      text not null,
  last_message       text,
  last_message_time  text,
  status             text not null default 'open'
                       check (status in ('open','ai-handled','escalated','booked','unread','closed')),
  ai_confidence      numeric not null default 0,
  assigned_to        text,
  labels             text[] not null default '{}',
  unread_count       integer not null default 0,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

-- ─── MESSAGES ─────────────────────────────────────────────────────────────────
create table if not exists messages (
  id               uuid primary key default uuid_generate_v4(),
  conversation_id  uuid not null references conversations(id) on delete cascade,
  practice_id      uuid not null references practices(id) on delete cascade,
  sender           text not null check (sender in ('patient','ai','staff')),
  text             text not null,
  type             text not null default 'text' check (type in ('text','voice','image','document')),
  metadata         jsonb,
  created_at       timestamptz not null default now()
);

-- ─── APPOINTMENTS ─────────────────────────────────────────────────────────────
create table if not exists appointments (
  id                   uuid primary key default uuid_generate_v4(),
  practice_id          uuid not null references practices(id) on delete cascade,
  patient_name         text not null,
  patient_phone        text not null,
  optometrist_name     text,
  service              text not null,
  nhs_funded           boolean not null default false,
  nhs_exemption_reason text,
  date                 date not null,
  time                 time not null,
  duration             integer not null default 30,
  status               text not null default 'pending'
                         check (status in ('confirmed','pending','completed','cancelled','dna')),
  booked_via           text not null default 'manual'
                         check (booked_via in ('whatsapp-ai','voice-ai','manual','online')),
  notes                text,
  created_at           timestamptz not null default now(),
  updated_at           timestamptz not null default now()
);

-- ─── LEADS ────────────────────────────────────────────────────────────────────
create table if not exists leads (
  id              uuid primary key default uuid_generate_v4(),
  practice_id     uuid not null references practices(id) on delete cascade,
  name            text not null,
  phone           text not null,
  category        text not null default 'other',
  score           integer not null default 50,
  summary         text,
  last_contact    date,
  status          text not null default 'new'
                    check (status in ('new','contacted','qualified','converted','lost')),
  is_nhs_eligible boolean not null default false,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ─── ESCALATIONS ──────────────────────────────────────────────────────────────
create table if not exists escalations (
  id            uuid primary key default uuid_generate_v4(),
  practice_id   uuid not null references practices(id) on delete cascade,
  patient_name  text not null,
  patient_phone text not null,
  reason        text not null,
  summary       text,
  status        text not null default 'open'
                  check (status in ('open','in-progress','resolved')),
  assigned_to   text,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ─── KNOWLEDGE BASE ENTRIES ───────────────────────────────────────────────────
create table if not exists kb_entries (
  id           uuid primary key default uuid_generate_v4(),
  practice_id  uuid not null references practices(id) on delete cascade,
  title        text not null,
  type         text not null default 'faq',
  chunk_count  integer not null default 0,
  word_count   integer,
  last_synced  timestamptz,
  status       text not null default 'pending'
                 check (status in ('synced','pending','error')),
  created_at   timestamptz not null default now()
);

-- ─── AUTO-UPDATE updated_at ───────────────────────────────────────────────────
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;
$$;

create trigger trg_practices_updated    before update on practices    for each row execute procedure update_updated_at();
create trigger trg_conversations_updated before update on conversations for each row execute procedure update_updated_at();
create trigger trg_appointments_updated  before update on appointments  for each row execute procedure update_updated_at();
create trigger trg_leads_updated         before update on leads          for each row execute procedure update_updated_at();
create trigger trg_escalations_updated   before update on escalations   for each row execute procedure update_updated_at();

-- ─── ROW LEVEL SECURITY ───────────────────────────────────────────────────────
-- Each practice can only see its own data. Iron-clad isolation.

alter table practices    enable row level security;
alter table profiles     enable row level security;
alter table conversations enable row level security;
alter table messages     enable row level security;
alter table appointments enable row level security;
alter table leads        enable row level security;
alter table escalations  enable row level security;
alter table kb_entries   enable row level security;

-- Helper: get current user's practice_id
create or replace function get_my_practice_id()
returns uuid language sql stable security definer
as $$
  select practice_id from profiles where id = auth.uid()
$$;

-- PRACTICES: user can see/edit only their own practice
create policy "practices_select" on practices for select
  using (id = get_my_practice_id());
create policy "practices_update" on practices for update
  using (id = get_my_practice_id());

-- PROFILES: users manage their own profile
create policy "profiles_select" on profiles for select
  using (id = auth.uid() or practice_id = get_my_practice_id());
create policy "profiles_insert" on profiles for insert
  with check (id = auth.uid());
create policy "profiles_update" on profiles for update
  using (id = auth.uid());

-- CONVERSATIONS
create policy "conversations_all" on conversations for all
  using (practice_id = get_my_practice_id());

-- MESSAGES
create policy "messages_all" on messages for all
  using (practice_id = get_my_practice_id());

-- APPOINTMENTS
create policy "appointments_all" on appointments for all
  using (practice_id = get_my_practice_id());

-- LEADS
create policy "leads_all" on leads for all
  using (practice_id = get_my_practice_id());

-- ESCALATIONS
create policy "escalations_all" on escalations for all
  using (practice_id = get_my_practice_id());

-- KB ENTRIES
create policy "kb_entries_all" on kb_entries for all
  using (practice_id = get_my_practice_id());

-- ─── SERVICE ROLE BYPASS (for your backend/n8n to write data) ─────────────────
-- The service role key bypasses RLS by default in Supabase.
-- Use VITE_SUPABASE_SERVICE_KEY only in server-side code, NEVER in the browser.

-- ─── INDEXES for performance ──────────────────────────────────────────────────
create index if not exists idx_conversations_practice on conversations(practice_id);
create index if not exists idx_conversations_status   on conversations(practice_id, status);
create index if not exists idx_messages_conversation  on messages(conversation_id);
create index if not exists idx_appointments_practice  on appointments(practice_id);
create index if not exists idx_appointments_date      on appointments(practice_id, date);
create index if not exists idx_leads_practice         on leads(practice_id);
create index if not exists idx_escalations_practice   on escalations(practice_id, status);
create index if not exists idx_kb_entries_practice    on kb_entries(practice_id);

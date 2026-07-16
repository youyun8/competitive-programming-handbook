create extension if not exists pgcrypto;

create type public.lesson_progress_status as enum ('not-started', 'in-progress', 'completed');
create type public.exercise_progress_status as enum (
  'not-started', 'in-progress', 'needs-review', 'solved'
);

create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null default '' check (char_length(display_name) <= 80),
  avatar_url text check (avatar_url is null or char_length(avatar_url) <= 2048),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_settings (
  user_id uuid primary key references auth.users(id) on delete cascade,
  theme text not null default 'system' check (theme in ('light', 'dark', 'system')),
  font_size smallint not null default 17 check (font_size between 12 and 28),
  content_width smallint not null default 48 check (content_width between 32 and 80),
  code_font_size smallint not null default 14 check (code_font_size between 10 and 24),
  updated_at timestamptz not null default now()
);

create table public.lesson_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null check (char_length(lesson_id) between 1 and 120),
  status public.lesson_progress_status not null default 'not-started',
  percent smallint not null default 0 check (percent between 0 and 100),
  last_anchor text check (last_anchor is null or char_length(last_anchor) <= 240),
  last_read_at timestamptz,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, lesson_id),
  check ((status = 'completed' and percent = 100) or status <> 'completed')
);

create table public.exercise_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  exercise_id text not null check (char_length(exercise_id) between 1 and 120),
  status public.exercise_progress_status not null default 'not-started',
  review_note text check (review_note is null or char_length(review_note) <= 1000),
  last_practiced_at timestamptz,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  primary key (user_id, exercise_id)
);

create table public.exercise_notes (
  user_id uuid not null references auth.users(id) on delete cascade,
  exercise_id text not null check (char_length(exercise_id) between 1 and 120),
  solution text not null default '' check (char_length(solution) <= 65536),
  thought text not null default '' check (char_length(thought) <= 32768),
  language text not null default 'cpp17' check (language in ('cpp17', 'cpp20')),
  updated_at timestamptz not null default now(),
  primary key (user_id, exercise_id),
  check (char_length(solution) > 0 or char_length(thought) > 0)
);

create table public.bookmarks (
  user_id uuid not null references auth.users(id) on delete cascade,
  item_type text not null check (item_type in ('lesson', 'exercise')),
  item_id text not null check (char_length(item_id) between 1 and 120),
  created_at timestamptz not null default now(),
  primary key (user_id, item_type, item_id)
);

create table public.sync_receipts (
  user_id uuid not null references auth.users(id) on delete cascade,
  idempotency_key text not null check (char_length(idempotency_key) between 8 and 160),
  result jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  primary key (user_id, idempotency_key)
);

create index lesson_progress_user_updated_idx on public.lesson_progress (user_id, updated_at desc);
create index exercise_progress_user_updated_idx on public.exercise_progress (user_id, updated_at desc);
create index exercise_notes_user_updated_idx on public.exercise_notes (user_id, updated_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.set_exercise_completed_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.status = 'solved' then
    if tg_op = 'UPDATE' then
      new.completed_at = coalesce(old.completed_at, now());
    else
      new.completed_at = now();
    end if;
  else
    new.completed_at = null;
  end if;
  return new;
end;
$$;

create trigger profiles_updated_at before update on public.profiles
for each row execute function public.set_updated_at();
create trigger user_settings_updated_at before update on public.user_settings
for each row execute function public.set_updated_at();
create trigger lesson_progress_updated_at before update on public.lesson_progress
for each row execute function public.set_updated_at();
create trigger exercise_progress_updated_at before update on public.exercise_progress
for each row execute function public.set_updated_at();
create trigger exercise_progress_completed_at before insert or update on public.exercise_progress
for each row execute function public.set_exercise_completed_at();
create trigger exercise_notes_updated_at before update on public.exercise_notes
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (user_id, display_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'user_name', new.raw_user_meta_data ->> 'name', split_part(coalesce(new.email, ''), '@', 1)),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  insert into public.user_settings (user_id) values (new.id);
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.user_settings enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.exercise_progress enable row level security;
alter table public.exercise_notes enable row level security;
alter table public.bookmarks enable row level security;
alter table public.sync_receipts enable row level security;

create policy profiles_select_own on public.profiles for select to authenticated
using ((select auth.uid()) = user_id);
create policy profiles_insert_own on public.profiles for insert to authenticated
with check ((select auth.uid()) = user_id);
create policy profiles_update_own on public.profiles for update to authenticated
using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy settings_select_own on public.user_settings for select to authenticated
using ((select auth.uid()) = user_id);
create policy settings_insert_own on public.user_settings for insert to authenticated
with check ((select auth.uid()) = user_id);
create policy settings_update_own on public.user_settings for update to authenticated
using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

create policy lesson_progress_select_own on public.lesson_progress for select to authenticated
using ((select auth.uid()) = user_id);
create policy lesson_progress_insert_own on public.lesson_progress for insert to authenticated
with check ((select auth.uid()) = user_id);
create policy lesson_progress_update_own on public.lesson_progress for update to authenticated
using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy lesson_progress_delete_own on public.lesson_progress for delete to authenticated
using ((select auth.uid()) = user_id);

create policy exercise_progress_select_own on public.exercise_progress for select to authenticated
using ((select auth.uid()) = user_id);
create policy exercise_progress_insert_own on public.exercise_progress for insert to authenticated
with check ((select auth.uid()) = user_id);
create policy exercise_progress_update_own on public.exercise_progress for update to authenticated
using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy exercise_progress_delete_own on public.exercise_progress for delete to authenticated
using ((select auth.uid()) = user_id);

create policy exercise_notes_select_own on public.exercise_notes for select to authenticated
using ((select auth.uid()) = user_id);
create policy exercise_notes_insert_own on public.exercise_notes for insert to authenticated
with check ((select auth.uid()) = user_id);
create policy exercise_notes_update_own on public.exercise_notes for update to authenticated
using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy exercise_notes_delete_own on public.exercise_notes for delete to authenticated
using ((select auth.uid()) = user_id);

create policy bookmarks_select_own on public.bookmarks for select to authenticated
using ((select auth.uid()) = user_id);
create policy bookmarks_insert_own on public.bookmarks for insert to authenticated
with check ((select auth.uid()) = user_id);
create policy bookmarks_delete_own on public.bookmarks for delete to authenticated
using ((select auth.uid()) = user_id);

create policy sync_receipts_select_own on public.sync_receipts for select to authenticated
using ((select auth.uid()) = user_id);

revoke insert, update, delete on public.sync_receipts from anon, authenticated;

grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on public.profiles, public.user_settings, public.lesson_progress, public.exercise_progress, public.exercise_notes, public.bookmarks to authenticated;
grant select on public.sync_receipts to authenticated;

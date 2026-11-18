create table public.savitrix_favourites (
 user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
 prompt_id text not null check (char_length(prompt_id) between 1 and 100),
 created_at timestamptz not null default now(),
 primary key(user_id,prompt_id)
);
create table public.savitrix_saved_prompts (
 id uuid primary key default gen_random_uuid(),
 user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
 source_prompt_id text check (char_length(source_prompt_id) between 1 and 100),
 title text not null check(char_length(btrim(title)) between 1 and 160),
 content text not null check(char_length(btrim(content)) between 1 and 20000),
 created_at timestamptz not null default now(),
 updated_at timestamptz not null default now(),
 removed_at timestamptz
);
create index savitrix_saved_owner_date on public.savitrix_saved_prompts(user_id,created_at desc);
create table public.savitrix_teacher_preferences (
 user_id uuid primary key default auth.uid() references auth.users(id) on delete cascade,
 guide_completed_at timestamptz
);
alter table public.savitrix_favourites enable row level security;
alter table public.savitrix_saved_prompts enable row level security;
alter table public.savitrix_teacher_preferences enable row level security;
revoke all on public.savitrix_favourites, public.savitrix_saved_prompts, public.savitrix_teacher_preferences from public, anon, authenticated;
grant select,insert,delete on public.savitrix_favourites to authenticated;
grant select,insert,update on public.savitrix_saved_prompts, public.savitrix_teacher_preferences to authenticated;
create policy favourites_read on public.savitrix_favourites for select to authenticated using(user_id=(select auth.uid()));
create policy favourites_insert on public.savitrix_favourites for insert to authenticated with check(user_id=(select auth.uid()));
create policy favourites_delete on public.savitrix_favourites for delete to authenticated using(user_id=(select auth.uid()));
create policy saved_read on public.savitrix_saved_prompts for select to authenticated using(user_id=(select auth.uid()));
create policy saved_insert on public.savitrix_saved_prompts for insert to authenticated with check(user_id=(select auth.uid()));
create policy saved_update on public.savitrix_saved_prompts for update to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));
create policy preferences_read on public.savitrix_teacher_preferences for select to authenticated using(user_id=(select auth.uid()));
create policy preferences_insert on public.savitrix_teacher_preferences for insert to authenticated with check(user_id=(select auth.uid()));
create policy preferences_update on public.savitrix_teacher_preferences for update to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));
create function private.stamp_saved_prompt() returns trigger language plpgsql set search_path = '' as $$ begin new.updated_at=now(); if TG_OP='UPDATE' then new.created_at=old.created_at; end if; return new; end $$;
revoke all on function private.stamp_saved_prompt() from public,anon,authenticated;
create trigger stamp_saved_prompt before insert or update on public.savitrix_saved_prompts for each row execute function private.stamp_saved_prompt();

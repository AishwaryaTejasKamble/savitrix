-- Admin membership can only be changed by the database owner, never the browser.
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
create table public.savitrix_admins (user_id uuid primary key references auth.users(id) on delete cascade);
alter table public.savitrix_admins enable row level security;
revoke all on public.savitrix_admins from public,anon,authenticated;
grant select on public.savitrix_admins to authenticated;
revoke all on public.savitrix_admins from anon;
create policy admin_self on public.savitrix_admins for select to authenticated using (user_id = (select auth.uid()));
create table public.savitrix_directory (
 user_id uuid primary key references auth.users(id) on delete cascade,
 email text, full_name text, school_or_subject text,
 registered_at timestamptz not null, confirmed_at timestamptz, last_sign_in_at timestamptz
);
alter table public.savitrix_directory enable row level security;
revoke all on public.savitrix_directory from anon, authenticated;
grant select on public.savitrix_directory to authenticated;
create policy admin_directory on public.savitrix_directory for select to authenticated
 using (exists(select 1 from public.savitrix_admins a where a.user_id = (select auth.uid())));
create table public.savitrix_activity (
 user_id uuid primary key references public.savitrix_directory(user_id) on delete cascade,
 last_seen_at timestamptz not null default now()
);
alter table public.savitrix_activity enable row level security;
revoke all on public.savitrix_activity from anon, authenticated;
grant select, insert on public.savitrix_activity to authenticated;
grant update on public.savitrix_activity to authenticated;
create policy activity_read on public.savitrix_activity for select to authenticated
 using (user_id = (select auth.uid()) or exists(select 1 from public.savitrix_admins a where a.user_id = (select auth.uid())));
create policy activity_insert on public.savitrix_activity for insert to authenticated with check (user_id = (select auth.uid()));
create policy activity_update on public.savitrix_activity for update to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
-- Internal trigger only: copies a minimal directory, never credentials or tokens.
create function private.sync_savitrix_directory() returns trigger language plpgsql security definer set search_path = '' as $$
begin
 insert into public.savitrix_directory(user_id,email,full_name,school_or_subject,registered_at,confirmed_at,last_sign_in_at)
 values(new.id,new.email,left(coalesce(new.raw_user_meta_data->>'fullName',new.raw_user_meta_data->>'full_name','Teacher'),200),left(coalesce(new.raw_user_meta_data->>'schoolOrSubject',''),200),new.created_at,new.email_confirmed_at,new.last_sign_in_at)
 on conflict(user_id) do update set email=excluded.email, full_name=excluded.full_name, school_or_subject=excluded.school_or_subject, confirmed_at=excluded.confirmed_at,last_sign_in_at=excluded.last_sign_in_at;
 return new;
end $$;
revoke all on function private.sync_savitrix_directory() from public,anon,authenticated;
create trigger savitrix_directory_sync after insert or update of email, raw_user_meta_data, email_confirmed_at, last_sign_in_at on auth.users for each row execute function private.sync_savitrix_directory();
insert into public.savitrix_directory select id,email,left(coalesce(raw_user_meta_data->>'fullName',raw_user_meta_data->>'full_name','Teacher'),200),left(coalesce(raw_user_meta_data->>'schoolOrSubject',''),200),created_at,email_confirmed_at,last_sign_in_at from auth.users;
create function private.stamp_savitrix_activity() returns trigger language plpgsql set search_path = '' as $$ begin new.last_seen_at = now(); return new; end $$;
revoke all on function private.stamp_savitrix_activity() from public,anon,authenticated;
create trigger savitrix_activity_stamp before insert or update on public.savitrix_activity for each row execute function private.stamp_savitrix_activity();

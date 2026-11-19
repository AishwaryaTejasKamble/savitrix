-- Institute teachers keep individual accounts; only Savitrix admins approve full access.
create table public.savitrix_institutes (
 id uuid primary key default gen_random_uuid(),
 name text not null check(length(btrim(name)) between 2 and 160),
 coordinator_id uuid not null references public.savitrix_directory(user_id),
 full_access boolean not null default false,
 expires_at timestamptz,
 created_at timestamptz not null default now()
);
create index institutes_coordinator on public.savitrix_institutes(coordinator_id);
create table public.savitrix_institute_members (
 institute_id uuid not null references public.savitrix_institutes(id) on delete cascade,
 user_id uuid not null references public.savitrix_directory(user_id) on delete cascade,
 teacher_email text not null,
 teacher_name text not null,
 added_at timestamptz not null default now(),
 primary key(institute_id,user_id)
);
create index institute_members_user on public.savitrix_institute_members(user_id);
alter table public.savitrix_institutes enable row level security;
alter table public.savitrix_institute_members enable row level security;
-- Internal lookup avoids recursive institute/member policies. It never accepts a caller identity.
create function private.savitrix_manages_institute(target_id uuid) returns boolean
language sql stable security definer set search_path='' as $$
 select auth.uid() is not null and (
 exists(select 1 from public.savitrix_admins where user_id=auth.uid()) or
 exists(select 1 from public.savitrix_institutes where id=target_id and coordinator_id=auth.uid()));
$$;
revoke all on function private.savitrix_manages_institute(uuid) from public,anon,authenticated;
grant usage on schema private to authenticated;
grant execute on function private.savitrix_manages_institute(uuid) to authenticated;
revoke all on public.savitrix_institutes,public.savitrix_institute_members from public,anon,authenticated;
grant select on public.savitrix_institutes,public.savitrix_institute_members to authenticated;
grant insert(name,coordinator_id,full_access,expires_at),update(name,coordinator_id,full_access,expires_at) on public.savitrix_institutes to authenticated;
grant insert(institute_id,teacher_email),delete on public.savitrix_institute_members to authenticated;
grant all on public.savitrix_institutes,public.savitrix_institute_members to service_role;
create policy institutes_read on public.savitrix_institutes for select to authenticated using(
 private.savitrix_manages_institute(id) or exists(select 1 from public.savitrix_institute_members m where m.institute_id=id and m.user_id=(select auth.uid())));
create policy institutes_create on public.savitrix_institutes for insert to authenticated with check(exists(select 1 from public.savitrix_admins where user_id=(select auth.uid())));
create policy institutes_edit on public.savitrix_institutes for update to authenticated using(exists(select 1 from public.savitrix_admins where user_id=(select auth.uid()))) with check(exists(select 1 from public.savitrix_admins where user_id=(select auth.uid())));
create policy institute_members_read on public.savitrix_institute_members for select to authenticated using(user_id=(select auth.uid()) or private.savitrix_manages_institute(institute_id));
create policy institute_members_add on public.savitrix_institute_members for insert to authenticated with check(private.savitrix_manages_institute(institute_id));
create policy institute_members_remove on public.savitrix_institute_members for delete to authenticated using(private.savitrix_manages_institute(institute_id));
-- Resolve registered email server-side, exposing only the managed roster, never the directory.
create function private.savitrix_resolve_institute_member() returns trigger
language plpgsql security definer set search_path='' as $$
begin
 if auth.uid() is null or not private.savitrix_manages_institute(new.institute_id) then raise exception 'Institute coordinator access required' using errcode='42501';end if;
 select user_id,email,full_name into new.user_id,new.teacher_email,new.teacher_name from public.savitrix_directory where lower(email)=lower(btrim(new.teacher_email));
 if new.user_id is null then raise exception 'Ask this teacher to register first.';end if;
 new.added_at=now();return new;
end $$;
revoke all on function private.savitrix_resolve_institute_member() from public,anon,authenticated;
create trigger resolve_institute_member before insert on public.savitrix_institute_members for each row execute function private.savitrix_resolve_institute_member();
create table public.savitrix_announcements (
 id uuid primary key default gen_random_uuid(),
 title text not null check(length(btrim(title)) between 2 and 160),
 message text not null check(length(btrim(message)) between 5 and 2000),
 published boolean not null default false,
 expires_at timestamptz,
 created_at timestamptz not null default now()
);
alter table public.savitrix_announcements enable row level security;
revoke all on public.savitrix_announcements from public,anon,authenticated;
grant select on public.savitrix_announcements to authenticated;
grant insert(title,message,published,expires_at),update(title,message,published,expires_at) on public.savitrix_announcements to authenticated;
grant all on public.savitrix_announcements to service_role;
create policy announcements_read on public.savitrix_announcements for select to authenticated using((published and (expires_at is null or expires_at>now())) or exists(select 1 from public.savitrix_admins where user_id=(select auth.uid())));
create policy announcements_create on public.savitrix_announcements for insert to authenticated with check(exists(select 1 from public.savitrix_admins where user_id=(select auth.uid())));
create policy announcements_edit on public.savitrix_announcements for update to authenticated using(exists(select 1 from public.savitrix_admins where user_id=(select auth.uid()))) with check(exists(select 1 from public.savitrix_admins where user_id=(select auth.uid())));
create or replace function public.savitrix_has_full_access() returns boolean language sql stable security invoker set search_path='' as $$
 select auth.uid() is not null and (
 exists(select 1 from public.savitrix_admins where user_id=auth.uid()) or
 exists(select 1 from public.savitrix_team_access where user_id=auth.uid() and (expires_at is null or expires_at>now())) or
 exists(select 1 from public.savitrix_purchases where user_id=auth.uid() and revoked_at is null and starts_at<=now() and expires_at>now()) or
 exists(select 1 from public.savitrix_institutes i where i.full_access and (i.expires_at is null or i.expires_at>now()) and (i.coordinator_id=auth.uid() or exists(select 1 from public.savitrix_institute_members m where m.institute_id=i.id and m.user_id=auth.uid()))));
$$;
create function public.savitrix_access_status() returns jsonb language plpgsql stable security invoker set search_path='' as $$
declare grant_expiry timestamptz; institute public.savitrix_institutes; purchase public.savitrix_purchases;
begin
 if auth.uid() is null then raise exception 'Sign in required' using errcode='42501';end if;
 if exists(select 1 from public.savitrix_admins where user_id=auth.uid()) then return jsonb_build_object('kind','admin','label','Admin access','expires_at',null,'full_access',true);end if;
 select expires_at into grant_expiry from public.savitrix_team_access where user_id=auth.uid() and (expires_at is null or expires_at>now());
 if found then return jsonb_build_object('kind','team','label','Complimentary team access','expires_at',grant_expiry,'full_access',true);end if;
 select i.* into institute from public.savitrix_institutes i where i.full_access and (i.expires_at is null or i.expires_at>now()) and (i.coordinator_id=auth.uid() or exists(select 1 from public.savitrix_institute_members m where m.institute_id=i.id and m.user_id=auth.uid())) order by i.expires_at desc nulls first limit 1;
 if found then return jsonb_build_object('kind','institute','label','Institute access','institute_name',institute.name,'expires_at',institute.expires_at,'full_access',true);end if;
 select * into purchase from public.savitrix_purchases where user_id=auth.uid() and revoked_at is null and starts_at<=now() and expires_at>now() order by expires_at desc limit 1;
 if found then return jsonb_build_object('kind','test','label','Test purchase access','expires_at',purchase.expires_at,'full_access',true);end if;
 select * into purchase from public.savitrix_purchases where user_id=auth.uid() and expires_at<=now() order by expires_at desc limit 1;
 if found then return jsonb_build_object('kind','expired','label','Access expired · Free starter','expires_at',purchase.expires_at,'full_access',false);end if;
 return jsonb_build_object('kind','free','label','Free starter','expires_at',null,'full_access',false);
end $$;
revoke all on function public.savitrix_access_status() from public,anon,authenticated;
grant execute on function public.savitrix_access_status() to authenticated;

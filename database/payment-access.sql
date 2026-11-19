create table public.savitrix_team_access (
 user_id uuid primary key references auth.users(id) on delete cascade,
 granted_at timestamptz not null default now(),
 granted_by uuid not null default auth.uid() references auth.users(id),
 expires_at timestamptz
);
create table public.savitrix_payment_plans (
 id text primary key, name text not null,
 amount_paise integer check(amount_paise between 100 and 100000000),
 duration_days integer check(duration_days between 1 and 3650),
 enabled boolean not null default false,
 test_mode boolean not null default true check(test_mode=true)
);
insert into public.savitrix_payment_plans(id,name) values('teacher-library','Teacher library access');
create table public.savitrix_checkout_orders (
 order_id text primary key,user_id uuid not null references auth.users(id) on delete cascade,
 plan_id text not null references public.savitrix_payment_plans(id),
 amount_paise integer not null check(amount_paise>=100),
 duration_days integer not null check(duration_days>0),
 status text not null default 'created' check(status in ('created','paid')),
 test_mode boolean not null default true check(test_mode=true),
 created_at timestamptz not null default now()
);
create index checkout_owner on public.savitrix_checkout_orders(user_id);
create table public.savitrix_purchases (
 payment_id text primary key,order_id text not null unique references public.savitrix_checkout_orders(order_id),
 user_id uuid not null references auth.users(id) on delete cascade,
 starts_at timestamptz not null default now(),expires_at timestamptz not null,
 revoked_at timestamptz,test_mode boolean not null default true check(test_mode=true)
);
create index purchases_owner on public.savitrix_purchases(user_id);
create table public.savitrix_prompt_content (
 id text primary key references public.savitrix_prompt_catalogue(id),
 prompt text not null,problem text,solution_method text,is_free boolean not null default false
);
alter table public.savitrix_team_access enable row level security;
alter table public.savitrix_payment_plans enable row level security;
alter table public.savitrix_checkout_orders enable row level security;
alter table public.savitrix_purchases enable row level security;
alter table public.savitrix_prompt_content enable row level security;
revoke all on public.savitrix_team_access,public.savitrix_payment_plans,public.savitrix_checkout_orders,public.savitrix_purchases,public.savitrix_prompt_content from public,anon,authenticated;
grant select on public.savitrix_team_access,public.savitrix_payment_plans,public.savitrix_checkout_orders,public.savitrix_purchases,public.savitrix_prompt_content to authenticated;
grant insert(user_id,expires_at),delete on public.savitrix_team_access to authenticated;
grant all on public.savitrix_team_access,public.savitrix_payment_plans,public.savitrix_checkout_orders,public.savitrix_purchases,public.savitrix_prompt_content to service_role;
create policy team_read on public.savitrix_team_access for select to authenticated using(user_id=(select auth.uid()) or exists(select 1 from public.savitrix_admins where user_id=(select auth.uid())));
create policy team_add on public.savitrix_team_access for insert to authenticated with check(exists(select 1 from public.savitrix_admins where user_id=(select auth.uid())));
create policy team_remove on public.savitrix_team_access for delete to authenticated using(exists(select 1 from public.savitrix_admins where user_id=(select auth.uid())));
create policy plans_read on public.savitrix_payment_plans for select to authenticated using(true);
create policy orders_read on public.savitrix_checkout_orders for select to authenticated using(user_id=(select auth.uid()));
create policy purchases_read on public.savitrix_purchases for select to authenticated using(user_id=(select auth.uid()));
create function public.savitrix_has_full_access() returns boolean language sql stable security invoker set search_path='' as $$
 select auth.uid() is not null and (
 exists(select 1 from public.savitrix_admins where user_id=auth.uid()) or
 exists(select 1 from public.savitrix_team_access where user_id=auth.uid() and (expires_at is null or expires_at>now())) or
 exists(select 1 from public.savitrix_purchases where user_id=auth.uid() and revoked_at is null and starts_at<=now() and expires_at>now()));
$$;
revoke all on function public.savitrix_has_full_access() from public,anon,authenticated;
grant execute on function public.savitrix_has_full_access() to authenticated;
create policy content_read on public.savitrix_prompt_content for select to authenticated using(is_free or (select public.savitrix_has_full_access()));
create function public.savitrix_grant_team_access(target_email text) returns void language plpgsql security invoker set search_path='' as $$
declare target_id uuid;begin
 if not exists(select 1 from public.savitrix_admins where user_id=auth.uid()) then raise exception 'Admin access required' using errcode='42501';end if;
 select user_id into target_id from public.savitrix_directory where lower(email)=lower(btrim(target_email));
 if target_id is null then raise exception 'Ask this team member to register first, then add their email.';end if;
 insert into public.savitrix_team_access(user_id) values(target_id) on conflict do nothing;
end $$;
revoke all on function public.savitrix_grant_team_access(text) from public,anon,authenticated;
grant execute on function public.savitrix_grant_team_access(text) to authenticated;
-- Only the payment verifier service may call this atomic, replay-safe finaliser.
create function public.savitrix_finalize_test_payment(verified_order_id text,verified_payment_id text) returns timestamptz language plpgsql security invoker set search_path='' as $$
declare order_row public.savitrix_checkout_orders; expires timestamptz;begin
 select * into order_row from public.savitrix_checkout_orders where order_id=verified_order_id for update;
 if not found then raise exception 'Unknown checkout order';end if;
 select expires_at into expires from public.savitrix_purchases where order_id=verified_order_id;
 if found then return expires;end if;
 if order_row.status<>'created' or not order_row.test_mode then raise exception 'Invalid order state';end if;
 expires=now()+make_interval(days=>order_row.duration_days);
 insert into public.savitrix_purchases(payment_id,order_id,user_id,expires_at) values(verified_payment_id,verified_order_id,order_row.user_id,expires);
 update public.savitrix_checkout_orders set status='paid' where order_id=verified_order_id;
 return expires;
end $$;
revoke all on function public.savitrix_finalize_test_payment(text,text) from public,anon,authenticated;
grant execute on function public.savitrix_finalize_test_payment(text,text) to service_role;

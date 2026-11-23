-- Private, profile-owned values, separate from usage analytics and saved prompt copies.
create function private.savitrix_valid_customisation(value jsonb) returns boolean language plpgsql immutable security invoker set search_path='' as $$
declare entry record; nested record; values_map jsonb;
begin
 if jsonb_typeof(value)<>'object' or octet_length(value::text)>500000 or jsonb_typeof(value->'global') is distinct from 'object' or jsonb_typeof(value->'overrides') is distinct from 'object' then return false;end if;
 if (select count(*) from jsonb_object_keys(value))<>2 or (select count(*) from jsonb_object_keys(value->'global'))>200 or (select count(*) from jsonb_object_keys(value->'overrides'))>300 then return false;end if;
 for entry in select key,val from jsonb_each(value->'global') as t(key,val) loop
  if length(entry.key) not between 1 and 200 or entry.key in('__proto__','constructor','prototype') or jsonb_typeof(entry.val)<>'string' or length(entry.val#>>'{}')>2000 then return false;end if;
 end loop;
 for entry in select key,val from jsonb_each(value->'overrides') as t(key,val) loop
  if length(entry.key) not between 1 and 100 or entry.key in('__proto__','constructor','prototype') or jsonb_typeof(entry.val)<>'object' then return false;end if;
  if (select count(*) from jsonb_object_keys(entry.val))>200 then return false;end if;
  for nested in select key,val from jsonb_each(entry.val) as t(key,val) loop
   if length(nested.key) not between 1 and 200 or nested.key in('__proto__','constructor','prototype') or jsonb_typeof(nested.val)<>'string' or length(nested.val#>>'{}')>2000 then return false;end if;
  end loop;
 end loop;
 return true;
end $$;
revoke all on function private.savitrix_valid_customisation(jsonb) from public,anon,authenticated;
grant execute on function private.savitrix_valid_customisation(jsonb) to authenticated;
create table public.savitrix_customisation (
 user_id uuid primary key default auth.uid() references auth.users(id) on delete cascade,
 state jsonb not null default '{"global":{},"overrides":{}}'::jsonb check(private.savitrix_valid_customisation(state))
);
alter table public.savitrix_customisation enable row level security;
revoke all on public.savitrix_customisation from public,anon,authenticated;
grant select,insert,update on public.savitrix_customisation to authenticated;
grant all on public.savitrix_customisation to service_role;
create policy customisation_read on public.savitrix_customisation for select to authenticated using(user_id=(select auth.uid()));
create policy customisation_create on public.savitrix_customisation for insert to authenticated with check(user_id=(select auth.uid()));
create policy customisation_update on public.savitrix_customisation for update to authenticated using(user_id=(select auth.uid())) with check(user_id=(select auth.uid()));

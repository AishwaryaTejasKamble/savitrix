-- Run in SQL editor; all test writes roll back.
begin;
select set_config('savitrix.test_owner',(select user_id::text from public.savitrix_admins limit 1),true);
select set_config('savitrix.test_count',(select count(*)::text from public.savitrix_directory),true);
set local role authenticated;
select set_config('request.jwt.claim.sub',current_setting('savitrix.test_owner'),true);
do $$ begin
 if (select count(*) from public.savitrix_directory) <> current_setting('savitrix.test_count')::int then raise exception 'Owner cannot see directory'; end if;
 if has_table_privilege('authenticated','public.savitrix_admins','INSERT') or has_table_privilege('authenticated','public.savitrix_directory','UPDATE') then raise exception 'Unsafe write grants'; end if;
end $$;
insert into public.savitrix_activity(user_id,last_seen_at) values(current_setting('savitrix.test_owner')::uuid,'2000-01-01') on conflict(user_id) do update set user_id=excluded.user_id,last_seen_at=excluded.last_seen_at;
do $$ begin
 if not exists(select 1 from public.savitrix_activity where user_id=current_setting('savitrix.test_owner')::uuid and last_seen_at > now()-interval '1 minute') then raise exception 'Activity timestamp not server controlled'; end if;
end $$;
select set_config('request.jwt.claim.sub','00000000-0000-0000-0000-000000000001',true);
do $$ begin
 if exists(select 1 from public.savitrix_directory) or exists(select 1 from public.savitrix_admins) or exists(select 1 from public.savitrix_activity) then raise exception 'Nonadmin can read private data'; end if;
 begin
  insert into public.savitrix_activity(user_id) values(current_setting('savitrix.test_owner')::uuid);
  raise exception 'Cross-user activity insert was allowed';
 exception when insufficient_privilege then null;
 end;
 if has_table_privilege('anon','public.savitrix_directory','SELECT') or has_table_privilege('anon','public.savitrix_activity','SELECT') then raise exception 'Anonymous read access'; end if;
end $$;
rollback;
select 'Admin access checks passed' as result;

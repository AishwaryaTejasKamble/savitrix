begin;
select set_config('savitrix.owner',(select user_id::text from public.savitrix_admins limit 1),true);
select set_config('savitrix.other',(select user_id::text from public.savitrix_directory where user_id not in(select user_id from public.savitrix_admins) limit 1),true);
set local role authenticated;
select set_config('request.jwt.claim.sub',current_setting('savitrix.owner'),true);
insert into public.savitrix_customisation(user_id,state) values(auth.uid(),'{"global":{"Grade/Class":"6","Topic":"Plants"},"overrides":{"pb-1":{"[Topic]":"Water"}}}') on conflict(user_id) do update set state=excluded.state;
do $$begin
 if (select state->'global'->>'Topic' from public.savitrix_customisation where user_id=auth.uid())<>'Plants' then raise exception 'Values not saved';end if;
 if (select state->'overrides'->'pb-1'->>'[Topic]' from public.savitrix_customisation where user_id=auth.uid())<>'Water' then raise exception 'Overrides not saved';end if;
 begin update public.savitrix_customisation set user_id=current_setting('savitrix.other')::uuid where user_id=auth.uid();raise exception 'Ownership transfer allowed';exception when insufficient_privilege then null;end;
 begin update public.savitrix_customisation set state='{"global":[],"overrides":{}}' where user_id=auth.uid();raise exception 'Invalid structure saved';exception when check_violation then null;end;
end$$;
select set_config('request.jwt.claim.sub',current_setting('savitrix.other'),true);
do $$begin
 if exists(select 1 from public.savitrix_customisation where user_id=current_setting('savitrix.owner')::uuid) then raise exception 'Other profile values leaked';end if;
 begin insert into public.savitrix_customisation(user_id) values(current_setting('savitrix.owner')::uuid);raise exception 'Other profile write allowed';exception when insufficient_privilege then null;end;
end$$;
insert into public.savitrix_customisation(user_id,state) values(auth.uid(),'{"global":{"Topic":"Numbers"},"overrides":{}}') on conflict(user_id) do update set state=excluded.state;
select set_config('request.jwt.claim.sub',current_setting('savitrix.owner'),true);
do $$begin
 if exists(select 1 from public.savitrix_customisation where user_id=current_setting('savitrix.other')::uuid) then raise exception 'Admin can see teacher customisation';end if;
 if (select state->'global'->>'Topic' from public.savitrix_customisation where user_id=auth.uid())<>'Plants' then raise exception 'Second profile overwrote owner';end if;
end$$;
set local role anon;
do $$begin if has_table_privilege('anon','public.savitrix_customisation','SELECT') then raise exception 'Anonymous values exposed';end if;end$$;
rollback;
select 'Passed: shared values and overrides saved, profile isolation, admin privacy, ownership and structure validation' as result;

-- Transactional integration test. All users, grants, orders and logs roll back.
begin;
do $$
#variable_conflict use_variable
declare
  admin_id uuid:=gen_random_uuid(); broker_id uuid:=gen_random_uuid(); other_broker uuid:=gen_random_uuid();
  owner_id uuid:=gen_random_uuid(); other_owner uuid:=gen_random_uuid();
  order_id uuid; other_order uuid; affected integer; denied boolean;
begin
  insert into auth.users(id,email,role,aud) values
    (admin_id,admin_id||'@example.invalid','authenticated','authenticated'),
    (broker_id,broker_id||'@example.invalid','authenticated','authenticated'),
    (other_broker,other_broker||'@example.invalid','authenticated','authenticated'),
    (owner_id,owner_id||'@example.invalid','authenticated','authenticated'),
    (other_owner,other_owner||'@example.invalid','authenticated','authenticated');
  insert into public.staff_access(user_id,role) values(admin_id,'admin'),(broker_id,'broker'),(other_broker,'broker');
  perform set_config('request.jwt.claim.sub',owner_id::text,true);
  execute 'set local role authenticated';
  insert into public.broker_orders(owner_id,domain_name,service_type,brief) values(owner_id,'test.example','sale','Test owner request') returning id into order_id;
  denied:=false;
  begin
    insert into public.staff_access(user_id,role,granted_by) values(owner_id,'admin',owner_id);
  exception when insufficient_privilege then denied:=true; end;
  if not denied then raise exception 'FAIL: owner can elevate role'; end if;
  denied:=false;
  begin
    insert into public.broker_orders(owner_id,domain_name,service_type,brief) values(other_owner,'spoof.example','sale','Spoof owner request');
  exception when insufficient_privilege then denied:=true; end;
  if not denied then raise exception 'FAIL: owner spoof accepted'; end if;
  perform set_config('request.jwt.claim.sub',other_owner::text,true);
  insert into public.broker_orders(owner_id,domain_name,service_type,brief) values(other_owner,'other.example','acquisition','Other owner request') returning id into other_order;
  if exists(select 1 from public.broker_orders where id=order_id) then raise exception 'FAIL: owner sees another owner order'; end if;
  perform set_config('request.jwt.claim.sub',admin_id::text,true);
  update public.broker_orders set broker_id=broker_id, status='assigned' where id=order_id;
  update public.broker_orders set broker_id=other_broker,status='assigned' where id=other_order;
  perform set_config('request.jwt.claim.sub',broker_id::text,true);
  if not exists(select 1 from public.broker_orders where id=order_id) then raise exception 'FAIL: broker cannot read assigned order'; end if;
  if exists(select 1 from public.broker_orders where id=other_order) then raise exception 'FAIL: broker sees other broker order'; end if;
  denied:=false;
  begin update public.broker_orders set brief='Tampered' where id=order_id;
  exception when insufficient_privilege then denied:=true; end;
  if not denied then raise exception 'FAIL: broker can edit immutable order fields'; end if;
  update public.broker_orders set status='accepted' where id=order_id;
  if (select version from public.broker_orders where id=order_id)<>3 then raise exception 'FAIL: version not incremented'; end if;
  update public.broker_orders set status='in_progress' where id=order_id and version=1;
  get diagnostics affected=row_count;
  if affected<>0 then raise exception 'FAIL: stale version accepted'; end if;
  insert into public.order_notes(order_id,author_id,body) values(order_id,broker_id,'Test private follow-up');
  perform set_config('request.jwt.claim.sub',owner_id::text,true);
  if exists(select 1 from public.order_notes where order_notes.order_id=order_id) then raise exception 'FAIL: customer sees internal notes'; end if;
  perform set_config('request.jwt.claim.sub',admin_id::text,true);
  update public.staff_access set can_update_orders=false,can_add_notes=false,granted_by=admin_id where user_id=broker_id;
  perform set_config('request.jwt.claim.sub',broker_id::text,true);
  denied:=false;
  begin update public.broker_orders set status='in_progress' where id=order_id;
  exception when insufficient_privilege then denied:=true; end;
  if not denied then raise exception 'FAIL: missing update permission ignored'; end if;
  denied:=false;
  begin insert into public.order_notes(order_id,author_id,body) values(order_id,broker_id,'Not allowed');
  exception when insufficient_privilege then denied:=true; end;
  if not denied then raise exception 'FAIL: missing notes permission ignored'; end if;
  perform set_config('request.jwt.claim.sub',admin_id::text,true);
  update public.staff_access set active=false,granted_by=admin_id where user_id=broker_id;
  perform set_config('request.jwt.claim.sub',broker_id::text,true);
  if exists(select 1 from public.broker_orders where id=order_id) then raise exception 'FAIL: suspended broker retains access'; end if;
  perform set_config('request.jwt.claim.sub',admin_id::text,true);
  update public.staff_access set active=true,can_update_orders=true,granted_by=admin_id where user_id=broker_id;
  perform set_config('request.jwt.claim.sub',broker_id::text,true);
  update public.broker_orders set status='in_progress' where id=order_id;
  update public.broker_orders set status='completed' where id=order_id;
  if exists(select 1 from public.admin_audit_log) then raise exception 'FAIL: broker can read audit log'; end if;
  perform set_config('request.jwt.claim.sub',admin_id::text,true);
  if not exists(select 1 from public.admin_audit_log where entity_id=order_id::text and details->>'status'='completed') then raise exception 'FAIL: missing completion audit'; end if;
  execute 'reset role';
end $$;
rollback;
select 'PASS: owner isolation, role escalation, assignment isolation, immutable fields, state transitions, version conflicts, notes privacy, scoped permissions, revocation, audit' as result;

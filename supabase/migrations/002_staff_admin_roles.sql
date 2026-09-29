-- Staff & admin role management
-- Roles are changed only through SECURITY DEFINER functions that verify the caller is an admin.

create or replace function public.list_manageable_profiles()
returns table (
  id uuid,
  full_name text,
  phone text,
  email text,
  role text,
  created_at timestamptz
)
language sql
security definer
set search_path = public, auth
as $$
  select p.id, p.full_name, p.phone, u.email, p.role, p.created_at
  from public.profiles p
  join auth.users u on u.id = p.id
  where exists (
    select 1 from public.profiles me
    where me.id = auth.uid() and me.role = 'admin'
  )
  order by p.created_at desc;
$$;

create or replace function public.assign_user_role(target_email text, target_role text)
returns json
language plpgsql
security definer
set search_path = public, auth
as $$
declare
  caller_role text;
  target_id uuid;
  target_current_role text;
begin
  select role into caller_role from public.profiles where id = auth.uid();
  if caller_role <> 'admin' then
    raise exception 'Only an admin can assign staff or admin roles';
  end if;

  if lower(trim(target_role)) not in ('customer','staff','admin') then
    raise exception 'Invalid role';
  end if;

  select id into target_id from auth.users where lower(email) = lower(trim(target_email));
  if target_id is null then
    raise exception 'No registered account exists for this email';
  end if;

  select role into target_current_role from public.profiles where id = target_id;

  if target_id = auth.uid() and lower(trim(target_role)) <> 'admin' then
    raise exception 'You cannot remove your own admin access';
  end if;

  if target_current_role = 'admin' and lower(trim(target_role)) <> 'admin' then
    if (select count(*) from public.profiles where role = 'admin') <= 1 then
      raise exception 'At least one admin account must remain';
    end if;
  end if;

  update public.profiles
  set role = lower(trim(target_role)), updated_at = now()
  where id = target_id;

  return json_build_object('success', true, 'user_id', target_id, 'role', lower(trim(target_role)));
end;
$$;

revoke all on function public.list_manageable_profiles() from public;
revoke all on function public.assign_user_role(text,text) from public;
grant execute on function public.list_manageable_profiles() to authenticated;
grant execute on function public.assign_user_role(text,text) to authenticated;

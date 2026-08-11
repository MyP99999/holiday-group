create or replace function public.prepare_account_deletion(p_user_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  owned_trip record;
  membership record;
  successor_member_id text;
  successor_user_id uuid;
  promoted_member_id text;
  deleted_trip_count integer := 0;
  transferred_trip_count integer := 0;
  removed_membership_count integer := 0;
begin
  if p_user_id is null then
    raise exception 'USER_REQUIRED';
  end if;

  -- An auth user cannot be deleted while they own a trip because trips.created_by
  -- intentionally uses ON DELETE RESTRICT. Hand an active trip to another account,
  -- or remove it when no authenticated successor exists.
  for owned_trip in
    select id
    from public.trips
    where created_by = p_user_id
    order by created_at
    for update
  loop
    successor_member_id := null;
    successor_user_id := null;

    select id, user_id
    into successor_member_id, successor_user_id
    from public.trip_members
    where trip_id = owned_trip.id
      and user_id is not null
      and user_id <> p_user_id
    order by (role = 'admin') desc, added_at asc
    limit 1
    for update;

    if successor_user_id is null then
      delete from public.trips where id = owned_trip.id;
      deleted_trip_count := deleted_trip_count + 1;
    else
      update public.trips
      set created_by = successor_user_id,
          updated_at = now()
      where id = owned_trip.id;

      update public.trip_members
      set role = 'admin'
      where id = successor_member_id;

      transferred_trip_count := transferred_trip_count + 1;
    end if;
  end loop;

  -- Remove the deleted account's people records. If it was the last admin in a
  -- trip it did not own, promote the most suitable remaining member first.
  for membership in
    select id, trip_id, role
    from public.trip_members
    where user_id = p_user_id
    order by added_at
    for update
  loop
    if membership.role = 'admin' and not exists (
      select 1
      from public.trip_members
      where trip_id = membership.trip_id
        and id <> membership.id
        and role = 'admin'
    ) then
      promoted_member_id := null;

      select id
      into promoted_member_id
      from public.trip_members
      where trip_id = membership.trip_id
        and id <> membership.id
      order by (user_id is not null) desc, added_at asc
      limit 1
      for update;

      if promoted_member_id is not null then
        update public.trip_members
        set role = 'admin'
        where id = promoted_member_id;
      end if;
    end if;

    delete from public.trip_members where id = membership.id;
    removed_membership_count := removed_membership_count + 1;
  end loop;

  return jsonb_build_object(
    'deletedTrips', deleted_trip_count,
    'transferredTrips', transferred_trip_count,
    'removedMemberships', removed_membership_count
  );
end;
$$;

revoke all on function public.prepare_account_deletion(uuid) from public, anon, authenticated;
grant execute on function public.prepare_account_deletion(uuid) to service_role;


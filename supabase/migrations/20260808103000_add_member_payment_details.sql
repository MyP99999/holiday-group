alter table public.trip_members
  add column if not exists account_holder text,
  add column if not exists iban text,
  add column if not exists payment_methods jsonb not null default '[]'::jsonb,
  add column if not exists payment_note text;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'trip_members_payment_methods_array'
      and conrelid = 'public.trip_members'::regclass
  ) then
    alter table public.trip_members
      add constraint trip_members_payment_methods_array
      check (jsonb_typeof(payment_methods) = 'array');
  end if;
end;
$$;

create or replace function public.get_trip_state(p_code text)
returns jsonb
language plpgsql
stable
security definer
set search_path = public, private, pg_temp
as $$
declare
  trip_row public.trips;
  current_member_id text;
begin
  select * into trip_row from public.trips where code = upper(trim(p_code));
  if trip_row.id is null or not private.is_trip_member(trip_row.id) then raise exception 'ROOM_NOT_FOUND_OR_FORBIDDEN'; end if;
  select id into current_member_id from public.trip_members where trip_id = trip_row.id and user_id = (select auth.uid());

  return jsonb_build_object(
    'tripId', trip_row.id,
    'roomCode', trip_row.code,
    'tripName', trip_row.name,
    'currentMemberId', current_member_id,
    'people', coalesce((select jsonb_agg(jsonb_build_object(
      'id', id, 'name', name, 'role', role, 'color', color, 'photoUrl', avatar_url,
      'accountHolder', coalesce(account_holder, ''), 'iban', coalesce(iban, ''),
      'paymentMethods', coalesce(payment_methods, '[]'::jsonb), 'paymentNote', coalesce(payment_note, ''),
      'addedAt', added_at, 'joinedAt', joined_at, 'claimedAt', claimed_at
    ) order by added_at) from public.trip_members where trip_id = trip_row.id), '[]'::jsonb),
    'expenses', coalesce((select jsonb_agg(payload order by created_at) from public.expenses where trip_id = trip_row.id), '[]'::jsonb),
    'accommodations', coalesce((select jsonb_agg(payload order by created_at) from public.accommodations where trip_id = trip_row.id), '[]'::jsonb),
    'vehicles', coalesce((select jsonb_agg(payload order by created_at) from public.vehicles where trip_id = trip_row.id), '[]'::jsonb),
    'flights', coalesce((select jsonb_agg(payload order by created_at) from public.flights where trip_id = trip_row.id), '[]'::jsonb),
    'polls', coalesce((select jsonb_agg(payload order by created_at desc) from public.trip_polls where trip_id = trip_row.id), '[]'::jsonb),
    'comments', coalesce((select jsonb_agg(payload order by created_at) from public.trip_comments where trip_id = trip_row.id), '[]'::jsonb),
    'chatMessages', coalesce((select jsonb_agg(payload order by created_at) from public.chat_messages where trip_id = trip_row.id), '[]'::jsonb),
    'paymentRoutes', coalesce((select jsonb_object_agg(route_key, coalesce(via_member_id, '')) from public.payment_routes where trip_id = trip_row.id), '{}'::jsonb),
    'settlementPayments', coalesce((select jsonb_agg(payload order by created_at) from public.settlement_payments where trip_id = trip_row.id), '[]'::jsonb)
  );
end;
$$;

create or replace function public.update_trip_member_payment_details(
  p_code text,
  p_member_id text,
  p_account_holder text,
  p_iban text,
  p_payment_methods jsonb,
  p_payment_note text
)
returns boolean
language plpgsql
security definer
set search_path = public, private, pg_temp
as $$
declare
  trip_row public.trips;
  caller_member_id text;
  target_user_id uuid;
begin
  select * into trip_row from public.trips where code = upper(trim(p_code));
  if trip_row.id is null or not private.is_trip_member(trip_row.id) then raise exception 'ROOM_NOT_FOUND_OR_FORBIDDEN'; end if;

  select id into caller_member_id
  from public.trip_members
  where trip_id = trip_row.id and user_id = (select auth.uid());

  select user_id into target_user_id
  from public.trip_members
  where trip_id = trip_row.id and id = p_member_id;

  if not found then raise exception 'MEMBER_NOT_FOUND'; end if;
  if caller_member_id is distinct from p_member_id
    and not (private.is_trip_admin(trip_row.id) and target_user_id is null)
  then
    raise exception 'MEMBER_PROFILE_FORBIDDEN';
  end if;

  if p_payment_methods is null or jsonb_typeof(p_payment_methods) <> 'array' or jsonb_array_length(p_payment_methods) > 20 then
    raise exception 'INVALID_PAYMENT_METHODS';
  end if;

  update public.trip_members
  set
    account_holder = nullif(left(trim(coalesce(p_account_holder, '')), 120), ''),
    iban = nullif(left(upper(regexp_replace(coalesce(p_iban, ''), '[^A-Za-z0-9]', '', 'g')), 34), ''),
    payment_methods = p_payment_methods,
    payment_note = nullif(left(trim(coalesce(p_payment_note, '')), 400), '')
  where trip_id = trip_row.id and id = p_member_id;

  update public.trips set updated_at = now() where id = trip_row.id;
  return true;
end;
$$;

revoke all on function public.get_trip_state(text) from public, anon;
grant execute on function public.get_trip_state(text) to authenticated;
revoke all on function public.update_trip_member_payment_details(text, text, text, text, jsonb, text) from public, anon;
grant execute on function public.update_trip_member_payment_details(text, text, text, text, jsonb, text) to authenticated;

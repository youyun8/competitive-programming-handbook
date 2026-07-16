\set ON_ERROR_STOP on

begin;

insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) values
  ('00000000-0000-0000-0000-00000000000a', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'a@example.test', crypt('password', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now()),
  ('00000000-0000-0000-0000-00000000000b', '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated', 'b@example.test', crypt('password', gen_salt('bf')), now(), '{"provider":"email","providers":["email"]}', '{}', now(), now())
on conflict do nothing;

insert into public.lesson_progress (user_id, lesson_id, status, percent)
values
  ('00000000-0000-0000-0000-00000000000a', 'binary-search', 'completed', 100),
  ('00000000-0000-0000-0000-00000000000b', 'bfs-dfs', 'in-progress', 50);

insert into public.exercise_progress (user_id, exercise_id, status)
values
  ('00000000-0000-0000-0000-00000000000a', 'first-not-less', 'in-progress'),
  ('00000000-0000-0000-0000-00000000000b', 'grid-shortest-path', 'needs-review');

insert into public.exercise_notes (user_id, exercise_id, thought)
values
  ('00000000-0000-0000-0000-00000000000a', 'first-not-less', 'check lower bound invariant'),
  ('00000000-0000-0000-0000-00000000000b', 'grid-shortest-path', 'review BFS boundary');

set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-0000-0000-00000000000a', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

do $$
begin
  if (select count(*) from public.lesson_progress) <> 1 then
    raise exception 'user A can see another user progress';
  end if;
  if exists (select 1 from public.profiles where user_id = '00000000-0000-0000-0000-00000000000b') then
    raise exception 'user A can see user B profile';
  end if;
  if (select count(*) from public.exercise_progress) <> 1 then
    raise exception 'user A can see another user exercise status';
  end if;
  if (select count(*) from public.exercise_notes) <> 1 then
    raise exception 'user A can see another user exercise note';
  end if;
  begin
    update public.lesson_progress set percent = 80
    where user_id = '00000000-0000-0000-0000-00000000000b';
    if found then raise exception 'user A updated user B progress'; end if;
  exception when insufficient_privilege then
    null;
  end;
  update public.exercise_progress set status = 'solved'
  where user_id = '00000000-0000-0000-0000-00000000000b';
  if found then raise exception 'user A updated user B exercise status'; end if;

  insert into public.exercise_progress (user_id, exercise_id, status)
  values ('00000000-0000-0000-0000-00000000000a', 'modular-power', 'needs-review');

  insert into public.exercise_notes (user_id, exercise_id, solution)
  values ('00000000-0000-0000-0000-00000000000a', 'modular-power', 'long long answer = 1;');
end;
$$;

reset role;
rollback;

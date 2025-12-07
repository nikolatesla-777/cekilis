-- Create a function to get random rows
create or replace function public.get_random_participants(draw_id_input uuid, count_input int)
returns setof public.participants
language sql
as $$
  select * from public.participants
  where draw_id = draw_id_input
  order by random()
  limit count_input;
$$;

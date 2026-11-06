create extension if not exists pgcrypto with schema extensions;

create table public.menu_items (
  id text primary key,
  category text not null,
  name text not null check (char_length(name) between 1 and 120),
  description text not null default '',
  price integer not null check (price between 1 and 1000000),
  image text not null,
  alt text not null default '',
  is_available boolean not null default true,
  sort_order integer not null default 0
);

insert into public.menu_items (id, category, name, description, price, image, alt, sort_order) values
  ('beef-grilled', 'Burgers', 'Authentic Grilled Beef Burger', 'Smoky flame-grilled beef, melted cheese, crisp lettuce & house sauce.', 650, 'hero-burger.webp', 'Close-up of a flame-grilled beef burger', 1),
  ('zinger', 'Burgers', 'Crispy Zinger Burger', 'Crunchy, juicy chicken with slaw and a cool, creamy sauce.', 520, 'zinger-burger.webp', 'Golden crispy chicken burger', 2),
  ('double-beef', 'Burgers', 'Double Smash Beef', 'Two seared beef patties, cheddar and a little extra attitude.', 850, 'double-burger.webp', 'Double beef cheeseburger with melted cheese', 3),
  ('beef-wrap', 'Wraps', 'Signature Beef Wrap', 'Grilled beef, warm flatbread, fresh vegetables and bold seasoning.', 580, 'beef-wrap.webp', 'Sliced beef wrap with fresh greens', 4),
  ('chicken-wrap', 'Wraps', 'Chicken Tikka Wrap', 'Smoky tikka chicken, crunchy salad and a tangy house drizzle.', 480, 'chicken-wrap.webp', 'Chicken wrap served with greens', 5),
  ('bbq-platter', 'Grill / BBQ', 'Mixed Grill Platter', 'A generous selection of char-grilled favourites, made to share.', 1850, 'bbq-platter.webp', 'Assorted barbecue meats fresh from the grill', 6),
  ('grilled-wings', 'Grill / BBQ', 'Smoky BBQ Wings', 'Juicy wings lacquered with a smoky, sticky barbecue glaze.', 720, 'bbq-wings.webp', 'Barbecue chicken wings with a glossy glaze', 7),
  ('pizza', 'Pizza', 'Tandoori Chicken Pizza', 'A golden, cheesy favourite with spiced chicken and peppers.', 1250, 'pizza.webp', 'Freshly baked pizza with bubbling cheese', 8),
  ('fries', 'Fries & Sides', 'Loaded Masala Fries', 'Crispy fries tossed in house masala. Perfect for the table.', 350, 'fries.webp', 'Crispy golden fries served with seasoning', 9),
  ('shake', 'Drinks', 'Chocolate Shake', 'Thick, chilled and made for that first sip after a spicy bite.', 390, 'chocolate-shake.webp', 'Rich chocolate milkshake topped with cream', 10),
  ('tea', 'Drinks', 'Doodh Patti Chai', 'A comforting, freshly brewed cup for long evenings and good chats.', 180, 'chai.webp', 'Steaming cup of Pakistani milk tea', 11),
  ('coffee', 'Drinks', 'Cafe Coffee', 'Smooth, warming coffee to round off your meal.', 280, 'coffee.webp', 'Freshly poured coffee in a ceramic cup', 12);

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique,
  customer_name text not null,
  phone text not null,
  fulfillment text not null check (fulfillment in ('dine-in', 'pickup', 'delivery')),
  delivery_address text not null default '',
  notes text not null default '',
  total integer not null check (total > 0),
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled')),
  created_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  menu_item_id text references public.menu_items(id) on delete set null,
  item_name text not null,
  quantity integer not null check (quantity between 1 and 20),
  unit_price integer not null check (unit_price > 0),
  line_total integer not null check (line_total > 0)
);

create index orders_created_at_idx on public.orders (created_at desc);
create index order_items_order_id_idx on public.order_items (order_id);

revoke all on table public.menu_items, public.orders, public.order_items from anon, authenticated;

create or replace function public.is_cafe_owner()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1
    from auth.users
    where users.id = auth.uid()
      and lower(coalesce(users.email, '')) = 'mittechandsolutions@gmail.com'
      and users.email_confirmed_at is not null
  );
$$;

revoke all on function public.is_cafe_owner() from public, anon;
grant execute on function public.is_cafe_owner() to authenticated;

alter table public.menu_items enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "Anyone can read the menu"
  on public.menu_items for select
  to anon, authenticated
  using (true);

create policy "Only the verified owner can update the menu"
  on public.menu_items for update
  to authenticated
  using (public.is_cafe_owner())
  with check (public.is_cafe_owner());

create policy "Only the verified owner can read orders"
  on public.orders for select
  to authenticated
  using (public.is_cafe_owner());

create policy "Only the verified owner can update order status"
  on public.orders for update
  to authenticated
  using (public.is_cafe_owner())
  with check (public.is_cafe_owner());

create policy "Only the verified owner can read order items"
  on public.order_items for select
  to authenticated
  using (
    public.is_cafe_owner()
    and exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
    )
  );

grant select on public.menu_items to anon, authenticated;
grant update (name, category, description, price, image, alt, is_available, sort_order)
  on public.menu_items to authenticated;
grant select on public.orders, public.order_items to authenticated;
grant update (status) on public.orders to authenticated;

create or replace function public.place_order(
  p_customer_name text,
  p_phone text,
  p_fulfillment text,
  p_delivery_address text,
  p_notes text,
  p_items jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_line jsonb;
  v_snapshot jsonb;
  v_snapshots jsonb := '[]'::jsonb;
  v_menu_item public.menu_items%rowtype;
  v_quantity integer;
  v_total integer := 0;
  v_order_id uuid;
  v_order_number text;
begin
  if char_length(btrim(coalesce(p_customer_name, ''))) not between 2 and 100 then
    raise exception 'Enter a name between 2 and 100 characters.';
  end if;
  if char_length(btrim(coalesce(p_phone, ''))) not between 6 and 30 then
    raise exception 'Enter a valid phone number.';
  end if;
  if p_fulfillment is null or p_fulfillment not in ('dine-in', 'pickup', 'delivery') then
    raise exception 'Choose dine-in, pickup, or delivery.';
  end if;
  if p_fulfillment = 'delivery' and char_length(btrim(coalesce(p_delivery_address, ''))) not between 5 and 300 then
    raise exception 'Enter a delivery address between 5 and 300 characters.';
  end if;
  if char_length(coalesce(p_notes, '')) > 500 then
    raise exception 'Order notes must be 500 characters or fewer.';
  end if;
  if jsonb_typeof(p_items) is distinct from 'array'
    or jsonb_array_length(p_items) not between 1 and 20 then
    raise exception 'An order must contain between 1 and 20 items.';
  end if;

  for v_line in select value from jsonb_array_elements(p_items)
  loop
    if coalesce(v_line ->> 'menu_item_id', '') = ''
      or coalesce(v_line ->> 'quantity', '') !~ '^[0-9]{1,2}$' then
      raise exception 'The order contains an invalid menu item or quantity.';
    end if;

    v_quantity := (v_line ->> 'quantity')::integer;
    if v_quantity not between 1 and 20 then
      raise exception 'Each item quantity must be between 1 and 20.';
    end if;

    select * into v_menu_item
    from public.menu_items
    where id = v_line ->> 'menu_item_id' and is_available
    for share;

    if not found then
      raise exception 'A menu item is no longer available. Refresh the menu and try again.';
    end if;

    v_total := v_total + v_menu_item.price * v_quantity;
    if v_total > 10000000 then
      raise exception 'The order total is too high.';
    end if;

    v_snapshots := v_snapshots || jsonb_build_array(jsonb_build_object(
      'menu_item_id', v_menu_item.id,
      'item_name', v_menu_item.name,
      'quantity', v_quantity,
      'unit_price', v_menu_item.price,
      'line_total', v_menu_item.price * v_quantity
    ));
  end loop;

  v_order_number := 'OC-' || to_char(now(), 'YYYYMMDD') || '-' ||
    upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 6));

  insert into public.orders (
    order_number, customer_name, phone, fulfillment, delivery_address, notes, total
  ) values (
    v_order_number,
    btrim(p_customer_name),
    btrim(p_phone),
    p_fulfillment,
    case when p_fulfillment = 'delivery' then btrim(p_delivery_address) else '' end,
    btrim(coalesce(p_notes, '')),
    v_total
  )
  returning id into v_order_id;

  for v_snapshot in select value from jsonb_array_elements(v_snapshots)
  loop
    insert into public.order_items (
      order_id, menu_item_id, item_name, quantity, unit_price, line_total
    ) values (
      v_order_id,
      v_snapshot ->> 'menu_item_id',
      v_snapshot ->> 'item_name',
      (v_snapshot ->> 'quantity')::integer,
      (v_snapshot ->> 'unit_price')::integer,
      (v_snapshot ->> 'line_total')::integer
    );
  end loop;

  return jsonb_build_object(
    'id', v_order_id,
    'order_number', v_order_number,
    'total', v_total
  );
end;
$$;

revoke all on function public.place_order(text, text, text, text, text, jsonb) from public;
grant execute on function public.place_order(text, text, text, text, text, jsonb) to anon, authenticated;

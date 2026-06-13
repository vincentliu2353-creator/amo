begin;

alter table public.products
  add column if not exists is_featured boolean not null default false,
  add column if not exists featured_order integer;

update public.products
set featured_order = null
where coalesce(is_featured, false) = false;

alter table public.products
  drop constraint if exists products_featured_selection_valid;

alter table public.products
  add constraint products_featured_selection_valid check (
    (
      is_featured = false
      and featured_order is null
    )
    or (
      is_featured = true
      and status = 'published'
      and (featured_order is null or featured_order between 1 and 10)
    )
  );

create unique index if not exists idx_products_featured_order_unique
on public.products (featured_order)
where is_featured and featured_order is not null;

create index if not exists idx_products_is_featured_order
on public.products (is_featured, featured_order, created_at desc)
where status = 'published';

create or replace function public.enforce_products_featured_limit()
returns trigger
language plpgsql
as $$
declare
  featured_count integer;
begin
  if new.is_featured is not true then
    return new;
  end if;

  select count(*)
  into featured_count
  from public.products
  where is_featured = true
    and id <> new.id;

  if featured_count >= 10 then
    raise exception 'A maximum of 10 products can be featured on the Products page.';
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_products_featured_limit on public.products;

create trigger enforce_products_featured_limit
before insert or update of is_featured on public.products
for each row
execute function public.enforce_products_featured_limit();

create or replace function public.set_products_page_featured_products(featured_products jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  selection_count integer;
begin
  if featured_products is null then
    featured_products := '[]'::jsonb;
  end if;

  if jsonb_typeof(featured_products) <> 'array' then
    raise exception 'Featured products payload must be an array.';
  end if;

  selection_count := jsonb_array_length(featured_products);

  if selection_count > 10 then
    raise exception 'A maximum of 10 featured products can be selected.';
  end if;

  create temporary table tmp_products_page_featured (
    product_id uuid primary key,
    featured_order integer
  ) on commit drop;

  insert into tmp_products_page_featured (product_id, featured_order)
  select
    (entry->>'id')::uuid,
    case
      when nullif(trim(entry->>'featuredOrder'), '') is null then null
      else (entry->>'featuredOrder')::integer
    end
  from jsonb_array_elements(featured_products) entry
  on conflict (product_id) do nothing;

  if (select count(*) from tmp_products_page_featured) <> selection_count then
    raise exception 'Duplicate products cannot be selected more than once.';
  end if;

  if exists (
    select 1
    from tmp_products_page_featured
    where featured_order is not null
      and (featured_order < 1 or featured_order > 10)
  ) then
    raise exception 'Featured order must be between 1 and 10.';
  end if;

  if exists (
    select featured_order
    from tmp_products_page_featured
    where featured_order is not null
    group by featured_order
    having count(*) > 1
  ) then
    raise exception 'Featured order values must be unique.';
  end if;

  if exists (
    select 1
    from tmp_products_page_featured selection
    left join public.products product on product.id = selection.product_id
    where product.id is null
       or product.status <> 'published'
  ) then
    raise exception 'Only published products can be featured on the Products page.';
  end if;

  update public.products
  set is_featured = false,
      featured_order = null
  where is_featured = true
     or featured_order is not null;

  update public.products product
  set is_featured = true,
      featured_order = selection.featured_order
  from tmp_products_page_featured selection
  where product.id = selection.product_id;
end;
$$;

grant execute on function public.set_products_page_featured_products(jsonb) to authenticated, service_role;

commit;

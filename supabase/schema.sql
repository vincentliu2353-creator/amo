-- AMO Supabase bootstrap schema
-- Review before applying to an existing database: this file recreates the AMO public schema from scratch.

begin;

create extension if not exists "pgcrypto";
create extension if not exists "citext";
create extension if not exists "pg_trgm";

drop table if exists public.case_products cascade;
drop table if exists public.favorites cascade;
drop table if exists public.rfq_items cascade;
drop table if exists public.rfq_requests cascade;
drop table if exists public.rfqs cascade;
drop table if exists public.product_images cascade;
drop table if exists public.product_variants cascade;
drop table if exists public.blogs cascade;
drop table if exists public.cases cascade;
drop table if exists public.case_studies cascade;
drop table if exists public.product_faqs cascade;
drop table if exists public.product_specs cascade;
drop table if exists public.products cascade;
drop table if exists public.categories cascade;
drop table if exists public.users cascade;

drop function if exists public.current_user_profile_id();
drop function if exists public.enforce_products_featured_limit();
drop function if exists public.is_admin();
drop function if exists public.set_products_page_featured_products(jsonb);
drop function if exists public.set_updated_at();

drop type if exists public.rfq_status cascade;
drop type if exists public.app_role cascade;
drop type if exists public.content_status cascade;

create type public.content_status as enum ('draft', 'published');
create type public.app_role as enum ('buyer', 'admin');
create type public.rfq_status as enum ('new', 'reviewing', 'quoted', 'won', 'lost');

create table public.users (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid unique references auth.users(id) on delete cascade,
  email citext not null unique,
  full_name text,
  company_name text,
  job_title text,
  phone text,
  avatar_url text,
  role public.app_role not null default 'buyer',
  is_active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint users_metadata_is_object check (jsonb_typeof(metadata) = 'object')
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid references public.categories(id) on delete set null,
  slug text not null unique,
  name text not null,
  short_description text,
  description text,
  status public.content_status not null default 'draft',
  sort_order integer not null default 0,
  seo_title text,
  seo_description text,
  seo_keywords text[] not null default '{}'::text[],
  canonical_url text,
  og_image_url text,
  search_text text generated always as (
    coalesce(name, '') || ' ' ||
    coalesce(short_description, '') || ' ' ||
    coalesce(description, '') || ' ' ||
    coalesce(seo_title, '') || ' ' ||
    coalesce(seo_description, '')
  ) stored,
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint categories_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint categories_published_at_required check (status <> 'published' or published_at is not null)
);

create table public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid not null references public.categories(id) on delete restrict,
  slug text not null unique,
  sku text unique,
  name text not null,
  series text,
  status public.content_status not null default 'draft',
  featured boolean not null default false,
  is_featured boolean not null default false,
  featured_order integer,
  summary text not null,
  description text not null,
  highlight text,
  lead_time_text text,
  min_order_qty integer check (min_order_qty is null or min_order_qty > 0),
  min_order_unit text default 'unit',
  hero_metric text,
  tags text[] not null default '{}'::text[],
  applications text[] not null default '{}'::text[],
  features text[] not null default '{}'::text[],
  specs jsonb not null default '{}'::jsonb,
  filter_attributes jsonb not null default '{}'::jsonb,
  faq_items jsonb not null default '[]'::jsonb,
  sort_order integer not null default 0,
  seo_title text,
  seo_description text,
  seo_keywords text[] not null default '{}'::text[],
  canonical_url text,
  og_image_url text,
  search_text text generated always as (
    coalesce(name, '') || ' ' ||
    coalesce(series, '') || ' ' ||
    coalesce(summary, '') || ' ' ||
    coalesce(description, '') || ' ' ||
    coalesce(highlight, '') || ' ' ||
    coalesce(seo_title, '') || ' ' ||
    coalesce(seo_description, '')
  ) stored,
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint products_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint products_specs_is_object check (jsonb_typeof(specs) = 'object'),
  constraint products_filter_attributes_is_object check (jsonb_typeof(filter_attributes) = 'object'),
  constraint products_faq_items_is_array check (jsonb_typeof(faq_items) = 'array'),
  constraint products_featured_selection_valid check (
    (
      is_featured = false
      and featured_order is null
    )
    or (
      is_featured = true
      and status = 'published'
      and (featured_order is null or featured_order between 1 and 10)
    )
  ),
  constraint products_published_at_required check (status <> 'published' or published_at is not null)
);

create table public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  sku text not null unique,
  slug text,
  name text not null,
  status public.content_status not null default 'draft',
  option_values jsonb not null default '{}'::jsonb,
  specs_override jsonb not null default '{}'::jsonb,
  lead_time_text text,
  min_order_qty integer check (min_order_qty is null or min_order_qty > 0),
  min_order_unit text default 'unit',
  is_default boolean not null default false,
  sort_order integer not null default 0,
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint product_variants_slug_format check (
    slug is null or slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'
  ),
  constraint product_variants_option_values_is_object check (jsonb_typeof(option_values) = 'object'),
  constraint product_variants_specs_override_is_object check (jsonb_typeof(specs_override) = 'object'),
  constraint product_variants_published_at_required check (status <> 'published' or published_at is not null)
);

create table public.product_images (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  image_url text not null,
  storage_path text,
  alt_text text,
  sort_order integer not null default 0,
  is_primary boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (product_id, sort_order)
);

create table public.cases (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  industry text,
  client_name text,
  summary text not null,
  challenge text,
  solution text,
  results jsonb not null default '[]'::jsonb,
  status public.content_status not null default 'draft',
  featured boolean not null default false,
  seo_title text,
  seo_description text,
  seo_keywords text[] not null default '{}'::text[],
  canonical_url text,
  og_image_url text,
  search_text text generated always as (
    coalesce(title, '') || ' ' ||
    coalesce(industry, '') || ' ' ||
    coalesce(client_name, '') || ' ' ||
    coalesce(summary, '') || ' ' ||
    coalesce(challenge, '') || ' ' ||
    coalesce(solution, '') || ' ' ||
    coalesce(seo_title, '') || ' ' ||
    coalesce(seo_description, '')
  ) stored,
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint cases_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint cases_results_is_array check (jsonb_typeof(results) = 'array'),
  constraint cases_published_at_required check (status <> 'published' or published_at is not null)
);

create table public.case_products (
  case_id uuid not null references public.cases(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  primary key (case_id, product_id)
);

create table public.blogs (
  id uuid primary key default gen_random_uuid(),
  author_user_id uuid references public.users(id) on delete set null,
  slug text not null unique,
  title text not null,
  excerpt text,
  body jsonb not null default '[]'::jsonb,
  category_label text,
  tags text[] not null default '{}'::text[],
  status public.content_status not null default 'draft',
  featured boolean not null default false,
  seo_title text,
  seo_description text,
  seo_keywords text[] not null default '{}'::text[],
  canonical_url text,
  og_image_url text,
  search_text text generated always as (
    coalesce(title, '') || ' ' ||
    coalesce(excerpt, '') || ' ' ||
    coalesce(category_label, '') || ' ' ||
    coalesce(seo_title, '') || ' ' ||
    coalesce(seo_description, '')
  ) stored,
  published_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint blogs_slug_format check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  constraint blogs_body_is_array check (jsonb_typeof(body) = 'array'),
  constraint blogs_published_at_required check (status <> 'published' or published_at is not null)
);

create table public.rfq_requests (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete set null,
  request_number text not null unique default (
    'RFQ-' ||
    to_char(timezone('utc', now()), 'YYYYMMDD') ||
    '-' ||
    upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))
  ),
  company_name text not null,
  contact_name text not null,
  email citext not null,
  phone text,
  country text,
  project_stage text,
  annual_volume text,
  message text,
  requirements jsonb not null default '{}'::jsonb,
  source text not null default 'website',
  status public.rfq_status not null default 'new',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint rfq_requests_requirements_is_object check (jsonb_typeof(requirements) = 'object')
);

create table public.rfq_items (
  id uuid primary key default gen_random_uuid(),
  rfq_request_id uuid not null references public.rfq_requests(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  variant_id uuid references public.product_variants(id) on delete set null,
  requested_qty integer not null check (requested_qty > 0),
  notes text,
  product_snapshot jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  constraint rfq_items_product_snapshot_is_object check (jsonb_typeof(product_snapshot) = 'object')
);

create table public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (user_id, product_id)
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create or replace function public.current_user_profile_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select u.id
  from public.users u
  where u.auth_user_id = auth.uid()
    and u.is_active = true
  limit 1;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users u
    where u.auth_user_id = auth.uid()
      and u.role = 'admin'
      and u.is_active = true
  );
$$;

grant execute on function public.current_user_profile_id() to anon, authenticated, service_role;
grant execute on function public.is_admin() to anon, authenticated, service_role;

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

create trigger set_users_updated_at
before update on public.users
for each row
execute function public.set_updated_at();

create trigger set_categories_updated_at
before update on public.categories
for each row
execute function public.set_updated_at();

create trigger set_products_updated_at
before update on public.products
for each row
execute function public.set_updated_at();

create trigger enforce_products_featured_limit
before insert or update of is_featured on public.products
for each row
execute function public.enforce_products_featured_limit();

create trigger set_product_variants_updated_at
before update on public.product_variants
for each row
execute function public.set_updated_at();

create trigger set_product_images_updated_at
before update on public.product_images
for each row
execute function public.set_updated_at();

create trigger set_cases_updated_at
before update on public.cases
for each row
execute function public.set_updated_at();

create trigger set_case_products_updated_at
before update on public.case_products
for each row
execute function public.set_updated_at();

create trigger set_blogs_updated_at
before update on public.blogs
for each row
execute function public.set_updated_at();

create trigger set_rfq_requests_updated_at
before update on public.rfq_requests
for each row
execute function public.set_updated_at();

create trigger set_rfq_items_updated_at
before update on public.rfq_items
for each row
execute function public.set_updated_at();

create trigger set_favorites_updated_at
before update on public.favorites
for each row
execute function public.set_updated_at();

create index idx_users_auth_user_id on public.users (auth_user_id);
create index idx_users_role_active on public.users (role, is_active);

create index idx_categories_parent_sort on public.categories (parent_id, sort_order);
create index idx_categories_status_sort on public.categories (status, sort_order);
create index idx_categories_search_text_trgm on public.categories using gin (search_text gin_trgm_ops);

create index idx_products_category_status on public.products (category_id, status, featured, sort_order);
create unique index idx_products_featured_order_unique
  on public.products (featured_order)
  where is_featured and featured_order is not null;
create index idx_products_is_featured_order
  on public.products (is_featured, featured_order, created_at desc)
  where status = 'published';
create index idx_products_published_at on public.products (published_at desc);
create index idx_products_name_trgm on public.products using gin (name gin_trgm_ops);
create index idx_products_search_text_trgm on public.products using gin (search_text gin_trgm_ops);
create index idx_products_tags_gin on public.products using gin (tags);
create index idx_products_applications_gin on public.products using gin (applications);
create index idx_products_specs_gin on public.products using gin (specs);
create index idx_products_filter_attributes_gin on public.products using gin (filter_attributes);

create index idx_product_variants_product_status on public.product_variants (product_id, status, is_default, sort_order);
create index idx_product_variants_option_values_gin on public.product_variants using gin (option_values);
create index idx_product_variants_specs_override_gin on public.product_variants using gin (specs_override);
create unique index idx_product_variants_one_default_per_product
  on public.product_variants (product_id)
  where is_default;

create index idx_product_images_product_sort on public.product_images (product_id, sort_order);
create unique index idx_product_images_one_primary_per_product
  on public.product_images (product_id)
  where is_primary;

create index idx_cases_status_featured on public.cases (status, featured, published_at desc);
create index idx_cases_search_text_trgm on public.cases using gin (search_text gin_trgm_ops);

create index idx_case_products_product_id on public.case_products (product_id);

create index idx_blogs_status_published on public.blogs (status, featured, published_at desc);
create index idx_blogs_author on public.blogs (author_user_id);
create index idx_blogs_tags_gin on public.blogs using gin (tags);
create index idx_blogs_search_text_trgm on public.blogs using gin (search_text gin_trgm_ops);

create index idx_rfq_requests_user_status on public.rfq_requests (user_id, status, created_at desc);
create index idx_rfq_requests_email on public.rfq_requests (email);
create index idx_rfq_requests_created_at on public.rfq_requests (created_at desc);

create index idx_rfq_items_request on public.rfq_items (rfq_request_id);
create index idx_rfq_items_product on public.rfq_items (product_id);
create index idx_rfq_items_variant on public.rfq_items (variant_id);

create index idx_favorites_user_created on public.favorites (user_id, created_at desc);
create index idx_favorites_product on public.favorites (product_id);

alter table public.users enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.product_images enable row level security;
alter table public.cases enable row level security;
alter table public.case_products enable row level security;
alter table public.blogs enable row level security;
alter table public.rfq_requests enable row level security;
alter table public.rfq_items enable row level security;
alter table public.favorites enable row level security;

create policy "admins manage users"
on public.users
for all
using (public.is_admin())
with check (public.is_admin());

create policy "users read own profile"
on public.users
for select
using (auth.uid() is not null and auth_user_id = auth.uid());

create policy "public read published categories"
on public.categories
for select
using (status = 'published');

create policy "admins manage categories"
on public.categories
for all
using (public.is_admin())
with check (public.is_admin());

create policy "public read published products"
on public.products
for select
using (status = 'published');

create policy "admins manage products"
on public.products
for all
using (public.is_admin())
with check (public.is_admin());

create policy "public read published product variants"
on public.product_variants
for select
using (
  status = 'published'
  and exists (
    select 1
    from public.products p
    where p.id = product_variants.product_id
      and p.status = 'published'
  )
);

create policy "admins manage product variants"
on public.product_variants
for all
using (public.is_admin())
with check (public.is_admin());

create policy "public read product images for published products"
on public.product_images
for select
using (
  exists (
    select 1
    from public.products p
    where p.id = product_images.product_id
      and p.status = 'published'
  )
);

create policy "admins manage product images"
on public.product_images
for all
using (public.is_admin())
with check (public.is_admin());

create policy "public read published cases"
on public.cases
for select
using (status = 'published');

create policy "admins manage cases"
on public.cases
for all
using (public.is_admin())
with check (public.is_admin());

create policy "public read published case products"
on public.case_products
for select
using (
  exists (
    select 1
    from public.cases c
    where c.id = case_products.case_id
      and c.status = 'published'
  )
  and exists (
    select 1
    from public.products p
    where p.id = case_products.product_id
      and p.status = 'published'
  )
);

create policy "admins manage case products"
on public.case_products
for all
using (public.is_admin())
with check (public.is_admin());

create policy "public read published blogs"
on public.blogs
for select
using (status = 'published');

create policy "admins manage blogs"
on public.blogs
for all
using (public.is_admin())
with check (public.is_admin());

create policy "public submit rfq requests"
on public.rfq_requests
for insert
with check (
  status = 'new'
  and source = 'website'
  and (user_id is null or user_id = public.current_user_profile_id())
);

create policy "users read own rfq requests"
on public.rfq_requests
for select
using (user_id = public.current_user_profile_id());

create policy "admins manage rfq requests"
on public.rfq_requests
for all
using (public.is_admin())
with check (public.is_admin());

create policy "public submit rfq items"
on public.rfq_items
for insert
with check (
  exists (
    select 1
    from public.rfq_requests r
    where r.id = rfq_items.rfq_request_id
  )
  and exists (
    select 1
    from public.products p
    where p.id = rfq_items.product_id
      and p.status = 'published'
  )
  and (
    rfq_items.variant_id is null
    or exists (
      select 1
      from public.product_variants v
      where v.id = rfq_items.variant_id
        and v.product_id = rfq_items.product_id
        and v.status = 'published'
    )
  )
);

create policy "users read rfq items for their own requests"
on public.rfq_items
for select
using (
  exists (
    select 1
    from public.rfq_requests r
    where r.id = rfq_items.rfq_request_id
      and r.user_id = public.current_user_profile_id()
  )
);

create policy "admins manage rfq items"
on public.rfq_items
for all
using (public.is_admin())
with check (public.is_admin());

create policy "users manage own favorites"
on public.favorites
for all
using (user_id = public.current_user_profile_id())
with check (user_id = public.current_user_profile_id());

create policy "admins manage favorites"
on public.favorites
for all
using (public.is_admin())
with check (public.is_admin());

commit;

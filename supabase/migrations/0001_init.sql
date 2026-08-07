-- Imóveis Archanjo — schema inicial (Fase 1)
-- Rode este arquivo inteiro no SQL Editor do Supabase (Project > SQL Editor > New query).

-- ============================================================================
-- PROFILES (1:1 com auth.users)
-- ============================================================================
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  full_name text not null default '',
  phone text,
  whatsapp text,
  creci text,
  role text not null default 'broker' check (role in ('admin', 'broker')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'blocked')),
  avatar_url text,
  bio text,
  instagram text,
  specialties text[],
  region text,
  created_at timestamptz not null default now()
);

-- Função auxiliar (SECURITY DEFINER) para checar admin sem recursão de RLS.
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles where id = auth.uid() and role = 'admin'
  );
$$;

-- Cria o profile automaticamente quando um usuário se cadastra.
-- O primeiro usuário do sistema vira admin aprovado automaticamente.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  existing_count int;
begin
  select count(*) into existing_count from public.profiles;

  insert into public.profiles (id, email, full_name, phone, creci, role, status)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'creci',
    case when existing_count = 0 then 'admin' else 'broker' end,
    case when existing_count = 0 then 'approved' else 'pending' end
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- PROPERTIES
-- ============================================================================
create table public.properties (
  id uuid primary key default gen_random_uuid(),
  broker_id uuid not null references public.profiles (id) on delete cascade,
  type text not null check (type in ('venda', 'aluguel', 'lancamento')),
  title text not null,
  description text,
  price numeric,
  condo_fee numeric,
  iptu numeric,
  street text,
  neighborhood text,
  city text,
  state text,
  zip text,
  bedrooms int,
  bathrooms int,
  parking_spots int,
  area_m2 numeric,
  furnished boolean not null default false,
  status text not null default 'disponivel' check (status in ('disponivel', 'reservado', 'vendido', 'alugado')),
  visible boolean not null default true,
  view_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index properties_broker_id_idx on public.properties (broker_id);
create index properties_type_idx on public.properties (type);
create index properties_city_idx on public.properties (city);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger properties_set_updated_at
  before update on public.properties
  for each row execute function public.set_updated_at();

create or replace function public.increment_property_view(property_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.properties set view_count = view_count + 1 where id = property_id;
end;
$$;

-- ============================================================================
-- PROPERTY PHOTOS
-- ============================================================================
create table public.property_photos (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties (id) on delete cascade,
  storage_path text not null,
  url text not null,
  sort_order int not null default 0,
  is_video boolean not null default false,
  created_at timestamptz not null default now()
);

create index property_photos_property_id_idx on public.property_photos (property_id);

-- ============================================================================
-- TESTIMONIALS
-- ============================================================================
create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  quote text not null,
  approved boolean not null default false,
  created_at timestamptz not null default now()
);

-- ============================================================================
-- SITE SETTINGS (linha única)
-- ============================================================================
create table public.site_settings (
  id int primary key default 1,
  site_name text not null default 'Imóveis Archanjo',
  logo_url text,
  hero_fallback_image_url text,
  hero_video_url text,
  constraint site_settings_singleton check (id = 1)
);

-- ============================================================================
-- RLS
-- ============================================================================
alter table public.profiles enable row level security;
alter table public.properties enable row level security;
alter table public.property_photos enable row level security;
alter table public.testimonials enable row level security;
alter table public.site_settings enable row level security;

-- profiles ------------------------------------------------------------------
create policy "profiles are publicly readable"
  on public.profiles for select
  to anon, authenticated
  using (true);

create policy "owners and admins can update profiles"
  on public.profiles for update
  to authenticated
  using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

-- Trigger de segurança: mesmo que um corretor envie role/status no payload,
-- só um admin consegue de fato alterar esses campos (evita auto-aprovação).
create or replace function public.protect_profile_role_status()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not public.is_admin() then
    new.role = old.role;
    new.status = old.status;
  end if;
  return new;
end;
$$;

create trigger profiles_protect_role_status
  before update on public.profiles
  for each row execute function public.protect_profile_role_status();

-- properties ------------------------------------------------------------------
create policy "visible properties are publicly readable"
  on public.properties for select
  to anon, authenticated
  using (visible = true or broker_id = auth.uid() or public.is_admin());

create policy "approved brokers can insert own properties"
  on public.properties for insert
  to authenticated
  with check (
    broker_id = auth.uid()
    and exists (select 1 from public.profiles where id = auth.uid() and status = 'approved')
  );

create policy "owners and admins can update properties"
  on public.properties for update
  to authenticated
  using (broker_id = auth.uid() or public.is_admin())
  with check (broker_id = auth.uid() or public.is_admin());

create policy "owners and admins can delete properties"
  on public.properties for delete
  to authenticated
  using (broker_id = auth.uid() or public.is_admin());

-- property_photos ------------------------------------------------------------------
create policy "photos of visible properties are publicly readable"
  on public.property_photos for select
  to anon, authenticated
  using (
    exists (
      select 1 from public.properties p
      where p.id = property_id and (p.visible = true or p.broker_id = auth.uid() or public.is_admin())
    )
  );

create policy "owners and admins can manage photos"
  on public.property_photos for all
  to authenticated
  using (
    exists (
      select 1 from public.properties p
      where p.id = property_id and (p.broker_id = auth.uid() or public.is_admin())
    )
  )
  with check (
    exists (
      select 1 from public.properties p
      where p.id = property_id and (p.broker_id = auth.uid() or public.is_admin())
    )
  );

-- testimonials ------------------------------------------------------------------
create policy "approved testimonials are publicly readable"
  on public.testimonials for select
  to anon, authenticated
  using (approved = true or public.is_admin());

create policy "anyone can submit a testimonial"
  on public.testimonials for insert
  to anon, authenticated
  with check (approved = false);

create policy "admins can moderate testimonials"
  on public.testimonials for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins can delete testimonials"
  on public.testimonials for delete
  to authenticated
  using (public.is_admin());

-- site_settings ------------------------------------------------------------------
create policy "site settings are publicly readable"
  on public.site_settings for select
  to anon, authenticated
  using (true);

create policy "admins can update site settings"
  on public.site_settings for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins can insert site settings"
  on public.site_settings for insert
  to authenticated
  with check (public.is_admin());

-- ============================================================================
-- STORAGE BUCKETS
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('property-photos', 'property-photos', true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

create policy "public read property photos"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'property-photos');

create policy "authenticated upload property photos"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'property-photos');

create policy "owners can delete their property photos"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'property-photos' and owner = auth.uid());

create policy "public read avatars"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'avatars');

create policy "authenticated upload avatars"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'avatars');

create policy "owners can update their avatar"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'avatars' and owner = auth.uid());

create policy "owners can delete their avatar"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'avatars' and owner = auth.uid());

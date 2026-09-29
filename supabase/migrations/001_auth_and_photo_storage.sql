-- Waldrift Mobile Car Wash: Supabase auth + vehicle photo storage
-- Run this migration in the Supabase SQL Editor for the project.

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text not null default '',
  role text not null default 'customer' check (role in ('customer','staff','admin')),
  referral_code text unique,
  referred_by text,
  discount_balance numeric not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile" on public.profiles for select using (auth.uid() = id);
drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile" on public.profiles for insert with check (auth.uid() = id);
drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone, role, referral_code)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name',''), coalesce(new.raw_user_meta_data->>'phone',''), 'customer', upper(split_part(coalesce(new.raw_user_meta_data->>'full_name','USER'),' ',1)) || '-' || floor(random()*900+100)::int)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

insert into storage.buckets (id,name,public) values ('vehicle-photos','vehicle-photos',true) on conflict (id) do update set public=true;

create table if not exists public.photo_references (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  bucket_id text not null default 'vehicle-photos',
  storage_path text not null,
  public_url text not null,
  file_name text not null,
  mime_type text,
  size_bytes bigint,
  created_at timestamptz not null default now()
);

alter table public.photo_references enable row level security;
drop policy if exists "Users can view their own photo references" on public.photo_references;
create policy "Users can view their own photo references" on public.photo_references for select using (auth.uid() = user_id);
drop policy if exists "Users can create their own photo references" on public.photo_references;
create policy "Users can create their own photo references" on public.photo_references for insert with check (auth.uid() = user_id);
drop policy if exists "Users can delete their own photo references" on public.photo_references;
create policy "Users can delete their own photo references" on public.photo_references for delete using (auth.uid() = user_id);

drop policy if exists "Authenticated users can upload vehicle photos" on storage.objects;
create policy "Authenticated users can upload vehicle photos" on storage.objects for insert to authenticated with check (bucket_id='vehicle-photos');
drop policy if exists "Authenticated users can update their vehicle photos" on storage.objects;
create policy "Authenticated users can update their vehicle photos" on storage.objects for update to authenticated using (bucket_id='vehicle-photos') with check (bucket_id='vehicle-photos');
drop policy if exists "Authenticated users can delete their vehicle photos" on storage.objects;
create policy "Authenticated users can delete their vehicle photos" on storage.objects for delete to authenticated using (bucket_id='vehicle-photos');

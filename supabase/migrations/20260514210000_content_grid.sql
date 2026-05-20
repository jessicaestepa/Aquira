-- Content grid for marketing / editorial tracking in admin.
create table if not exists content_items (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  title text not null,
  content_type text not null default 'other',
  status text not null default 'idea',
  pillar text,
  channel text,
  notes text,
  publish_url text,
  scheduled_for timestamptz,
  published_at timestamptz,
  tags text[] not null default '{}',
  sort_order integer not null default 0
);

create index if not exists idx_content_items_status on content_items (status);
create index if not exists idx_content_items_scheduled on content_items (scheduled_for);
create index if not exists idx_content_items_published on content_items (published_at desc);

create or replace function update_content_items_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists content_items_updated_at on content_items;
create trigger content_items_updated_at
  before update on content_items
  for each row execute function update_content_items_updated_at();

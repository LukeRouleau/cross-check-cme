-- Create enum for case status
create type case_status as enum (
  'draft',
  'submitted',
  'under_review',
  'in_progress',
  'declined',
  'completed'
);

-- Create table for Terms of Service versions
create table terms_of_service (
  id uuid primary key default gen_random_uuid(),
  "version" text not null unique,
  content text not null,
  effective_date date not null,
  created_at timestamp with time zone default now(),
  is_latest boolean default false -- Ensure only one is true through application logic or a trigger
);
alter table terms_of_service enable row level security;
create policy "Authenticated users can view ToS." on terms_of_service for select using (auth.role() = 'authenticated');
-- Add admin policies later for insert/update/delete if an admin role is defined, or use service_role key.


-- Create table for user agreements to Terms of Service
create table user_terms_agreement (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  terms_id uuid references terms_of_service on delete restrict not null,
  agreed_at timestamp with time zone default now(),
  unique(user_id, terms_id) -- A user agrees to a specific version once
);
alter table user_terms_agreement enable row level security;
create policy "Users can manage their own ToS agreements." on user_terms_agreement
  for all using (auth.uid() = user_id);
-- Admin select policy
create policy "Admins can view all ToS agreements." on user_terms_agreement
  for select using (true); -- Placeholder for specific admin role check


-- Create table for Cases
create table cases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone,
  status case_status default 'draft' not null,
  custom_instructions text,
  client_agreed_to_terms_id uuid references user_terms_agreement on delete set null, -- Link to the specific agreement
  payment_deposit_id text, -- Stripe PaymentIntent ID or Charge ID
  admin_feedback text, -- Reason for decline or other comments
  consultant_progress_notes text
);
alter table cases enable row level security;
create policy "Users can manage their own cases." on cases
  for all using (auth.uid() = user_id);
-- Admin policies (select all, update status/feedback/notes)
create policy "Admins can view all cases." on cases
  for select using (true); -- Placeholder for specific admin role check
create policy "Admins can update cases." on cases
  for update using (true) with check (true); -- Placeholder


-- Create table for Case Documents
create table case_documents (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references cases on delete cascade not null,
  user_id uuid references auth.users on delete cascade not null, -- To easily check ownership for RLS on storage
  file_name text not null,
  storage_path text not null unique, -- Path in Supabase Storage or other provider
  mime_type text,
  file_size_bytes bigint,
  uploaded_at timestamp with time zone default now()
);
alter table case_documents enable row level security;
create policy "Users can manage documents for their own cases." on case_documents
  for all using (auth.uid() = user_id and case_id in (select id from cases where user_id = auth.uid()));
-- Admin policies
create policy "Admins can view all case documents." on case_documents
  for select using (true); -- Placeholder
create policy "Admins can delete case documents." on case_documents
  for delete using (true); -- Placeholder

-- Create table for Admin Settings (singleton for general availability)
create table admin_settings (
  singleton_id boolean primary key default true check (singleton_id = true), -- Ensures only one row
  is_available boolean default true not null,
  availability_message text,
  updated_at timestamp with time zone
);
alter table admin_settings enable row level security;
create policy "Authenticated users can view admin settings." on admin_settings for select using (auth.role() = 'authenticated');
-- Admin update policy
create policy "Admins can update admin settings." on admin_settings
  for update using (true); -- Placeholder


-- Create table for Case Communications (replaces 'messages' to avoid conflict)
create table case_communications (
  id uuid primary key default gen_random_uuid(),
  case_id uuid references cases on delete cascade, -- Nullable for general inquiries
  sender_id uuid references auth.users on delete cascade not null,
  receiver_id uuid references auth.users on delete set null, -- Can be null if general admin message
  content text not null,
  created_at timestamp with time zone default now(),
  is_general_inquiry boolean default false not null,
  read_at timestamp with time zone
);
alter table case_communications enable row level security;
create policy "Users can manage their own communications." on case_communications
  for all using (
    auth.uid() = sender_id or
    auth.uid() = receiver_id or
    (case_id is not null and case_id in (select id from cases where user_id = auth.uid())) or
    (is_general_inquiry = true and receiver_id is null) -- Allow user to see their general inquiries sent to admin
  );
-- Admin select all policy
create policy "Admins can view all communications." on case_communications
  for select using (true); -- Placeholder

-- Function to update 'updated_at' timestamp
create function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Triggers to auto-update 'updated_at'
create trigger handle_updated_at_cases before update on cases
  for each row execute procedure public.update_updated_at_column();

create trigger handle_updated_at_admin_settings before update on admin_settings
  for each row execute procedure public.update_updated_at_column();

-- Consider adding an RLS policy for admin_settings to allow only a specific admin user_id to update,
-- or rely on service_role key for modifications.
-- For now, placeholders `using (true)` are used for admin policies. These should be refined
-- based on how you distinguish admin users (e.g., custom claim, separate table of admins).

-- Initial seed for admin_settings (optional, can be done via UI later)
insert into admin_settings (singleton_id, is_available, availability_message, updated_at)
values (true, true, 'Available for new cases.', now())
on conflict (singleton_id) do nothing;

-- Initial seed for terms_of_service (example)
insert into terms_of_service (version, content, effective_date, is_latest)
values ('1.0.0', 'Please read these terms carefully...', '2024-01-01', true)
on conflict (version) do nothing;
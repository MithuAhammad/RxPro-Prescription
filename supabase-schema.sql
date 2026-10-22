-- ডাক্তার ও অ্যাডমিন প্রোফাইল টেবিল
create table profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  role text default 'doctor', -- 'doctor' অথবা 'admin'
  status text default 'pending', -- 'pending' অথবা 'approved'
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- প্রেসক্রিপশন প্যাড সেটিংস টেবিল (অ্যাডমিন যা এডিট করবে)
create table pad_settings (
  id int primary key default 1,
  dr_eng_name text,
  dr_eng_degrees text,
  dr_eng_title text,
  dr_reg_no text,
  dr_bng_name text,
  dr_bng_degrees text,
  dr_bng_specialist text,
  dr_email text,
  visiting_time text,
  visiting_days text,
  chamber_name text,
  chamber_address text,
  chamber_phone text
);

alter table profiles enable row level security;
create policy "Allow all read profiles" on profiles for select using (true);
create policy "Allow user update profile" on profiles for update using (auth.uid() = id);
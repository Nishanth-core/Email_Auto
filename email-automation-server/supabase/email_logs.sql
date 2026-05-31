-- Supabase SQL Editor → New query → Run

create table if not exists email_logs (
  id bigint generated always as identity primary key,
  intern_name text,
  email text,
  email_type text,
  status text,
  sent_at timestamp default now(),
  error_message text,
  retry_count int default 0
);

CREATE TABLE IF NOT EXISTS email_logs (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  intern_name TEXT,
  email TEXT,
  email_type TEXT,
  status TEXT,
  sent_at TIMESTAMP DEFAULT NOW(),
  error_message TEXT,
  retry_count INT DEFAULT 0
);

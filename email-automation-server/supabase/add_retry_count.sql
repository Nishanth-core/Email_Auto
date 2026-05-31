-- Run in Supabase SQL Editor if email_logs already exists (Day 4 table)

alter table email_logs
add column if not exists retry_count int default 0;

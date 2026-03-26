-- Quick script to add apply_link to your existing tables
ALTER TABLE public.ai_jobs ADD COLUMN IF NOT EXISTS apply_link text;
ALTER TABLE public.remote_jobs ADD COLUMN IF NOT EXISTS apply_link text;

-- Run this script in your Supabase SQL editor to add the content column to your guides table
ALTER TABLE public.guides ADD COLUMN IF NOT EXISTS content text;

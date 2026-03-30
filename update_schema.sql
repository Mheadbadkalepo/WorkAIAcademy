-- Fix missing columns in user_access table
ALTER TABLE public.user_access 
ADD COLUMN IF NOT EXISTS consult_20_paid BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS consult_30_paid BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS consult_60_paid BOOLEAN DEFAULT false;

-- Create user_stats table if it doesn't exist (causing the 406 Not Acceptable error)
CREATE TABLE IF NOT EXISTS public.user_stats (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    success_rate INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Set up Row Level Security (RLS) for user_stats
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own stats" 
ON public.user_stats 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own stats" 
ON public.user_stats 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own stats" 
ON public.user_stats 
FOR UPDATE 
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

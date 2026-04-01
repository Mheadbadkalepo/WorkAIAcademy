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

-- Extra tracking fields for PesaPal reconciliation/reporting by email
ALTER TABLE public.payment_records
ADD COLUMN IF NOT EXISTS payer_email TEXT,
ADD COLUMN IF NOT EXISTS merchant_reference TEXT,
ADD COLUMN IF NOT EXISTS provider_transaction_code TEXT;

CREATE INDEX IF NOT EXISTS idx_payment_records_payer_email
ON public.payment_records (payer_email);

-- Query payments by user email with key references and method
CREATE OR REPLACE VIEW public.v_payment_records_by_email AS
SELECT
  pr.id,
  pr.user_id,
  COALESCE(pr.payer_email, p.email) AS email,
  pr.payment_reference,
  pr.merchant_reference,
  pr.provider_transaction_code,
  pr.payment_method,
  pr.product,
  pr.amount,
  pr.currency,
  pr.status,
  pr.created_at,
  pr.updated_at
FROM public.payment_records pr
LEFT JOIN public.profiles p ON p.id = pr.user_id;

CREATE OR REPLACE FUNCTION public.get_payment_records_by_email(p_email TEXT)
RETURNS TABLE (
  user_id UUID,
  email TEXT,
  payment_reference TEXT,
  merchant_reference TEXT,
  provider_transaction_code TEXT,
  payment_method TEXT,
  product TEXT,
  amount NUMERIC,
  currency TEXT,
  status TEXT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT
    v.user_id,
    v.email,
    v.payment_reference,
    v.merchant_reference,
    v.provider_transaction_code,
    v.payment_method,
    v.product,
    v.amount,
    v.currency,
    v.status,
    v.created_at,
    v.updated_at
  FROM public.v_payment_records_by_email v
  WHERE LOWER(v.email) = LOWER(p_email)
  ORDER BY v.created_at DESC;
$$;

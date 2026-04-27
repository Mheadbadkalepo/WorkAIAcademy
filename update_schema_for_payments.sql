-- Consolidated Database Fix for Payments and Access

-- 1. Ensure merchant_reference exists in payment_records
ALTER TABLE public.payment_records ADD COLUMN IF NOT EXISTS merchant_reference TEXT;

-- 2. Update the CHECK constraint on product to include all current products
-- We drop it first to ensure we can recreate it with the full list
ALTER TABLE public.payment_records DROP CONSTRAINT IF EXISTS payment_records_product_check;
ALTER TABLE public.payment_records ADD CONSTRAINT payment_records_product_check 
CHECK (product IN (
  'platform', 
  'low_guides', 
  'high_guides', 
  'consultation_20min', 
  'consultation_30min', 
  'consultation_60min', 
  'consultation'
));

-- 3. Ensure all access columns exist in user_access
ALTER TABLE public.user_access
  ADD COLUMN IF NOT EXISTS platform_unlocked boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS low_guides_unlocked boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS high_guides_unlocked boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS consult_20_paid boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS consult_30_paid boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS consult_60_paid boolean NOT NULL DEFAULT false;

-- 4. Ensure RLS is disabled for these tables to allow the webhook to function (since it uses a service role key or needs direct access)
ALTER TABLE public.user_access DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_records DISABLE ROW LEVEL SECURITY;

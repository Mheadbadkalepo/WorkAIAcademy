-- Fix the CHECK constraint that prevents consultation products from being saved
ALTER TABLE public.payment_records DROP CONSTRAINT IF EXISTS payment_records_product_check;
ALTER TABLE public.payment_records ADD CONSTRAINT payment_records_product_check 
CHECK (product IN ('platform', 'low_guides', 'high_guides', 'consultation_20min', 'consultation_30min', 'consultation_60min', 'consultation'));

-- Ensure merchant_reference exists just in case it doesn't 
ALTER TABLE public.payment_records ADD COLUMN IF NOT EXISTS merchant_reference TEXT;

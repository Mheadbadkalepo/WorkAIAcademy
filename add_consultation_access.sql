-- Consultation entitlements + extended payment product types (run after add_payment_tracking.sql)

ALTER TABLE public.user_access
  ADD COLUMN IF NOT EXISTS consult_20_paid boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS consult_30_paid boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS consult_60_paid boolean NOT NULL DEFAULT false;

ALTER TABLE public.payment_records DROP CONSTRAINT IF EXISTS payment_records_product_check;
ALTER TABLE public.payment_records ADD CONSTRAINT payment_records_product_check CHECK (
  product IN (
    'platform',
    'low_guides',
    'high_guides',
    'consultation_20min',
    'consultation_30min',
    'consultation_60min'
  )
);

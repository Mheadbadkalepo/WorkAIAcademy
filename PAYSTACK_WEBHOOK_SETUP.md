## Paystack Webhook Setup

1. Set these environment variables in Vercel Project Settings:
   - `PAYSTACK_SECRET_KEY`
   - `SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

2. Deploy the project.

3. In Paystack Dashboard, set webhook URL to:
   - `https://<your-domain>/api/webhook`

4. Ensure `charge.success` events are enabled.

5. Test with a real or test-mode payment and confirm:
   - a row is created in `payment_records`
   - `user_access.platform_unlocked` is set to `true` for the user

## Notes

- The webhook is idempotent using `payment_reference` uniqueness.
- The webhook verifies transaction status with Paystack before DB writes.
- Frontend layout is unchanged; this is backend-only reliability hardening.

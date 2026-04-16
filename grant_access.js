import { createClient } from "@supabase/supabase-js";
import 'dotenv/config';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const userIds = [
  "d54b3629-c17d-4293-9c07-c6401c52287e",
  "2214148f-0215-4c07-bb16-3a10e634eeb7"
];

async function grantAccess() {
  for (const userId of userIds) {
    console.log(`Processing user: ${userId}`);

    // Update user access
    const { data: accessData, error: accessError } = await supabase
      .from("user_access")
      .upsert({
        user_id: userId,
        platform_unlocked: true,
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" });

    if (accessError) {
      console.error(`Failed to grant access for ${userId}:`, accessError.message);
    } else {
      console.log(`Successfully granted platform access to ${userId}`);
    }

    // Insert payment record
    const { data: paymentData, error: paymentError } = await supabase
      .from("payment_records")
      .upsert({
        payment_reference: `manual_paystack_${Date.now()}_${userId.split('-')[0]}`,
        merchant_reference: `manual_paystack_${Date.now()}_${userId.split('-')[0]}`,
        user_id: userId,
        payment_method: "paystack",
        product: "platform",
        amount: 1.0,
        currency: "USD",
        status: "success"
      }, { onConflict: "payment_reference" });

    if (paymentError) {
      console.error(`Failed to record payment for ${userId}:`, paymentError.message);
    } else {
      console.log(`Successfully recorded $1 manual payment for ${userId}`);
    }
    console.log("---");
  }
}

grantAccess();

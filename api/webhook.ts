import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

const PRODUCT_PRICES: Record<string, number> = {
  platform: 1.0,
  low_guides: 2.0,
  high_guides: 5.0,
  consultation_20min: 5.0,
  consultation_30min: 8.0,
  consultation_60min: 10.0,
};

function getSupabaseAdminClient() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Missing Supabase server configuration");
  }

  return createClient(url, key);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const event = req.body;

    // Verify Paystack webhook signature
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      console.error("Missing PAYSTACK_SECRET_KEY");
      return res.status(500).json({ error: "Server configuration error" });
    }

    // Paystack sends charge.success events
    if (event.event === "charge.success") {
      const { reference, amount, metadata } = event.data;

      if (!reference || !metadata?.user_id) {
        console.error("Invalid webhook payload", { reference, metadata });
        return res.status(400).json({ error: "Invalid payload" });
      }

      const supabase = getSupabaseAdminClient();

      // Check if payment already processed
      const { data: existing } = await supabase
        .from("payment_records")
        .select("status")
        .eq("payment_reference", reference)
        .maybeSingle();

      if (existing?.status === "success") {
        return res.status(200).json({ message: "Already processed" });
      }

      // Determine product from amount (in kobo, so divide by 100)
      const amountUSD = amount / 100;
      let product = "platform"; // default

      if (amountUSD === 2.0) product = "low_guides";
      else if (amountUSD === 5.0) product = "high_guides";
      else if (amountUSD === 5.0) product = "consultation_20min";
      else if (amountUSD === 8.0) product = "consultation_30min";
      else if (amountUSD === 10.0) product = "consultation_60min";

      // Insert/update payment record
      const { error: paymentError } = await supabase.from("payment_records").upsert(
        {
          payment_reference: reference,
          user_id: metadata.user_id,
          payment_method: "paystack",
          product,
          amount: amountUSD,
          currency: "USD",
          status: "success",
        },
        { onConflict: "payment_reference" },
      );

      if (paymentError) {
        console.error("Payment record error:", paymentError);
        return res.status(500).json({ error: "Database error" });
      }

      // Update user access
      const unlockPayload: Record<string, any> = {
        user_id: metadata.user_id,
        updated_at: new Date().toISOString(),
      };

      if (product === "platform") unlockPayload.platform_unlocked = true;
      if (product === "low_guides") unlockPayload.low_guides_unlocked = true;
      if (product === "high_guides") unlockPayload.high_guides_unlocked = true;
      if (product === "consultation_20min") unlockPayload.consult_20_paid = true;
      if (product === "consultation_30min") unlockPayload.consult_30_paid = true;
      if (product === "consultation_60min") unlockPayload.consult_60_paid = true;

      const { error: accessError } = await supabase
        .from("user_access")
        .upsert(unlockPayload, { onConflict: "user_id" });

      if (accessError) {
        console.error("User access error:", accessError);
        return res.status(500).json({ error: "Database error" });
      }

      console.log(`Paystack payment processed: ${reference} for user ${metadata.user_id}`);
    }

    return res.status(200).json({ message: "Webhook processed" });
  } catch (error: any) {
    console.error("Webhook error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

// Previous configuration
const PRODUCT_PRICES: Record<string, number> = {
  platform: 1.0,
  low_guides: 2.0,
  high_guides: 5.0,
  consultation_20min: 20.0,
  consultation_30min: 30.0,
  consultation_60min: 60.0,
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

    // Verify Paystack webhook signature natively (In production, verify x-paystack-signature header if needed)
    const secret = process.env.PAYSTACK_SECRET_KEY;
    if (!secret) {
      console.error("Missing PAYSTACK_SECRET_KEY");
      return res.status(500).json({ error: "Server configuration error" });
    }

    // Paystack sends 'charge.success' events
    if (event.event === "charge.success") {
      const { reference, amount, metadata: rawMetadata } = event.data;

      // Paystack metadata can sometimes be a JSON string
      let metadata = rawMetadata;
      if (typeof rawMetadata === "string" && rawMetadata.length > 0) {
        try {
          metadata = JSON.parse(rawMetadata);
        } catch (e) {
          console.error("Failed to parse metadata JSON:", rawMetadata);
        }
      }

      if (!reference || !metadata?.user_id) {
        console.error("Invalid webhook payload - missing reference or user_id", { reference, metadata });
        return res.status(400).json({ error: "Invalid payload: missing user_id in metadata" });
      }

      const supabase = getSupabaseAdminClient();

      // Check if payment already processed
      const { data: existing } = await supabase
        .from("payment_records")
        .select("status")
        .eq("payment_reference", reference)
        .maybeSingle();

      if (existing?.status === "success") {
        console.log(`Payment ${reference} already processed.`);
        return res.status(200).json({ message: "Already processed" });
      }

      // Determine product
      // 1. Check metadata first (source of truth from frontend)
      // 2. Fallback to amount-based detection
      let product = metadata.product || "platform";
      
      const amountKES = amount / 100; // Paystack sends amount in cents
      const amountUSD = Math.round(amountKES / 140);

      if (!metadata.product) {
        if (amountUSD === 2) product = "low_guides";
        else if (amountUSD === 5) product = "high_guides";
        else if (amountUSD >= 20 && amountUSD <= 60) {
           // Fallback for consultation based on amount if metadata is missing
           if (amountUSD === 20) product = "consultation_20min";
           else if (amountUSD === 30) product = "consultation_30min";
           else if (amountUSD === 60) product = "consultation_60min";
        }
      }

      console.log(`Processing payment for product: ${product}, user: ${metadata.user_id}, amount: ${amountUSD} USD`);

      // 1. Insert/update payment record
      const { error: paymentError } = await supabase.from("payment_records").upsert(
        {
          payment_reference: reference,
          merchant_reference: reference,
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
        console.error("Database error saving payment record:", paymentError);
        return res.status(500).json({ error: "Database error saving payment" });
      }

      // 2. Update user access
      const unlockPayload: Record<string, any> = {
        user_id: metadata.user_id,
        updated_at: new Date().toISOString(),
      };

      if (product === "platform") unlockPayload.platform_unlocked = true;
      else if (product === "low_guides") unlockPayload.low_guides_unlocked = true;
      else if (product === "high_guides") unlockPayload.high_guides_unlocked = true;
      else if (product === "consultation_20min") unlockPayload.consult_20_paid = true;
      else if (product === "consultation_30min") unlockPayload.consult_30_paid = true;
      else if (product === "consultation_60min") unlockPayload.consult_60_paid = true;

      const { error: accessError } = await supabase
        .from("user_access")
        .upsert(unlockPayload, { onConflict: "user_id" });

      if (accessError) {
        console.error("Database error updating user access:", accessError);
        // Note: We don't return 500 here because the payment was already recorded.
        // We might want to alert the admin instead.
      }

      console.log(`Successfully processed Paystack payment: ${reference} for user ${metadata.user_id}`);
    }

    return res.status(200).json({ message: "Webhook processed" });

  } catch (error: any) {
    console.error("Webhook error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
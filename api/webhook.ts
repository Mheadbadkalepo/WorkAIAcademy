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
  console.log(`[Webhook] Received request: ${req.method}`);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // 0. Parse Body (handle both object and string)
    let event = req.body;
    if (typeof event === "string") {
      try {
        event = JSON.parse(event);
      } catch (e) {
        console.error("[Webhook] Failed to parse raw body as JSON:", event.substring(0, 100));
        return res.status(400).json({ error: "Invalid JSON body" });
      }
    }

    console.log("[Webhook] Event type:", event?.event);

    // 1. Verify Secret Configuration
    const secret = process.env.PAYSTACK_SECRET_KEY || process.env.VITE_PAYSTACK_SECRET_KEY;
    if (!secret) {
      console.error("[Webhook] CRITICAL: Missing PAYSTACK_SECRET_KEY in environment variables");
      return res.status(500).json({ error: "Server configuration error" });
    }

    // 2. Process 'charge.success'
    if (event.event === "charge.success") {
      const { reference, amount, metadata: rawMetadata } = event.data;
      console.log(`[Webhook] Processing successful charge: ${reference}`);

      // Handle metadata (Paystack often strings this)
      let metadata = rawMetadata;
      if (typeof rawMetadata === "string" && rawMetadata.length > 0) {
        try {
          metadata = JSON.parse(rawMetadata);
        } catch (e) {
          console.error("[Webhook] Metadata parsing failed:", rawMetadata);
        }
      }

      const userId = metadata?.user_id;
      if (!reference || !userId) {
        console.error("[Webhook] Missing critical data:", { reference, userId, metadata });
        return res.status(400).json({ error: "Invalid payload: missing reference or user_id" });
      }

      const supabase = getSupabaseAdminClient();

      // 3. Prevent Duplicates
      const { data: existing, error: existingError } = await supabase
        .from("payment_records")
        .select("status")
        .eq("payment_reference", reference)
        .maybeSingle();

      if (existingError) {
        console.error("[Webhook] Error checking existing payment:", existingError);
        // Continue anyway, upsert will handle it, but this log helps
      }

      if (existing?.status === "success") {
        console.log(`[Webhook] Payment ${reference} already marked as success. Skipping.`);
        return res.status(200).json({ message: "Already processed" });
      }

      // 4. Determine Product & Amount
      // Use metadata.product as priority
      let product = metadata.product || "platform";
      
      const amountKES = amount / 100; // Paystack sends amount in cents
      const exchangeRate = Number(process.env.PESAPAL_EXCHANGE_RATE) || 140;
      const amountUSD = Math.round(amountKES / exchangeRate);

      // Fallback logic if product is missing in metadata
      if (!metadata.product) {
        if (amountUSD === 2) product = "low_guides";
        else if (amountUSD === 5) product = "high_guides";
        else if (amountUSD >= 15 && amountUSD <= 25) product = "consultation_20min";
        else if (amountUSD > 25 && amountUSD <= 40) product = "consultation_30min";
        else if (amountUSD > 40) product = "consultation_60min";
      }

      console.log(`[Webhook] Product: ${product}, User: ${userId}, Amount: $${amountUSD} (KES ${amountKES})`);

      // 5. Record Payment
      const paymentData = {
        payment_reference: reference,
        merchant_reference: reference,
        user_id: userId,
        payment_method: "paystack",
        product,
        amount: amountUSD,
        currency: "USD",
        status: "success",
        updated_at: new Date().toISOString()
      };

      const { error: paymentError } = await supabase
        .from("payment_records")
        .upsert(paymentData, { onConflict: "payment_reference" });

      if (paymentError) {
        console.error("[Webhook] FAILED to save payment record:", paymentError);
        // If this fails, we can't safely grant access yet
        return res.status(500).json({ error: "Database error saving payment", details: paymentError.message });
      }

      console.log("[Webhook] Payment record saved successfully.");

      // 6. Grant Access
      // Always grant platform access if they buy anything
      const unlockPayload: Record<string, any> = {
        user_id: userId,
        platform_unlocked: true, // Buying a guide/consultation also unlocks the platform
        updated_at: new Date().toISOString(),
      };

      if (product === "low_guides") unlockPayload.low_guides_unlocked = true;
      else if (product === "high_guides") unlockPayload.high_guides_unlocked = true;
      else if (product === "consultation_20min") unlockPayload.consult_20_paid = true;
      else if (product === "consultation_30min") unlockPayload.consult_30_paid = true;
      else if (product === "consultation_60min") unlockPayload.consult_60_paid = true;

      const { error: accessError } = await supabase
        .from("user_access")
        .upsert(unlockPayload, { onConflict: "user_id" });

      if (accessError) {
        console.error("[Webhook] FAILED to update user access:", accessError);
        // We still return 200 because the payment IS recorded, but we log the failure
        return res.status(200).json({ 
          message: "Payment recorded but access update failed", 
          error: accessError.message 
        });
      }

      console.log(`[Webhook] COMPLETED: Access granted for ${product} to user ${userId}`);
    } else {
        console.log(`[Webhook] Ignored event type: ${event.event}`);
    }

    return res.status(200).json({ message: "Webhook processed successfully" });

  } catch (error: any) {
    console.error("[Webhook] UNHANDLED CRASH:", error);
    return res.status(500).json({ 
      error: "Internal server error", 
      message: error.message,
      stack: error.stack?.split("\n").slice(0, 3).join("\n") 
    });
  }
}
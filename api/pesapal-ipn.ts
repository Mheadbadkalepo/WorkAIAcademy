import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getPesapalToken, getTransactionStatus } from "./_pesapal.js";
import { createClient } from "@supabase/supabase-js";

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
  if (req.method !== "GET" && req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // PesaPal typically sends GET or POST. We handle both to be safe.
  const query = req.query;
  const body = req.body || {};
  
  const OrderTrackingId = query.OrderTrackingId || body.OrderTrackingId;
  const OrderNotificationType = query.OrderNotificationType || body.OrderNotificationType;
  const OrderMerchantReference = query.OrderMerchantReference || body.OrderMerchantReference;

  if (!OrderTrackingId) {
    return res.status(400).json({ error: "Missing OrderTrackingId" });
  }

  try {
    const token = await getPesapalToken();
    const txStatus = await getTransactionStatus(token, OrderTrackingId as string);

    // Provide immediate response to PesaPal as required by their documentation
    const ipnResponse = {
      orderNotificationType: OrderNotificationType,
      orderTrackingId: OrderTrackingId,
      orderMerchantReference: OrderMerchantReference,
      status: 200
    };

    if (txStatus.status_code !== 1 && txStatus.payment_status_description?.toLowerCase() !== 'completed') {
      // Payment not successful yet, acknowledge the IPN but don't fulfill
      console.log(`Payment not completed yet. Status: ${txStatus.payment_status_description}`);
      return res.status(200).json(ipnResponse);
    }

    const supabase = getSupabaseAdminClient();

    // Find the pending payment record and get user_id & product
    const { data: record, error: fetchError } = await supabase
      .from("payment_records")
      .select("user_id, product, amount, status")
      .eq("payment_reference", OrderTrackingId)
      .maybeSingle();

    if (fetchError || !record) {
      console.error("Failed to find payment record:", fetchError);
      return res.status(200).json(ipnResponse);
    }

    const userId = record.user_id;
    const product = record.product;
    const expectedAmount = record.amount; // Use stored amount instead of PRODUCT_PRICES
    const expectedCurrency = record.currency || "USD";

    if (!userId || !product || !expectedAmount) {
      console.error("Invalid payment record payload", record);
      return res.status(200).json(ipnResponse);
    }

    if (record.status === "success") {
      // Idempotency: already fulfilled on a previous callback.
      return res.status(200).json(ipnResponse);
    }

    const paidAmount = Number(txStatus.amount);
    const paidCurrency = txStatus.currency || "KES"; // PesaPal often returns KES

    // Allow some tolerance for currency conversion (5% difference)
    const tolerance = expectedAmount * 0.05;
    const amountMatches = Math.abs(paidAmount - expectedAmount) <= tolerance;

    if (!Number.isFinite(paidAmount) || !amountMatches) {
      console.error("Payment amount mismatch", {
        orderTrackingId: OrderTrackingId,
        paidAmount,
        paidCurrency,
        expectedAmount,
        expectedCurrency,
        product
      });
      await supabase
        .from("payment_records")
        .upsert(
          {
            user_id: userId,
            payment_reference: OrderTrackingId,
            product,
            amount: paidAmount,
            currency: paidCurrency,
            status: "failed",
          },
          { onConflict: "payment_reference" },
        );
      return res.status(200).json(ipnResponse);
    }

    // Update payment record
    await supabase.from("payment_records").upsert(
      {
        user_id: userId,
        payment_reference: OrderTrackingId,
        payment_method: txStatus.payment_method || "pesapal",
        product,
        amount: paidAmount,
        currency: paidCurrency,
        status: "success",
      },
      { onConflict: "payment_reference" }
    );

    // Unlock access
    const unlockPayload: Record<string, any> = {
      user_id: userId,
      updated_at: new Date().toISOString(),
    };

    if (product === "platform") unlockPayload.platform_unlocked = true;
    if (product === "low_guides") unlockPayload.low_guides_unlocked = true;
    if (product === "high_guides") unlockPayload.high_guides_unlocked = true;
    if (product === "consultation_20min") unlockPayload.consult_20_paid = true;
    if (product === "consultation_30min") unlockPayload.consult_30_paid = true;
    if (product === "consultation_60min") unlockPayload.consult_60_paid = true;

    await supabase
      .from("user_access")
      .upsert(unlockPayload, { onConflict: "user_id" });

    return res.status(200).json(ipnResponse);
  } catch (error: any) {
    console.error("IPN processing error:", error);
    return res.status(500).json({ error: "Failed to process IPN" });
  }
}

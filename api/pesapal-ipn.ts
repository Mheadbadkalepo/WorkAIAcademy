import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getPesapalToken, getTransactionStatus } from "./_pesapal.js";
import { createClient } from "@supabase/supabase-js";

const PRODUCT_PRICES: Record<string, number> = {
  platform: 1.0,        // USD: 1.00 -> KES: 140.00
  low_guides: 2.0,      // USD: 2.00 -> KES: 280.00  
  high_guides: 5.0,     // USD: 5.00 -> KES: 700.00
  consultation_20min: 5.0,  // USD: 5.00 -> KES: 700.00
  consultation_30min: 8.0,  // USD: 8.00 -> KES: 1120.00
  consultation_60min: 10.0, // USD: 10.00 -> KES: 1400.00
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

  const OrderTrackingId =
    (query.OrderTrackingId || query.order_tracking_id || query.orderTrackingId || query.id) ||
    (body.OrderTrackingId || body.order_tracking_id || body.orderTrackingId || body.id);

  const OrderNotificationType =
    query.OrderNotificationType || query.order_notification_type || body.OrderNotificationType || body.order_notification_type;

  const OrderMerchantReference =
    query.OrderMerchantReference || query.merchant_reference || body.OrderMerchantReference || body.merchant_reference;

  console.log('[PesaPal IPN] incoming request', {
    query,
    body,
    OrderTrackingId,
    OrderMerchantReference,
    OrderNotificationType,
  });

  const simulate = String(query.dev_simulate_success || body.dev_simulate_success || '').toLowerCase() === '1';
  if (simulate) {
    const testOrderId = String(query.order_tracking_id || body.order_tracking_id || OrderTrackingId);
    const testUserId = String(query.user_id || body.user_id);
    const testProduct = String(query.product || body.product || 'platform');
    const testAmount = Number(query.amount || body.amount || 140);

    if (!testOrderId || !testUserId) {
      return res.status(400).json({ error: 'Missing test order_tracking_id or user_id for simulation' });
    }

    console.log(`[PesaPal IPN Simulation] Simulating successful IPN for ${testOrderId}`);
    const supabase = getSupabaseAdminClient();

    await supabase.from('payment_records').upsert({
      payment_reference: testOrderId,
      user_id: testUserId,
      payment_method: 'pesapal',
      product: testProduct,
      amount: testAmount,
      currency: 'KES',
      status: 'success',
      merchant_reference: body.merchant_reference || query.merchant_reference || null,
      payer_email: body.email || query.email || null,
      provider_transaction_code: 'SIMULATED',
    }, { onConflict: 'payment_reference' });

    const unlockPayload: Record<string, any> = {user_id: testUserId, updated_at: new Date().toISOString()};
    if (testProduct === 'platform') unlockPayload.platform_unlocked = true;
    if (testProduct === 'low_guides') unlockPayload.low_guides_unlocked = true;
    if (testProduct === 'high_guides') unlockPayload.high_guides_unlocked = true;
    if (testProduct === 'consultation_20min') unlockPayload.consult_20_paid = true;
    if (testProduct === 'consultation_30min') unlockPayload.consult_30_paid = true;
    if (testProduct === 'consultation_60min') unlockPayload.consult_60_paid = true;

    await supabase.from('user_access').upsert(unlockPayload, { onConflict: 'user_id' });
    return res.status(200).json({ message: 'Simulated IPN success' });
  }

  if (!OrderTrackingId && !OrderMerchantReference) {
    return res.status(400).json({ error: 'Missing OrderTrackingId or merchant_reference' });
  }

  try {
    const supabase = getSupabaseAdminClient();

    let resolveId = OrderTrackingId;
    if (!resolveId && OrderMerchantReference) {
      const { data: fallback } = await supabase
        .from('payment_records')
        .select('payment_reference')
        .eq('merchant_reference', String(OrderMerchantReference))
        .maybeSingle();
      resolveId = fallback?.payment_reference;
      if (resolveId) {
        console.log(`[PesaPal IPN] Resolved OrderTrackingId from merchant_reference ${OrderMerchantReference} -> ${resolveId}`);
      }
    }

    if (!resolveId) {
      console.error('[PesaPal IPN] Unable to determine OrderTrackingId to verify transaction status');
      return res.status(400).json({ error: 'Missing order tracking ID' });
    }

    const token = await getPesapalToken();
    const txStatus = await getTransactionStatus(token, resolveId);

    // Provide immediate response to PesaPal as required by their documentation
    const ipnResponse = {
      orderNotificationType: OrderNotificationType,
      orderTrackingId: resolveId,
      orderMerchantReference: OrderMerchantReference,
      status: 200
    };

    if (txStatus.status_code !== 1 || txStatus.payment_status_description?.toLowerCase() !== 'completed') {
      // Payment not successful yet, acknowledge the IPN but don't fulfill
      console.log(`[PesaPal IPN] Payment not completed yet (status_code=${txStatus.status_code}, description=${txStatus.payment_status_description})`);
      return res.status(200).json(ipnResponse);
    }

    // Find pending payment by tracking id. Fallback to merchant reference if needed.
    let { data: record, error: fetchError } = await supabase
      .from("payment_records")
      .select("user_id, product, amount, currency, status, payer_email, merchant_reference")
      .eq("payment_reference", OrderTrackingId)
      .maybeSingle();

    if ((!record || fetchError) && OrderMerchantReference) {
      const fallback = await supabase
        .from("payment_records")
        .select("user_id, product, amount, currency, status, payer_email, merchant_reference")
        .eq("merchant_reference", String(OrderMerchantReference))
        .maybeSingle();
      record = fallback.data ?? null;
      fetchError = fallback.error ?? null;
    }

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
      console.log(`[PesaPal IPN] Idempotent: Payment ${OrderTrackingId} already processed. Status=success. user_id=${userId}`);
      return res.status(200).json(ipnResponse);
    }

    let paidAmount = Number(txStatus.amount);
    let paidCurrency = (txStatus.currency || "KES").toUpperCase();
    const providerCode =
      txStatus.confirmation_code || txStatus.payment_account || txStatus.transaction_code || null;
    const payerEmail =
      txStatus.email || txStatus.billing_address?.email_address || record.payer_email || null;

    console.log(`[PesaPal IPN] Payment callback received: order_tracking_id=${OrderTrackingId}, merchant_reference=${OrderMerchantReference}, status=${txStatus.payment_status_description}, paidAmount=${paidAmount}, paidCurrency=${paidCurrency}, expectedAmount=${expectedAmount}, expectedCurrency=${expectedCurrency}, product=${product}, user_id=${userId}`);

    // Convert to KES if needed
    if (paidCurrency !== 'KES') {
      const exchangeRate = Number(process.env.PESAPAL_EXCHANGE_RATE || '140');
      if (paidCurrency === 'USD' || paidCurrency === '$') {
        paidAmount = Math.round(paidAmount * exchangeRate);
        paidCurrency = 'KES';
      } else {
        console.warn(`[PesaPal IPN] Unexpected currency ${paidCurrency}, expected KES. Assuming no conversion.`);
      }
    }

    const tolerance = expectedAmount * 0.01;
    const amountMatches = Number.isFinite(paidAmount) && Math.abs(paidAmount - expectedAmount) <= tolerance;

    if (!amountMatches) {
      console.error(`[PesaPal IPN] Amount mismatch for order ${OrderTrackingId}. Expected ${expectedAmount} KES, received ${paidAmount} ${paidCurrency}`);
      const { error: failError } = await supabase
        .from("payment_records")
        .upsert(
          {
            user_id: userId,
            payment_reference: OrderTrackingId,
            merchant_reference: String(OrderMerchantReference || record.merchant_reference || ""),
            provider_transaction_code: providerCode,
            payer_email: payerEmail,
            product,
            amount: paidAmount,
            currency: paidCurrency,
            status: "failed",
          },
          { onConflict: "payment_reference" },
        );
      if (failError) console.error(`[PesaPal IPN] Failed to mark payment as failed: ${failError.message}`);
      return res.status(200).json(ipnResponse);
    }

    // Update payment record to success
    console.log(`[PesaPal IPN] Marking payment ${OrderTrackingId} as success. Unlocking ${product} for user ${userId}`);
    
    const { error: updateError } = await supabase.from("payment_records").upsert(
      {
        user_id: userId,
        payment_reference: OrderTrackingId,
        merchant_reference: String(OrderMerchantReference || record.merchant_reference || ""),
        provider_transaction_code: providerCode,
        payer_email: payerEmail,
        payment_method: txStatus.payment_method || "pesapal",
        product,
        amount: paidAmount,
        currency: paidCurrency,
        status: "success",
      },
      { onConflict: "payment_reference" }
    );

    if (updateError) {
      console.error(`[PesaPal IPN] Failed to update payment record: ${updateError.message}`);
      return res.status(200).json(ipnResponse);
    }

    // Unlock access based on product
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

    const { error: unlockError } = await supabase
      .from("user_access")
      .upsert(unlockPayload, { onConflict: "user_id" });
    
    if (unlockError) {
      console.error(`[PesaPal IPN] Failed to update user_access: ${unlockError.message}`);
      return res.status(200).json(ipnResponse);
    }
    
    console.log(`[PesaPal IPN] ✓ Payment ${OrderTrackingId} successfully processed. user_id=${userId}, product=${product}, access_unlocked=true`);

    return res.status(200).json(ipnResponse);
  } catch (error: any) {
    console.error("IPN processing error:", error);
    return res.status(500).json({ error: "Failed to process IPN" });
  }
}

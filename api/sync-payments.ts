import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getPesapalToken, getTransactionStatus } from "./_pesapal.js";
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
  // Only allow POST requests (optional: add authorization check)
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const supabase = getSupabaseAdminClient();

    // Fetch all pending payments
    const { data: pendingPayments, error: fetchError } = await supabase
      .from("payment_records")
      .select("payment_reference, user_id, product, amount, merchant_reference, payer_email")
      .eq("status", "pending");

    if (fetchError) {
      console.error("Error fetching pending payments:", fetchError);
      return res.status(500).json({ error: "Failed to fetch pending payments" });
    }

    if (!pendingPayments || pendingPayments.length === 0) {
      return res.status(200).json({ message: "No pending payments to sync", count: 0 });
    }

    console.log(`Syncing ${pendingPayments.length} pending payments...`);

    const token = await getPesapalToken();
    let successCount = 0;
    let failCount = 0;

    for (const payment of pendingPayments) {
      try {
        const txStatus = await getTransactionStatus(token, payment.payment_reference);

        // Check if payment is completed
        if (
          txStatus.status_code === 1 &&
          txStatus.payment_status_description?.toLowerCase() === "completed"
        ) {
          // Update payment record to success
          const providerCode =
            txStatus.confirmation_code || txStatus.payment_account || txStatus.transaction_code || null;
          const payerEmail =
            txStatus.email || txStatus.billing_address?.email_address || payment.payer_email || null;

          const { error: updateError } = await supabase
            .from("payment_records")
            .update({
              status: "success",
              payment_method: txStatus.payment_method || "pesapal",
              amount: Number(txStatus.amount) || payment.amount,
              currency: txStatus.currency || "KES",
              merchant_reference: txStatus.merchant_reference || payment.merchant_reference || null,
              provider_transaction_code: providerCode,
              payer_email: payerEmail,
            })
            .eq("payment_reference", payment.payment_reference);

          if (updateError) {
            console.error(`Failed to update payment ${payment.payment_reference}:`, updateError);
            failCount++;
            continue;
          }

          // Unlock user access
          const unlockPayload: Record<string, any> = {
            user_id: payment.user_id,
            updated_at: new Date().toISOString(),
          };

          if (payment.product === "platform") unlockPayload.platform_unlocked = true;
          if (payment.product === "low_guides") unlockPayload.low_guides_unlocked = true;
          if (payment.product === "high_guides") unlockPayload.high_guides_unlocked = true;
          if (payment.product === "consultation_20min") unlockPayload.consult_20_paid = true;
          if (payment.product === "consultation_30min") unlockPayload.consult_30_paid = true;
          if (payment.product === "consultation_60min") unlockPayload.consult_60_paid = true;

          const { error: accessError } = await supabase
            .from("user_access")
            .upsert(unlockPayload, { onConflict: "user_id" });

          if (accessError) {
            console.error(`Failed to update access for ${payment.user_id}:`, accessError);
            failCount++;
          } else {
            console.log(
              `✓ Synced payment ${payment.payment_reference} for user ${payment.user_id}`
            );
            successCount++;
          }
        } else {
          console.log(
            `Payment ${payment.payment_reference} still pending. Status: ${txStatus.payment_status_description}`
          );
        }
      } catch (error: any) {
        console.error(
          `Error processing payment ${payment.payment_reference}:`,
          error.message
        );
        failCount++;
      }
    }

    return res.status(200).json({
      message: "Sync completed",
      total: pendingPayments.length,
      synced: successCount,
      failed: failCount,
    });
  } catch (error: any) {
    console.error("Sync error:", error);
    return res.status(500).json({ error: error.message || "Internal server error" });
  }
}

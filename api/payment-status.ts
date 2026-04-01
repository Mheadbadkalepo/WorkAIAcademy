import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdminClient() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error("Missing Supabase server configuration");
  }

  return createClient(url, key);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { order_tracking_id } = req.query;
  if (!order_tracking_id || typeof order_tracking_id !== "string") {
    return res.status(400).json({ error: "Missing order_tracking_id query parameter" });
  }

  try {
    const supabase = getSupabaseAdminClient();
    const { data: payment, error: paymentError } = await supabase
      .from("payment_records")
      .select("user_id, product, amount, currency, status")
      .eq("payment_reference", order_tracking_id)
      .maybeSingle();

    if (paymentError) {
      console.error("Payment status lookup error:", paymentError);
      return res.status(500).json({ error: "Database error" });
    }

    if (!payment) {
      return res.status(404).json({ error: "Payment record not found" });
    }

    const { data: access, error: accessError } = await supabase
      .from("user_access")
      .select("platform_unlocked, low_guides_unlocked, high_guides_unlocked, consult_20_paid, consult_30_paid, consult_60_paid")
      .eq("user_id", payment.user_id)
      .maybeSingle();

    if (accessError) {
      console.error("User access lookup error:", accessError);
      return res.status(500).json({ error: "Database error" });
    }

    return res.status(200).json({
      payment,
      access,
    });
  } catch (error: any) {
    console.error("Payment status endpoint error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

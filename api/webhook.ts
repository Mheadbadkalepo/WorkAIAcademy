import type { VercelRequest, VercelResponse } from "@vercel/node";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

type PaystackEvent = {
  event?: string;
  data?: {
    reference?: string;
    status?: string;
    amount?: number;
    currency?: string;
    paid_at?: string;
    channel?: string;
    metadata?: Record<string, any>;
    customer?: {
      email?: string;
    };
  };
};

export const config = {
  api: {
    bodyParser: false,
  },
};

async function readRawBody(req: VercelRequest): Promise<string> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks).toString("utf-8");
}

function getSupabaseAdminClient() {
  const url = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error("Missing Supabase server configuration");
  }

  return createClient(url, key);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY || process.env.VITE_PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    return res.status(500).json({ error: "Missing Paystack secret key configuration" });
  }

  const signature = req.headers["x-paystack-signature"];
  if (!signature || typeof signature !== "string") {
    return res.status(401).json({ error: "Missing signature" });
  }

  let rawBody = "";
  try {
    rawBody = await readRawBody(req);
  } catch {
    return res.status(400).json({ error: "Invalid request body" });
  }

  const expectedSignature = crypto
    .createHmac("sha512", secretKey)
    .update(rawBody)
    .digest("hex");

  if (expectedSignature !== signature) {
    return res.status(401).json({ error: "Invalid signature" });
  }

  let payload: PaystackEvent;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return res.status(400).json({ error: "Malformed JSON" });
  }

  if (payload.event !== "charge.success" || !payload.data) {
    return res.status(200).json({ received: true, ignored: true });
  }

  if (payload.data.status !== "success") {
    return res.status(200).json({ received: true, ignored: true });
  }

  const reference = payload.data.reference;
  if (!reference) {
    return res.status(400).json({ error: "Missing payment reference" });
  }

  try {
    const verifyResponse = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${secretKey}`,
        },
      },
    );

    const verifyPayload: any = await verifyResponse.json();
    if (!verifyResponse.ok || verifyPayload?.data?.status !== "success") {
      return res.status(400).json({ error: "Verification failed" });
    }

    const metadata = (verifyPayload?.data?.metadata || payload.data.metadata || {}) as Record<string, any>;
    const userId = metadata.user_id as string | undefined;
    const product = (metadata.product as string | undefined) || "platform";
    if (!userId) {
      return res.status(200).json({ received: true, ignored: true, reason: "missing_user_id_metadata" });
    }

    const amountInSubunit = Number(verifyPayload?.data?.amount || payload.data.amount || 0);
    const amount = amountInSubunit / 100;
    const currency = (verifyPayload?.data?.currency || payload.data.currency || "USD") as string;
    const method = (verifyPayload?.data?.channel || payload.data.channel || "paystack") as string;

    const supabase = getSupabaseAdminClient();

    const { error: paymentError } = await supabase.from("payment_records").upsert(
      {
        user_id: userId,
        payment_reference: reference,
        payment_method: method,
        product,
        amount,
        currency,
        status: "success",
      },
      { onConflict: "payment_reference" },
    );

    if (paymentError) {
      return res.status(500).json({ error: paymentError.message });
    }

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

    const { error: accessError } = await supabase
      .from("user_access")
      .upsert(unlockPayload, { onConflict: "user_id" });

    if (accessError) {
      return res.status(500).json({ error: accessError.message });
    }

    return res.status(200).json({ received: true, processed: true });
  } catch (error: any) {
    return res.status(500).json({ error: error?.message || "Webhook processing failed" });
  }
}

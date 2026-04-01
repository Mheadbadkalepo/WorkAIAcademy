import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import { getPesapalToken, getPesapalBaseUrl } from "./_pesapal.js";

const PRODUCT_PRICES: Record<string, number> = {
  platform: 1.0,
  low_guides: 2.0,
  high_guides: 5.0,
  consultation_20min: 5.0,
  consultation_30min: 8.0,
  consultation_60min: 10.0,
};

function isValidEmail(value: unknown): value is string {
  return typeof value === "string" && value.includes("@") && value.includes(".");
}

function normalizeAppUrl(rawUrl: string | undefined, vercelUrl: string | undefined, host: string | undefined) {
  if (rawUrl && rawUrl.trim().length > 0) {
    if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
      return rawUrl;
    }
    return `https://${rawUrl}`;
  }
  if (vercelUrl) return `https://${vercelUrl}`;
  return `http://${host}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { amount, product, email, phone, metadata, description } = req.body;

    if (!product || !Object.prototype.hasOwnProperty.call(PRODUCT_PRICES, product)) {
      return res.status(400).json({ error: "Invalid product selected" });
    }

    const expectedAmount = PRODUCT_PRICES[product];
    const parsedAmount = Number(amount);
    if (!Number.isFinite(parsedAmount) || Math.abs(parsedAmount - expectedAmount) > 0.0001) {
      return res.status(400).json({ error: `Invalid amount for ${product}. Expected ${expectedAmount}` });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "A valid email is required" });
    }

    if (!metadata?.user_id || typeof metadata.user_id !== "string") {
      return res.status(400).json({ error: "Missing authenticated user metadata" });
    }

    const token = await getPesapalToken();

    // Convert USD in frontend to KSH for PesaPal (expecting local currency)
    const exchangeRate = Number(process.env.PESAPAL_EXCHANGE_RATE || "140"); // default 140 KSH per USD
    const amountInKsh = Math.round(parsedAmount * exchangeRate);

    // Use environment variable for host when provided, fallback to Vercel host, then request host.
    const appUrl = normalizeAppUrl(process.env.VITE_APP_URL, process.env.VERCEL_URL, req.headers.host);
    const callbackUrl = `${appUrl}/dashboard?payment=complete`;
    const ipnUrl = `${appUrl}/api/pesapal-ipn`;

    // 1. Register or fetch IPN ID from PesaPal
    // Note: For production, it's better to register once and store it. 
    // Here we dynamically register for convenience since URLs might change in dev/preview.
    const ipnResponse = await fetch(`${getPesapalBaseUrl()}/api/URLSetup/RegisterIPN`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        url: ipnUrl,
        ipn_notification_type: 'POST', // PesaPal can do GET or POST 
      }),
    });
    
    let ipn_id = '';
    const ipnData = await ipnResponse.json();
    if (ipnData?.ipn_id) {
       ipn_id = ipnData.ipn_id;
    } else if (ipnData?.error?.message?.includes("already registered")) {
       // If already registered, we should ideally fetch the list of registered IPNs
       const getIpnReq = await fetch(`${getPesapalBaseUrl()}/api/URLSetup/GetIpnList`, {
         headers: { Authorization: `Bearer ${token}` }
       });
       const ipnList = await getIpnReq.json();
       const existingIpn = ipnList?.find((i: any) => i.url === ipnUrl);
       if (existingIpn) ipn_id = existingIpn.ipn_id;
    }

    if (!ipn_id) {
       // Fallback IPN if registration fails
       console.error("IPN ID could not be registered/fetched. Payment will have no callback.", ipnData);
       throw new Error("Failed to configure IPN.");
    }

    const orderId = `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const orderPayload = {
      id: orderId,
      currency: "KES",
      amount: amountInKsh,
      description: `${description || `Payment for ${product}`} (USD ${parsedAmount} -> KES ${amountInKsh})`,
      callback_url: callbackUrl,
      notification_id: ipn_id,
      billing_address: {
        email_address: email,
        phone_number: phone || "",
        country_code: "KE",
        first_name: "Customer",
        middle_name: "",
        last_name: "",
        line_1: "",
        line_2: "",
        city: "",
        state: "",
        postal_code: "",
        zip_code: ""
      }
    };

    const submitResponse = await fetch(`${getPesapalBaseUrl()}/api/Transactions/SubmitOrderRequest`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(orderPayload),
    });

    if (!submitResponse.ok) {
      const errorText = await submitResponse.text();
      throw new Error(`Order submission failed: ${errorText}`);
    }

    const orderData = await submitResponse.json();

    const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase server credentials for payment tracking");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { error: paymentRecordError } = await supabase.from("payment_records").upsert(
      {
        payment_reference: orderData.order_tracking_id,
        merchant_reference: orderData.merchant_reference || orderId,
        user_id: metadata.user_id,
        payer_email: email,
        payment_method: "pesapal",
        product,
        amount: parsedAmount,
        currency: "USD",
        status: "pending",
      },
      { onConflict: "payment_reference" },
    );

    if (paymentRecordError) {
      throw new Error(`Failed to record pending payment: ${paymentRecordError.message}`);
    }

    return res.status(200).json({
      success: true,
      order_tracking_id: orderData.order_tracking_id,
      merchant_reference: orderData.merchant_reference,
      redirect_url: orderData.redirect_url,
    });
  } catch (error: any) {
    console.error("PesaPal Order Error:", error);
    return res.status(500).json({ error: error?.message || "Internal server error" });
  }
}

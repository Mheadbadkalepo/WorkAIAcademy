import path from "node:path";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig, type Plugin } from "vite";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function pesapalRealPlugin(): Plugin {
  return {
    name: 'pesapal-real-plugin',
    configureServer(server) {
      server.middlewares.use('/api/pesapal-order', (req, res) => {
        if (req.method !== 'POST') {
          res.statusCode = 405;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: 'Method not allowed' }));
          return;
        }

        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', async () => {
          try {
            const data = JSON.parse(body);
            const { amount, product, email, phone, description } = data;
            
            const env = process.env.PESAPAL_ENV || 'production';
            const pesapalBaseUrl = env === 'sandbox' ? 'https://cybqa.pesapal.com/pesapalv3' : 'https://pay.pesapal.com/v3';
            
            const consumerKey = process.env.PESAPAL_CONSUMER_KEY;
            const consumerSecret = process.env.PESAPAL_CONSUMER_SECRET;
            
            if (!consumerKey || !consumerSecret) throw new Error("Missing PESAPAL_CONSUMER_KEY or PESAPAL_CONSUMER_SECRET in .env");

            const tokenRes = await fetch(`${pesapalBaseUrl}/api/Auth/RequestToken`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
              body: JSON.stringify({ consumer_key: consumerKey, consumer_secret: consumerSecret })
            });
            const tokenData = await tokenRes.json();
            if (!tokenData.token) throw new Error("Failed to get token: " + JSON.stringify(tokenData));
            const token = tokenData.token;

            const host = req.headers.host || "127.0.0.1:5173";
            const appUrl = `http://${host}`;
            const callbackUrl = `${appUrl}/dashboard?payment=complete`;
            
            const ipnUrl = 'https://workaiacademy.org/api/pesapal-ipn'; 
            
            const ipnRes = await fetch(`${pesapalBaseUrl}/api/URLSetup/RegisterIPN`, {
              method: 'POST',
              headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', Accept: 'application/json' },
              body: JSON.stringify({ url: ipnUrl, ipn_notification_type: 'POST' })
            });
            let ipnData = await ipnRes.json();
            let ipn_id = ipnData?.ipn_id;
            
            if (ipnData?.error?.message?.includes("already registered") || !ipn_id) {
              const getIpnReq = await fetch(`${pesapalBaseUrl}/api/URLSetup/GetIpnList`, { headers: { Authorization: `Bearer ${token}` } });
              const ipnList = await getIpnReq.json();
              const existingIpn = ipnList?.find((i: any) => i.url === ipnUrl);
              if (existingIpn) ipn_id = existingIpn.ipn_id;
              else if (ipnList?.length > 0) ipn_id = ipnList[0].ipn_id;
            }
            if (!ipn_id) throw new Error("Failed to configure IPN.");

            const orderPayload = {
              id: `order_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
              currency: "USD",
              amount: amount,
              description: description || `Payment for ${product}`,
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

            const submitRes = await fetch(`${pesapalBaseUrl}/api/Transactions/SubmitOrderRequest`, {
              method: "POST",
              headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Accept: "application/json" },
              body: JSON.stringify(orderPayload)
            });
            
            if (!submitRes.ok) throw new Error("Order submission failed: " + await submitRes.text());
            
            const orderData = await submitRes.json();
            
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({
               success: true,
               order_tracking_id: orderData.order_tracking_id,
               merchant_reference: orderData.merchant_reference,
               redirect_url: orderData.redirect_url,
            }));
          } catch (error: any) {
            console.error(error);
            res.statusCode = 500;
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ error: error?.message || String(error) }));
          }
        });
      });
    }
  };
}

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
    pesapalRealPlugin(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})

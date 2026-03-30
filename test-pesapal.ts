import 'dotenv/config';
import { authenticatePesaPal, submitOrder } from './api/_pesapal.ts';

async function run() {
  try {
    console.log("Authenticating PesaPal with key:", process.env.PESAPAL_CONSUMER_KEY);
    
    const auth = await authenticatePesaPal();
    console.log("Auth result:", auth.token ? "Success" : "Failed", auth.error);
    
    if (auth.token) {
      console.log("Submitting order...");
      const redirectUrl = await submitOrder(auth.token, {
        id: "TEST-" + Date.now(),
        currency: "USD",
        amount: 1.00,
        description: "Test Order",
        callback_url: "https://example.com/callback",
        notification_id: "test",
        billing_address: {
          email_address: "test@example.com",
          phone_number: "1234567890",
          country_code: "US",
          first_name: "Test",
          middle_name: "",
          last_name: "User",
          line_1: "",
          line_2: "",
          city: "",
          state: "",
          postal_code: "",
          zip_code: ""
        }
      });

      if (redirectUrl) {
        console.log("✅ Success! Redirect URL:", redirectUrl);
      } else {
        console.log("❌ Failed to get redirect URL");
      }
    }
  } catch(e) {
    console.log("CRITICAL ERROR:");
    console.error(e);
  }
}

run();

import axios from 'axios';
import 'dotenv/config';

// Change this to your local or deployed webhook URL
const WEBHOOK_URL = 'http://localhost:3000/api/webhook'; 
const TEST_USER_ID = 'd54b3629-c17d-4293-9c07-c6401c52287e'; // Replace with a real user ID from your auth.users table

async function simulateWebhook() {
  console.log('🚀 Simulating Paystack Webhook...');

  const payload = {
    event: 'charge.success',
    data: {
      reference: `test_ref_${Date.now()}`,
      amount: 14000, // $1.00 in KES cents (1.00 * 140 * 100)
      status: 'success',
      metadata: JSON.stringify({
        user_id: TEST_USER_ID,
        product: 'platform'
      })
    }
  };

  try {
    const response = await axios.post(WEBHOOK_URL, payload, {
      headers: {
        'Content-Type': 'application/json',
        // In production, Paystack sends 'x-paystack-signature'
      }
    });

    console.log('✅ Webhook Response:', response.status, response.data);
  } catch (error) {
    console.error('❌ Webhook Error:', error.response?.status, error.response?.data || error.message);
  }
}

simulateWebhook();

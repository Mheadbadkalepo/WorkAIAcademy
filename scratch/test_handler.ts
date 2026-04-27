import handler from '../api/webhook';
import { VercelRequest, VercelResponse } from '@vercel/node';
import 'dotenv/config';

// Map VITE_ keys to the ones expected by the backend if they differ
if (!process.env.PAYSTACK_SECRET_KEY && process.env.VITE_PAYSTACK_SECRET_KEY) {
    process.env.PAYSTACK_SECRET_KEY = process.env.VITE_PAYSTACK_SECRET_KEY;
}

if (!process.env.SUPABASE_URL && process.env.VITE_SUPABASE_URL) {
    process.env.SUPABASE_URL = process.env.VITE_SUPABASE_URL;
}

async function test() {
    console.log("Starting Webhook Logic Test...");

    const mockRes = {
        status: (code: number) => {
            console.log('Status:', code);
            return mockRes;
        },
        json: (data: any) => {
            console.log('JSON:', JSON.stringify(data, null, 2));
            return mockRes;
        }
    } as unknown as VercelResponse;
    
    // Scenario 1: Metadata product (already tested, but good to keep)
    console.log("\n--- Scenario 1: Metadata product ---");
    const mockReq1 = {
        method: 'POST',
        body: {
            event: 'charge.success',
            data: {
                reference: 'test_ref_1_' + Date.now(),
                amount: 14000, 
                metadata: JSON.stringify({
                    user_id: 'd54b3629-c17d-4293-9c07-c6401c52287e',
                    product: 'platform'
                })
            }
        }
    } as unknown as VercelRequest;
    await handler(mockReq1, mockRes);

    // Scenario 2: Amount-based fallback (no product in metadata)
    console.log("\n--- Scenario 2: Amount-based fallback (High Guides) ---");
    const mockReq2 = {
        method: 'POST',
        body: {
            event: 'charge.success',
            data: {
                reference: 'test_ref_2_' + Date.now(),
                amount: 70000, // $5.00 * 140 * 100 = 70000
                metadata: JSON.stringify({
                    user_id: 'd54b3629-c17d-4293-9c07-c6401c52287e'
                })
            }
        }
    } as unknown as VercelRequest;
    await handler(mockReq2, mockRes);

    // Scenario 3: Consultation product
    console.log("\n--- Scenario 3: Consultation 60min ---");
    const mockReq3 = {
        method: 'POST',
        body: {
            event: 'charge.success',
            data: {
                reference: 'test_ref_3_' + Date.now(),
                amount: 140000, // $10.00 * 140 * 100 = 140000
                metadata: JSON.stringify({
                    user_id: 'd54b3629-c17d-4293-9c07-c6401c52287e',
                    product: 'consultation_60min'
                })
            }
        }
    } as unknown as VercelRequest;
    await handler(mockReq3, mockRes);
}

test();

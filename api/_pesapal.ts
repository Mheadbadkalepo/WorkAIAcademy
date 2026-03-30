export function getPesapalBaseUrl() {
  const env = process.env.PESAPAL_ENV || 'production';
  return env === 'sandbox'
    ? 'https://cybqa.pesapal.com/pesapalv3'
    : 'https://pay.pesapal.com/v3';
}

export async function getPesapalToken(): Promise<string> {
  const consumerKey = process.env.PESAPAL_CONSUMER_KEY;
  const consumerSecret = process.env.PESAPAL_CONSUMER_SECRET;

  if (!consumerKey || !consumerSecret) {
    throw new Error('Missing PesaPal consumer key or secret');
  }

  const response = await fetch(`${getPesapalBaseUrl()}/api/Auth/RequestToken`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      consumer_key: consumerKey,
      consumer_secret: consumerSecret,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to authenticate with PesaPal: ${response.status} ${errorBody}`);
  }

  const data = await response.json();
  if (!data.token) {
    throw new Error('No token returned from PesaPal auth request');
  }

  return data.token;
}

export async function registerIPN(token: string, url: string): Promise<string> {
  const response = await fetch(`${getPesapalBaseUrl()}/api/URLSetup/RegisterIPN`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      url,
      ipn_notification_type: 'GET',
    }),
  });

  const data = await response.json();
  if (data?.ipn_id) {
    return data.ipn_id;
  }
  throw new Error('Failed to register IPN check logs');
}

export async function getTransactionStatus(token: string, orderTrackingId: string) {
  const response = await fetch(
    `${getPesapalBaseUrl()}/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error(`Failed to get transaction status: ${response.status}`);
  }

  return response.json();
}

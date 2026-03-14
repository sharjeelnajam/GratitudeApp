/**
 * PayPal REST API Service
 *
 * Handles OAuth2 token management, order creation, and order capture
 * using the PayPal v2 Checkout Orders API.
 */

const PAYPAL_BASE_URL =
  process.env.PAYPAL_MODE === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';

const CLIENT_ID = process.env.PAYPAL_CLIENT_ID ?? '';
const CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET ?? '';

let cachedToken: string | null = null;
let tokenExpiresAt = 0;

export async function getAccessToken(): Promise<string> {
  if (cachedToken && Date.now() < tokenExpiresAt) return cachedToken;

  const credentials = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64');

  const res = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  });

  if (!res.ok) {
    const body = await res.text();
    console.error('[PayPal] Token request failed:', res.status, body);
    throw new Error(`PayPal auth failed (${res.status})`);
  }

  const data = (await res.json()) as { access_token: string; expires_in: number };
  cachedToken = data.access_token;
  tokenExpiresAt = Date.now() + (data.expires_in - 60) * 1000;

  return cachedToken;
}

export type CreateOrderResult = {
  orderId: string;
  approvalUrl: string;
};

export async function createOrder(
  amountValue: string,
  currency: string,
  description: string,
  returnUrl: string,
  cancelUrl: string
): Promise<CreateOrderResult> {
  const token = await getAccessToken();

  const payload = {
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: { currency_code: currency, value: amountValue },
        description,
      },
    ],
    payment_source: {
      paypal: {
        experience_context: {
          payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED',
          brand_name: 'GratitudeApp',
          locale: 'en-US',
          landing_page: 'LOGIN',
          user_action: 'PAY_NOW',
          return_url: returnUrl,
          cancel_url: cancelUrl,
        },
      },
    },
  };

  const res = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error('[PayPal] Create order failed:', res.status, body);
    throw new Error(`PayPal create-order failed (${res.status})`);
  }

  const order = (await res.json()) as {
    id: string;
    links: { rel: string; href: string }[];
  };

  const approvalLink = order.links.find((l) => l.rel === 'payer-action');
  if (!approvalLink) throw new Error('PayPal did not return an approval URL');

  console.log('[PayPal] Order created:', order.id);
  return { orderId: order.id, approvalUrl: approvalLink.href };
}

export type CaptureResult = {
  captureId: string;
  status: string;
  amount: string;
  currency: string;
  payerEmail: string;
};

export async function captureOrder(orderId: string): Promise<CaptureResult> {
  const token = await getAccessToken();

  const res = await fetch(`${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/capture`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const body = await res.text();
    console.error('[PayPal] Capture failed:', res.status, body);
    throw new Error(`PayPal capture failed (${res.status})`);
  }

  const data = (await res.json()) as {
    id: string;
    status: string;
    purchase_units: {
      payments: {
        captures: { id: string; amount: { value: string; currency_code: string } }[];
      };
    }[];
    payer: { email_address: string };
  };

  const capture = data.purchase_units?.[0]?.payments?.captures?.[0];
  if (!capture) throw new Error('No capture found in PayPal response');

  console.log('[PayPal] Order captured:', data.id, '→ capture:', capture.id);

  return {
    captureId: capture.id,
    status: data.status,
    amount: capture.amount.value,
    currency: capture.amount.currency_code,
    payerEmail: data.payer?.email_address ?? '',
  };
}

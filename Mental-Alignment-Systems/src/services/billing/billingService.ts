import { API_URL } from '@/config/api';
import { getIdToken } from '@/services/auth';

export type Subscription = {
  isActive: boolean;
  status: 'active' | 'expired' | 'canceled' | 'none';
  isSubscriber: boolean;
  planId: string | null;
  currency: string;
  amountCents: number;
  lastPaidAt: string | null;
  expiresAt: string | null;
};

export type PayPalOrder = {
  orderId: string;
  approvalUrl: string;
};

async function authHeaders(): Promise<Record<string, string>> {
  const token = await getIdToken();
  if (!token) throw new Error('Not authenticated');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

/**
 * Creates a PayPal order on the backend and returns the approval URL
 * that should be opened in a browser for the user to complete payment.
 */
export async function createPayPalOrder(): Promise<PayPalOrder> {
  const headers = await authHeaders();
  const res = await fetch(`${API_URL}/billing/paypal/create-order`, {
    method: 'POST',
    headers,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Failed to create PayPal order (${res.status})`);
  }
  return (await res.json()) as PayPalOrder;
}

/**
 * Checks the current user's subscription status.
 */
export async function getSubscriptionStatus(): Promise<Subscription> {
  const headers = await authHeaders();
  const res = await fetch(`${API_URL}/billing/subscription`, { headers });
  if (!res.ok) throw new Error('Failed to load subscription status');
  const data = (await res.json()) as { subscription: Subscription };
  return data.subscription;
}

/**
 * Legacy: manually marks the user as paid (kept for backwards compatibility).
 */
export async function activateSubscription(provider?: 'paypal' | 'square'): Promise<Subscription> {
  const headers = await authHeaders();
  const res = await fetch(`${API_URL}/billing/subscription/mark-paid`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ provider }),
  });
  if (!res.ok) throw new Error('Failed to activate subscription');
  const data = (await res.json()) as { subscription: Subscription };
  return data.subscription;
}


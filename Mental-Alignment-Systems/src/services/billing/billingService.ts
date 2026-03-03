import { API_URL } from '@/config/api';
import { getIdToken } from '@/services/auth';

export type CheckoutLinks = {
  paypalUrl: string | null;
  squareUrl: string | null;
};

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

let cachedLinks: CheckoutLinks | null = null;

export async function fetchCheckoutLinks(): Promise<CheckoutLinks> {
  if (cachedLinks) return cachedLinks;
  try {
    const res = await fetch(`${API_URL}/billing/checkout-links`);
    if (!res.ok) {
      throw new Error(`Failed to load checkout links (${res.status})`);
    }
    const data = (await res.json()) as CheckoutLinks;
    cachedLinks = data;
    return data;
  } catch (e) {
    console.log(
      '[Billing] Failed to fetch checkout links, falling back to client env:',
      e instanceof Error ? e.message : e
    );
    return { paypalUrl: null, squareUrl: null };
  }
}

export async function getSubscriptionStatus(): Promise<Subscription> {
  const token = await getIdToken();
  if (!token) {
    throw new Error('Not authenticated');
  }
  const res = await fetch(`${API_URL}/billing/subscription`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error('Failed to load subscription status');
  }
  const data = (await res.json()) as { subscription: Subscription };
  return data.subscription;
}

export async function activateSubscription(provider?: 'paypal' | 'square'): Promise<Subscription> {
  const token = await getIdToken();
  if (!token) {
    throw new Error('Not authenticated');
  }
  const res = await fetch(`${API_URL}/billing/subscription/mark-paid`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ provider }),
  });
  if (!res.ok) {
    throw new Error('Failed to activate subscription');
  }
  const data = (await res.json()) as { subscription: Subscription };
  return data.subscription;
}


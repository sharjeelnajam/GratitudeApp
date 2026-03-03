import { API_URL } from '@/config/api';

export type CheckoutLinks = {
  paypalUrl: string | null;
  squareUrl: string | null;
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


/**
 * AI Companion Service
 * Talks to the backend /ai/chat endpoint.
 */

import { API_URL } from '@/config/api';
import { getIdToken } from '@/services/auth';

async function authHeaders(): Promise<Record<string, string>> {
  const token = await getIdToken();
  if (!token) throw new Error('Not authenticated');
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

export async function sendCompanionMessage(message: string): Promise<string> {
  const headers = await authHeaders();
  const res = await fetch(`${API_URL}/ai/chat`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ message }),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? 'Failed to get response');
  }

  const data = (await res.json()) as { reply: string };
  return data.reply;
}

export async function clearCompanionHistory(): Promise<void> {
  const headers = await authHeaders();
  const res = await fetch(`${API_URL}/ai/history`, {
    method: 'DELETE',
    headers,
  });

  if (!res.ok) throw new Error('Failed to clear history');
}

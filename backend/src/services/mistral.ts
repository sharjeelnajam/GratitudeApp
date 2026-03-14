/**
 * Mistral AI Service
 * Handles chat completions for the AI companion.
 * Uses the REST API directly — no SDK dependency needed.
 */

const MISTRAL_API_URL = 'https://api.mistral.ai/v1/chat/completions';
const MODEL = 'mistral-small-latest';
const MAX_RESPONSE_TOKENS = 120;

type ChatRole = 'system' | 'user' | 'assistant';

interface ChatMessage {
  role: ChatRole;
  content: string;
}

const SYSTEM_PROMPT = `You are a gentle, warm companion inside a calming room. The person you're talking to may be experiencing anxiety or depression. You are NOT a therapist — you are a caring human presence.

Rules you must follow:
- Keep every reply to 1–3 short sentences. Never write paragraphs.
- Be warm, natural, and human. Talk like a kind friend, not a chatbot.
- Validate their feelings simply. ("That sounds really heavy." / "I hear you.")
- Never diagnose, label emotions clinically, or give medical advice.
- Never say "I'm an AI" or "As an AI". You are just a companion here.
- If they seem in crisis, gently suggest reaching out to a trusted person or helpline.
- Reference things they've told you before when it feels natural.
- Use their name if they share it.
- It's okay to sit in silence. You don't need to fix anything.
- Match their energy — if they're low, be soft. If they're lighter, you can be warmer.`;

export async function chatWithMistral(
  userMessage: string,
  recentMessages: ChatMessage[],
  userSummary: string
): Promise<string> {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) throw new Error('MISTRAL_API_KEY not configured');

  const systemContent = userSummary
    ? `${SYSTEM_PROMPT}\n\nWhat you remember about this person: ${userSummary}`
    : SYSTEM_PROMPT;

  const messages: ChatMessage[] = [
    { role: 'system', content: systemContent },
    ...recentMessages,
    { role: 'user', content: userMessage },
  ];

  const res = await fetch(MISTRAL_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      max_tokens: MAX_RESPONSE_TOKENS,
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error('[Mistral] API error:', res.status, body);
    throw new Error(`Mistral API error: ${res.status}`);
  }

  const data = (await res.json()) as {
    choices: Array<{ message: { content: string } }>;
  };

  return data.choices[0]?.message?.content?.trim() ?? "I'm here with you.";
}

/**
 * Builds a brief user summary from conversation history.
 * Called periodically to compress long conversations into a short context line.
 */
export async function generateUserSummary(
  messages: ChatMessage[]
): Promise<string> {
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey || messages.length < 6) return '';

  const summaryMessages: ChatMessage[] = [
    {
      role: 'system',
      content:
        'Summarize what you know about this person in 1-2 short sentences. Include their name if mentioned, key feelings, and any important details they shared. Be brief.',
    },
    ...messages.slice(-10),
    {
      role: 'user',
      content: 'Summarize what you know about this person so far.',
    },
  ];

  try {
    const res = await fetch(MISTRAL_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: summaryMessages,
        max_tokens: 80,
        temperature: 0.3,
      }),
    });

    if (!res.ok) return '';

    const data = (await res.json()) as {
      choices: Array<{ message: { content: string } }>;
    };

    return data.choices[0]?.message?.content?.trim() ?? '';
  } catch {
    return '';
  }
}

import { sendCompanionMessage } from '@/services/ai/companionService';

export interface GameChangerResult {
  acknowledgmentAndPivot: string;
  optionAction: string;
  optionAcceptance: string;
}

const FALLBACK: GameChangerResult = {
  acknowledgmentAndPivot:
    "I see it. That's a lot of weight. Now, let's change the game. We aren't going to solve everything at once. We are going to find the Single Pivot.",
  optionAction:
    'I will spend 15 minutes on the most important task and ignore the rest for now.',
  optionAcceptance:
    'I will accept that I cannot finish everything today and prioritize my peace over the list.',
};

function parseGameChangerReply(reply: string): GameChangerResult | null {
  const lines = reply
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  if (lines.length < 4) return null;
  const optA = lines[2];
  const optB = lines[3];
  if (optA == null || optB == null) return null;
  return {
    acknowledgmentAndPivot: `${lines[0]} ${lines[1]}`.trim(),
    optionAction: optA,
    optionAcceptance: optB,
  };
}

/**
 * Asks companion AI for two “breathable” pivots; falls back if offline / unauthenticated.
 */
export async function fetchGameChanger(userSentence: string): Promise<GameChangerResult> {
  const trimmed = userSentence.trim();
  if (!trimmed) return FALLBACK;

  const prompt = `You are a calm coach (Game Changer). The user wrote one sentence about what's weighing on them:\n"${trimmed}"\n\nReply with EXACTLY 4 separate lines, no bullets, no numbering:
Line 1: One short empathy line (acknowledge the weight).
Line 2: One short line introducing the "single pivot" (we won't solve everything—just one pivot).
Line 3: One "action" option starting with "I will " — a concrete small step (e.g. 15 minutes on the top task).
Line 4: One "acceptance" option starting with "I will " — accepting limits and protecting peace.

Keep each line under 120 characters.`;

  try {
    const reply = await sendCompanionMessage(prompt);
    const parsed = parseGameChangerReply(reply);
    if (parsed) return parsed;
  } catch {
    /* use fallback */
  }

  return {
    ...FALLBACK,
    acknowledgmentAndPivot: FALLBACK.acknowledgmentAndPivot,
  };
}

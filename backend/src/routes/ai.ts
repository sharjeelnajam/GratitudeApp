/**
 * AI Companion Routes
 * POST /ai/chat      — Send a message, get a response (auth required)
 * DELETE /ai/history  — Clear conversation history (auth required)
 */

import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { AIConversation } from '../schemas/ai-conversation.schema';
import { chatWithMistral, generateUserSummary } from '../services/mistral';

export const aiRouter = Router();

const CONTEXT_WINDOW = 6; // last 6 messages sent to Mistral (3 pairs)
const SUMMARY_INTERVAL = 10; // regenerate summary every N new messages

aiRouter.post('/chat', authMiddleware, async (req: AuthRequest, res: Response) => {
  const uid = req.user?.uid;
  if (!uid) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  const { message } = req.body as { message?: string };
  if (!message || typeof message !== 'string' || !message.trim()) {
    res.status(400).json({ error: 'Message is required' });
    return;
  }

  const userMessage = message.trim().slice(0, 1000);

  try {
    let convo = await AIConversation.findOne({ firebaseUid: uid });
    if (!convo) {
      convo = new AIConversation({ firebaseUid: uid, messages: [], userSummary: '' });
    }

    const recentMessages = convo.messages.slice(-CONTEXT_WINDOW).map((m) => ({
      role: m.role,
      content: m.content,
    }));

    const reply = await chatWithMistral(userMessage, recentMessages, convo.userSummary);

    convo.messages.push(
      { role: 'user', content: userMessage, createdAt: new Date() },
      { role: 'assistant', content: reply, createdAt: new Date() }
    );
    convo.lastActiveAt = new Date();

    const totalMessages = convo.messages.length;
    if (totalMessages > 0 && totalMessages % SUMMARY_INTERVAL === 0) {
      const allForSummary = convo.messages.map((m) => ({
        role: m.role,
        content: m.content,
      }));
      const summary = await generateUserSummary(allForSummary);
      if (summary) convo.userSummary = summary;
    }

    await convo.save();

    console.log(`[AI] Chat for ${uid} — ${totalMessages} total messages`);
    res.json({ reply });
  } catch (err) {
    console.error('[AI] Chat error:', err);
    res.status(500).json({ error: 'Something went wrong. Please try again.' });
  }
});

aiRouter.delete('/history', authMiddleware, async (req: AuthRequest, res: Response) => {
  const uid = req.user?.uid;
  if (!uid) {
    res.status(401).json({ error: 'Not authenticated' });
    return;
  }

  try {
    await AIConversation.findOneAndUpdate(
      { firebaseUid: uid },
      { messages: [], userSummary: '', lastActiveAt: new Date() }
    );
    res.json({ ok: true });
  } catch (err) {
    console.error('[AI] Clear history error:', err);
    res.status(500).json({ error: 'Failed to clear history' });
  }
});

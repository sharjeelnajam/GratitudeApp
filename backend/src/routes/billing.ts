/**
 * Billing & Subscription routes
 *
 * PayPal flow:
 *   1. App calls POST /billing/paypal/create-order (auth required)
 *   2. Backend creates a PayPal order, returns { orderId, approvalUrl }
 *   3. App opens approvalUrl in browser — user pays on PayPal
 *   4. PayPal redirects to GET /billing/paypal/success?token=ORDER_ID
 *   5. Backend captures the order, marks user as subscriber, shows success HTML
 *   6. App regains focus, calls GET /billing/subscription to confirm
 */

import { Router, Request, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { User } from '../schemas';
import { createOrder, captureOrder } from '../services/paypal';

export const billingRouter = Router();

const SUPPORTER_PLAN_ID = 'supporter-10-eur';
const SUPPORTER_AMOUNT = '10.00';
const SUPPORTER_AMOUNT_CENTS = 1000;
const SUPPORTER_CURRENCY = 'EUR';

function getBackendUrl(): string {
  const port = process.env.PORT || '4000';
  if (process.env.BACKEND_PUBLIC_URL) return process.env.BACKEND_PUBLIC_URL;
  return `http://localhost:${port}`;
}

// ─── PayPal: Create order ───────────────────────────────────────────────────

billingRouter.post(
  '/paypal/create-order',
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    try {
      const baseUrl = getBackendUrl();
      const uid = req.user.uid;

      const result = await createOrder(
        SUPPORTER_AMOUNT,
        SUPPORTER_CURRENCY,
        'GratitudeApp — Supporter Access',
        `${baseUrl}/billing/paypal/success?uid=${encodeURIComponent(uid)}`,
        `${baseUrl}/billing/paypal/cancel`
      );

      // Store the pending order ID on the user so we can verify later
      await User.findOneAndUpdate(
        { firebaseUid: uid },
        { paypalOrderId: result.orderId }
      );

      console.log('[Billing] PayPal order created for uid:', uid, '→', result.orderId);
      res.json({ orderId: result.orderId, approvalUrl: result.approvalUrl });
    } catch (err) {
      console.error('[Billing] PayPal create-order error:', err);
      res.status(500).json({ error: 'Failed to create PayPal order' });
    }
  }
);

// ─── PayPal: Success redirect (browser lands here after approval) ───────────

billingRouter.get('/paypal/success', async (req: Request, res: Response) => {
  const orderId = req.query.token as string | undefined;
  const uid = req.query.uid as string | undefined;

  if (!orderId) {
    res.status(400).send(paypalHtml('Missing order token', false));
    return;
  }

  try {
    const capture = await captureOrder(orderId);

    if (capture.status !== 'COMPLETED') {
      console.error('[Billing] PayPal capture status not COMPLETED:', capture.status);
      res.status(400).send(paypalHtml('Payment was not completed. Please try again.', false));
      return;
    }

    // Find the user: by uid from query string, or by the stored paypalOrderId
    const query = uid
      ? { firebaseUid: uid }
      : { paypalOrderId: orderId };

    const user = await User.findOne(query);

    if (user) {
      const now = new Date();
      const oneMonthMs = 30 * 24 * 60 * 60 * 1000;

      user.isSubscriber = true;
      user.subscriptionPlan = SUPPORTER_PLAN_ID;
      user.subscriptionCurrency = capture.currency;
      user.subscriptionAmountCents = Math.round(Number.parseFloat(capture.amount) * 100);
      user.subscriptionLastPaidAt = now;
      user.subscriptionStatus = 'active';
      user.subscriptionExpiresAt = new Date(now.getTime() + oneMonthMs);
      user.paypalOrderId = orderId;
      user.paypalCaptureId = capture.captureId;
      await user.save();
      console.log('[Billing] User marked as subscriber:', user.firebaseUid);
    } else {
      console.warn('[Billing] PayPal success but user not found. uid:', uid, 'orderId:', orderId);
    }

    res.send(paypalHtml('Payment successful! You can close this window and return to the app.', true));
  } catch (err) {
    console.error('[Billing] PayPal success handler error:', err);
    res.status(500).send(paypalHtml('Something went wrong capturing your payment. Please contact support.', false));
  }
});

// ─── PayPal: Cancel redirect ────────────────────────────────────────────────

billingRouter.get('/paypal/cancel', (_req: Request, res: Response) => {
  res.send(paypalHtml('Payment was cancelled. You can close this window and try again in the app.', false));
});

// ─── Subscription status ────────────────────────────────────────────────────

billingRouter.get('/subscription', authMiddleware, async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const user = await User.findOne({ firebaseUid: req.user.uid });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const now = new Date();
    const expiresAt = user.subscriptionExpiresAt ?? null;
    const isActive =
      !!expiresAt &&
      expiresAt.getTime() > now.getTime() &&
      (user.subscriptionStatus === 'active' || !user.subscriptionStatus);

    res.json({
      subscription: {
        isActive,
        status: user.subscriptionStatus ?? (isActive ? 'active' : 'expired'),
        isSubscriber: !!user.isSubscriber,
        planId: user.subscriptionPlan || null,
        currency: user.subscriptionCurrency || SUPPORTER_CURRENCY,
        amountCents: user.subscriptionAmountCents || 0,
        lastPaidAt: user.subscriptionLastPaidAt ?? null,
        expiresAt,
      },
    });
  } catch (err) {
    console.error('[Billing] GET /billing/subscription error:', err);
    res.status(500).json({ error: 'Failed to load subscription' });
  }
});

// ─── Legacy: mark-paid (kept for backwards compatibility) ───────────────────

billingRouter.post(
  '/subscription/mark-paid',
  authMiddleware,
  async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    try {
      const user = await User.findOne({ firebaseUid: req.user.uid });
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      const now = new Date();
      const oneMonthMs = 30 * 24 * 60 * 60 * 1000;
      const expiresAt = new Date(now.getTime() + oneMonthMs);

      user.isSubscriber = true;
      user.subscriptionPlan = SUPPORTER_PLAN_ID;
      user.subscriptionCurrency = SUPPORTER_CURRENCY;
      user.subscriptionAmountCents = SUPPORTER_AMOUNT_CENTS;
      user.subscriptionLastPaidAt = now;
      user.subscriptionStatus = 'active';
      user.subscriptionExpiresAt = expiresAt;
      await user.save();

      res.json({
        subscription: {
          isActive: true,
          status: user.subscriptionStatus,
          isSubscriber: true,
          planId: user.subscriptionPlan,
          currency: user.subscriptionCurrency,
          amountCents: user.subscriptionAmountCents,
          lastPaidAt: user.subscriptionLastPaidAt,
          expiresAt: user.subscriptionExpiresAt,
        },
      });
    } catch (err) {
      console.error('[Billing] POST /billing/subscription/mark-paid error:', err);
      res.status(500).json({ error: 'Failed to mark subscription as paid' });
    }
  }
);

// ─── HTML helper for browser redirect pages ─────────────────────────────────

function paypalHtml(message: string, success: boolean): string {
  const color = success ? '#6EE7B7' : '#FCA5A5';
  const icon = success ? '✓' : '✕';
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>GratitudeApp Payment</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { min-height: 100vh; display: flex; justify-content: center; align-items: center;
         background: linear-gradient(135deg, #0A0714, #1E1B2E, #2D1B3D); font-family: system-ui, sans-serif; }
  .card { text-align: center; padding: 48px 32px; border-radius: 20px;
          background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1);
          max-width: 400px; margin: 24px; }
  .icon { font-size: 48px; color: ${color}; margin-bottom: 16px; }
  .msg { font-size: 18px; color: rgba(255,255,255,0.9); line-height: 1.5; }
</style></head>
<body><div class="card"><div class="icon">${icon}</div><p class="msg">${message}</p></div></body></html>`;
}


/**
 * Billing & Subscription routes
 * Simple "supporter" subscription: one-time 10 EUR payment recorded on the user.
 *
 * NOTE: This does NOT call PayPal/Square APIs directly.
 * You configure hosted checkout / invoice links in environment variables
 * and the mobile app opens those links. After confirming a payment, the
 * app (once the user is logged in) can hit the mark-paid endpoint to mark
 * the user as a subscriber.
 */

import { Router, Response } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth';
import { User } from '../schemas';

export const billingRouter = Router();

const SUPPORTER_PLAN_ID = 'supporter-10-eur';
const SUPPORTER_AMOUNT_CENTS = 1000;
const SUPPORTER_CURRENCY = 'EUR';

type CheckoutLinksResponse = {
  paypalUrl: string | null;
  squareUrl: string | null;
};

billingRouter.get('/checkout-links', (_req, res: Response<CheckoutLinksResponse>) => {
  const paypalUrl = process.env.PAYPAL_10_EUR_CHECKOUT_URL ?? null;
  const squareUrl = process.env.SQUARE_10_EUR_CHECKOUT_URL ?? null;

  res.json({ paypalUrl, squareUrl });
});

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


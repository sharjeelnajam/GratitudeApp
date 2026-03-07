const PAYPAL_ENV_URL = process.env.EXPO_PUBLIC_PAYPAL_CHECKOUT_URL ?? '';
const SQUARE_ENV_URL = process.env.EXPO_PUBLIC_SQUARE_CHECKOUT_URL ?? '';

/**
 * SHOW_PAYMENT_ALWAYS
 *
 * Set to `true` to show the payment screen on every login (demo / client preview mode).
 * Pressing a payment button will simply navigate to the main app — no API calls or
 * database changes are made.
 *
 * Set to `false` for normal behaviour: payment screen only appears when the user's
 * subscription is inactive or expired.
 */
export const SHOW_PAYMENT_ALWAYS = true;

export const paymentConfig = {
  paypalCheckoutUrl: PAYPAL_ENV_URL,
  squareCheckoutUrl: SQUARE_ENV_URL,
};

export function assertPaymentConfig(provider: 'paypal' | 'square') {
  const url = provider === 'paypal' ? paymentConfig.paypalCheckoutUrl : paymentConfig.squareCheckoutUrl;
  if (!url) {
    const envName =
      provider === 'paypal'
        ? 'EXPO_PUBLIC_PAYPAL_CHECKOUT_URL'
        : 'EXPO_PUBLIC_SQUARE_CHECKOUT_URL';
    throw new Error(
      `${provider === 'paypal' ? 'PayPal' : 'Square'} is not configured yet. Set ${envName} in your environment.`
    );
  }
  return url;
}


/**
 * SHOW_PAYMENT_ALWAYS
 *
 * Set to `true` to show the payment screen on every login (demo / client preview mode).
 * Pressing a payment button will simply navigate to the main app — no API calls or
 * database changes are made.
 *
 * Set to `false` for normal behaviour: payment screen only appears when the user's
 * subscription is inactive or expired. PayPal checkout goes through the real API.
 */
export const SHOW_PAYMENT_ALWAYS = true;

export const PAYPAL_CLIENT_ID = process.env.EXPO_PUBLIC_PAYPAL_CLIENT_ID ?? '';


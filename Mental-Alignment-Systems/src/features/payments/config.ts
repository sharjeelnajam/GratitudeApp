const PAYPAL_ENV_URL = process.env.EXPO_PUBLIC_PAYPAL_CHECKOUT_URL ?? '';
const SQUARE_ENV_URL = process.env.EXPO_PUBLIC_SQUARE_CHECKOUT_URL ?? '';

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


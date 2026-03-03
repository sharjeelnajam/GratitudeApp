import { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Linking from 'expo-linking';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { MaterialIcons } from '@expo/vector-icons';
import { Text } from '@/shared/ui';
import { assertPaymentConfig } from '@/features/payments/config';
import { setPaymentAccessGranted } from '@/features/payments/storage';
import { fetchCheckoutLinks } from '@/services/billing/billingService';

const { width } = Dimensions.get('window');
const CARD_MAX_WIDTH = Math.min(width - 48, 420);

type Provider = 'paypal' | 'square';

const PAYPAL_LOGO_XML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="7.056000232696533 3 37.35095977783203 45"><g clip-path="url(#a)"><path fill="#002991" d="M38.914 13.35c0 5.574-5.144 12.15-12.927 12.15H18.49l-.368 2.322L16.373 39H7.056l5.605-36h15.095c5.083 0 9.082 2.833 10.555 6.77a9.687 9.687 0 0 1 .603 3.58z"></path><path fill="#60CDFF" d="M44.284 23.7A12.894 12.894 0 0 1 31.53 34.5h-5.206L24.157 48H14.89l1.483-9 1.75-11.178.367-2.322h7.497c7.773 0 12.927-6.576 12.927-12.15 3.825 1.974 6.055 5.963 5.37 10.35z"></path><path fill="#008CFF" d="M38.914 13.35C37.31 12.511 35.365 12 33.248 12h-12.64L18.49 25.5h7.497c7.773 0 12.927-6.576 12.927-12.15z"></path></g></svg>`;

const SQUARE_LOGO_XML = `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2000 501.43"><path d="M501.43,83.79v333.84c0,46.27-37.5,83.79-83.79,83.79H83.79c-46.28,0-83.79-37.5-83.79-83.79V83.79C0,37.52,37.52,0,83.79,0h333.84c46.29,0,83.79,37.5,83.79,83.79ZM410.23,117.65c0-14.61-11.85-26.45-26.45-26.45H117.63c-14.61,0-26.45,11.84-26.45,26.45v266.19c0,14.61,11.84,26.45,26.45,26.45h266.17c14.61,0,26.45-11.85,26.45-26.45V117.65h-.02ZM182.32,197.6c0-8.43,6.79-15.26,15.17-15.26h106.4c8.39,0,15.17,6.84,15.17,15.26v106.24c0,8.43-6.75,15.26-15.17,15.26h-106.4c-8.39,0-15.17-6.84-15.17-15.26v-106.24Z"/></svg>`;

export default function PaymentScreen() {
  const router = useRouter();
  const [loadingProvider, setLoadingProvider] = useState<Provider | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = async (provider: Provider) => {
    if (loadingProvider) return;
    setError(null);
    setLoadingProvider(provider);
    try {
      const links = await fetchCheckoutLinks();
      const checkoutUrlFromBackend =
        provider === 'paypal' ? links.paypalUrl : links.squareUrl;
      const checkoutUrl =
        checkoutUrlFromBackend ?? assertPaymentConfig(provider);
      const redirectUrl = Linking.createURL('/payment-complete');

      const result = await WebBrowser.openAuthSessionAsync(checkoutUrl, redirectUrl);

      if (result.type === 'success') {
        await setPaymentAccessGranted();
        router.replace('/login');
        return;
      }

      if (result.type === 'cancel') {
        setError('Payment was cancelled. You can try again anytime.');
      } else {
        setError('Unable to confirm payment. Please try again.');
      }
    } catch (e) {
      const message =
        e instanceof Error ? e.message : 'Something went wrong starting the payment.';
      setError(message);
    } finally {
      setLoadingProvider(null);
    }
  };

  return (
    <LinearGradient
      colors={['#0A0714', '#1E1B2E', '#2D1B3D', '#3B2F4D']}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.container}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.kicker}>Before you enter</Text>
              <Text style={styles.title}>Unlock your Mental Alignment room</Text>
              <Text style={styles.subtitle}>
                Choose a secure payment method to activate your access. You&apos;ll be redirected
                to a trusted checkout and brought back here automatically.
              </Text>
            </View>

            <View style={styles.cardsWrap}>
              <View style={styles.card}>
                <View style={styles.cardIconRow}>
                  <View style={[styles.pill, styles.paypalPill]}>
                    <SvgXml xml={PAYPAL_LOGO_XML} width={22} height={22} />
                    <Text style={styles.pillTextDark}>PayPal</Text>
                  </View>
                </View>
                <Text style={styles.cardTitle}>Pay with PayPal</Text>
                <Text style={styles.cardBody}>
                  Use your PayPal balance, bank account, or cards. You never share your full card
                  details with us.
                </Text>
                <TouchableOpacity
                  style={[
                    styles.ctaButton,
                    loadingProvider && loadingProvider !== 'paypal' && styles.buttonDisabled,
                  ]}
                  activeOpacity={0.9}
                  onPress={() => startCheckout('paypal')}
                  disabled={!!loadingProvider}
                >
                  {loadingProvider === 'paypal' ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.ctaButtonText}>Continue with PayPal</Text>
                  )}
                </TouchableOpacity>
              </View>

              <View style={styles.card}>
                <View style={styles.cardIconRow}>
                  <View style={[styles.pill, styles.squarePill]}>
                    <SvgXml xml={SQUARE_LOGO_XML} width={20} height={20} />
                    <Text style={styles.pillTextDark}>Square</Text>
                  </View>
                </View>
                <Text style={styles.cardTitle}>Pay with Square</Text>
                <Text style={styles.cardBody}>
                  Pay securely with any major card through Square&apos;s encrypted checkout
                  experience.
                </Text>
                <TouchableOpacity
                  style={[
                    styles.ctaButton,
                    loadingProvider && loadingProvider !== 'square' && styles.buttonDisabled,
                  ]}
                  activeOpacity={0.9}
                  onPress={() => startCheckout('square')}
                  disabled={!!loadingProvider}
                >
                  {loadingProvider === 'square' ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text style={styles.ctaButtonText}>Continue with Square</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <Text style={styles.footerHint}>
            Payments are processed by PayPal or Square. We never store your full card details on
            this device.
          </Text>
        </View>

        {error ? (
          <View style={styles.errorOverlay} pointerEvents="box-none">
            <View style={styles.errorBackdrop} />
            <View style={styles.errorModal}>
              <View style={styles.errorIconRow}>
                <MaterialIcons name="error-outline" size={22} color="#F97373" />
                <Text style={styles.errorTitle}>Something went wrong</Text>
              </View>
              <Text style={styles.errorMessage}>{error}</Text>
              <TouchableOpacity
                style={styles.errorButton}
                onPress={() => setError(null)}
                activeOpacity={0.9}
              >
                <Text style={styles.errorButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : null}
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    maxWidth: CARD_MAX_WIDTH,
  },
  header: {
    marginBottom: 32,
  },
  kicker: {
    fontSize: 13,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: 'rgba(255, 255, 255, 0.6)',
    marginBottom: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  errorBanner: {
    width: '100%',
    maxWidth: CARD_MAX_WIDTH,
    padding: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.18)',
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.6)',
    marginBottom: 20,
  },
  errorText: {
    fontSize: 13,
    color: '#FCA5A5',
  },
  cardsWrap: {
    gap: 18,
  },
  card: {
    borderRadius: 18,
    padding: 18,
    backgroundColor: 'rgba(10, 7, 20, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.25)',
  },
  cardIconRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 10,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  paypalPill: {
    backgroundColor: '#D4E8FF',
  },
  squarePill: {
    backgroundColor: '#E5ECFF',
  },
  pillTextDark: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0B1F33',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  cardBody: {
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255, 255, 255, 0.78)',
    marginBottom: 14,
  },
  ctaButton: {
    height: 50,
    borderRadius: 16,
    backgroundColor: 'rgba(139, 92, 246, 0.95)',
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ctaButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  footerHint: {
    marginTop: 28,
    fontSize: 12,
    lineHeight: 18,
    color: 'rgba(255, 255, 255, 0.5)',
    textAlign: 'center',
    paddingHorizontal: 8,
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
  },
  errorModal: {
    width: '82%',
    maxWidth: 360,
    borderRadius: 18,
    paddingVertical: 18,
    paddingHorizontal: 16,
    backgroundColor: '#111121',
    borderWidth: 1,
    borderColor: 'rgba(248, 113, 113, 0.55)',
  },
  errorIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  errorTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FCA5A5',
  },
  errorMessage: {
    fontSize: 13,
    lineHeight: 18,
    color: 'rgba(255, 255, 255, 0.86)',
    marginBottom: 14,
  },
  errorButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(248, 113, 113, 0.18)',
  },
  errorButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#FCA5A5',
  },
});


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
import { SafeAreaView } from 'react-native-safe-area-context';
import { SvgXml } from 'react-native-svg';
import { MaterialIcons } from '@expo/vector-icons';
import { Text } from '@/shared/ui';
import { activateSubscription } from '@/services/billing/billingService';
import { SHOW_PAYMENT_ALWAYS } from '@/features/payments/config';

const { width } = Dimensions.get('window');
const CARD_MAX_WIDTH = Math.min(width - 48, 420);

type Provider = 'paypal' | 'square';

const PAYPAL_LOGO_XML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="7.056000232696533 3 37.35095977783203 45"><g clip-path="url(#a)"><path fill="#002991" d="M38.914 13.35c0 5.574-5.144 12.15-12.927 12.15H18.49l-.368 2.322L16.373 39H7.056l5.605-36h15.095c5.083 0 9.082 2.833 10.555 6.77a9.687 9.687 0 0 1 .603 3.58z"></path><path fill="#60CDFF" d="M44.284 23.7A12.894 12.894 0 0 1 31.53 34.5h-5.206L24.157 48H14.89l1.483-9 1.75-11.178.367-2.322h7.497c7.773 0 12.927-6.576 12.927-12.15 3.825 1.974 6.055 5.963 5.37 10.35z"></path><path fill="#008CFF" d="M38.914 13.35C37.31 12.511 35.365 12 33.248 12h-12.64L18.49 25.5h7.497c7.773 0 12.927-6.576 12.927-12.15z"></path></g></svg>`;

// Simplified Square "double square" mark so it renders similarly sized to the PayPal icon.
const SQUARE_LOGO_XML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
  <rect x="4" y="4" width="40" height="40" rx="8" ry="8" fill="none" stroke="#0B1020" stroke-width="3" />
  <rect x="15" y="15" width="18" height="18" rx="4" ry="4" fill="none" stroke="#0B1020" stroke-width="3" />
</svg>`;

export default function PaymentScreen() {
  const router = useRouter();
  const [loadingProvider, setLoadingProvider] = useState<Provider | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startCheckout = async (provider: Provider) => {
    if (loadingProvider) return;
    setError(null);

    // Demo / client preview mode — skip payment processing, go to login
    if (SHOW_PAYMENT_ALWAYS) {
      router.replace('/login');
      return;
    }

    setLoadingProvider(provider);
    try {
      const subscription = await activateSubscription(provider);
      if (!subscription.isActive) {
        setError('Subscription could not be activated. Please try again.');
        return;
      }
      router.replace('/welcome');
    } catch (e) {
      const message =
        e instanceof Error ? e.message : 'Something went wrong starting your subscription.';
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
                    <SvgXml xml={SQUARE_LOGO_XML} width={22} height={22} />
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


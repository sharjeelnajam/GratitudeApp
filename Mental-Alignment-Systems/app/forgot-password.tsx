/**
 * Forgot Password Screen
 *
 * Sends a Firebase password-reset email. No backend call needed —
 * Firebase handles delivery directly.
 */

import { useState, useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Text, FadeInView } from '@/shared/ui';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuthContext } from '@/shared/contexts';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');

type ScreenState = 'idle' | 'loading' | 'success';

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { resetPassword } = useAuthContext();

  const [email, setEmail] = useState('');
  const [screenState, setScreenState] = useState<ScreenState>('idle');
  const [localError, setLocalError] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const canSubmit = email.trim().length > 0 && email.includes('@');
  const isLoading = screenState === 'loading';
  const isSuccess = screenState === 'success';

  const handleSendReset = async () => {
    if (!canSubmit || isLoading) return;
    setLocalError(null);
    setScreenState('loading');
    console.log('[ForgotPassword] Attempting reset for:', email.trim());
    try {
      await resetPassword(email.trim());
      console.log('[ForgotPassword] Reset call succeeded — showing success UI');
      setScreenState('success');
    } catch (e) {
      setScreenState('idle');
      const raw = e instanceof Error ? e.message : '';
      console.error('[ForgotPassword] Reset failed:', raw);
      if (raw.includes('user-not-found') || raw.includes('invalid-email')) {
        setLocalError(t('forgotPassword.noAccountFound'));
      } else if (raw.includes('too-many-requests')) {
        setLocalError(t('forgotPassword.tooManyAttempts'));
      } else {
        setLocalError(t('forgotPassword.sendFailed'));
      }
    }
  };

  return (
    <LinearGradient
      colors={['#0A0714', '#1E1B2E', '#2D1B3D', '#3B2F4D']}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
    >
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 40 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Back button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
            disabled={isLoading}
          >
            <MaterialIcons name="arrow-back" size={22} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>

          <FadeInView duration={500}>
            <View style={styles.header}>
              <View style={styles.iconWrap}>
                <MaterialIcons name="lock-reset" size={48} color="#A78BFA" />
              </View>
              <Text style={styles.title}>{t('forgotPassword.title')}</Text>
              <Text style={styles.subtitle}>
                {t('forgotPassword.subtitle')}
              </Text>
            </View>
          </FadeInView>

          {/* Error banner */}
          {localError ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{localError}</Text>
            </View>
          ) : null}

          {/* Success banner */}
          {isSuccess ? (
            <Animated.View style={[styles.successBanner, { opacity: fadeAnim }]}>
              <MaterialIcons name="check-circle" size={20} color="#6EE7B7" style={styles.successIcon} />
              <Text style={styles.successText}>
                {t('forgotPassword.successMessage')}
              </Text>
            </Animated.View>
          ) : null}

          {/* Form */}
          {!isSuccess ? (
            <Animated.View style={[styles.formCard, { opacity: fadeAnim }]}>
              <Text style={styles.sectionLabel}>{t('forgotPassword.emailLabel')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('forgotPassword.emailPlaceholder')}
                placeholderTextColor="rgba(255, 255, 255, 0.4)"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                editable={!isLoading}
                onSubmitEditing={handleSendReset}
                returnKeyType="send"
              />
              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  (!canSubmit || isLoading) && styles.primaryButtonDisabled,
                ]}
                onPress={handleSendReset}
                disabled={!canSubmit || isLoading}
                activeOpacity={0.8}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <Text style={styles.primaryButtonText}>{t('forgotPassword.sendReset')}</Text>
                )}
              </TouchableOpacity>
            </Animated.View>
          ) : (
            /* After success — offer to go back to login */
            <View style={styles.formCard}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => router.replace('/login')}
                activeOpacity={0.8}
              >
                <Text style={styles.primaryButtonText}>{t('forgotPassword.backToSignIn')}</Text>
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => router.push('/login')}
            disabled={isLoading}
          >
            <Text style={styles.loginLinkText}>{t('forgotPassword.rememberedIt')}</Text>
          </TouchableOpacity>

          <Text style={styles.hint}>
            {t('forgotPassword.hint')}
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 56,
    paddingBottom: 48,
    alignItems: 'center',
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 16,
    padding: 4,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: 'rgba(139, 92, 246, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 300,
  },
  errorBanner: {
    width: '100%',
    maxWidth: 360,
    padding: 14,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
  },
  errorText: {
    fontSize: 14,
    color: '#FCA5A5',
    textAlign: 'center',
  },
  successBanner: {
    width: '100%',
    maxWidth: 360,
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    marginBottom: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(52, 211, 153, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(52, 211, 153, 0.35)',
    gap: 10,
  },
  successIcon: {
    marginTop: 1,
  },
  successText: {
    flex: 1,
    fontSize: 14,
    color: '#6EE7B7',
    lineHeight: 20,
  },
  formCard: {
    width: '100%',
    maxWidth: 360,
    marginBottom: 28,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 0.6,
    marginBottom: 14,
    textTransform: 'uppercase',
  },
  input: {
    width: '100%',
    height: 52,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 18,
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 22,
  },
  primaryButton: {
    width: '100%',
    height: 54,
    borderRadius: 14,
    backgroundColor: 'rgba(139, 92, 246, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(167, 139, 250, 0.5)',
  },
  primaryButtonDisabled: {
    opacity: 0.5,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.4,
  },
  loginLink: {
    marginBottom: 24,
    paddingVertical: 8,
  },
  loginLinkText: {
    fontSize: 15,
    color: '#A78BFA',
    fontWeight: '500',
  },
  hint: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.45)',
    textAlign: 'center',
    paddingHorizontal: 16,
    lineHeight: 18,
  },
});

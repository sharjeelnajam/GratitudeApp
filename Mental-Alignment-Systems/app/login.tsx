/**
 * Login Screen
 *
 * Firebase Auth: Email + Password, Google Sign-In.
 * Sends ID token to backend. Does NOT store passwords locally.
 */

import { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Image,
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
import { Text, FadeInView, LanguageSwitcher } from '@/shared/ui';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuthContext } from '@/shared/contexts';
import { promptGoogleSignIn } from '@/services/auth';
import { useTranslation } from 'react-i18next';

const { width } = Dimensions.get('window');
const LOGO_SIZE = Math.min(width * 0.28, 100);

export default function LoginScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { signInEmail, loading: authLoading, isAuthenticated, error } = useAuthContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [logoError, setLogoError] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const displayError = localError ?? error;

  const canSubmitEmail = email.trim().length > 0 && password.length >= 4;

  const handleLoginWithEmail = async () => {
    if (!canSubmitEmail || isLoading) return;
    setLocalError(null);
    setIsLoading(true);
    try {
      await signInEmail(email.trim(), password);
      router.replace('/');
    } catch {
      setLocalError(t('auth.signInFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (isLoading) return;
    setLocalError(null);
    setIsLoading(true);
    try {
      await promptGoogleSignIn();
      router.replace('/');
    } catch (e) {
      const msg = e instanceof Error ? e.message : t('auth.googleSignInFailed');
      setLocalError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAppleLogin = () => {
    setLocalError(t('auth.appleSetupRequired'));
  };

  if (authLoading) {
    return (
      <LinearGradient
        colors={['#0A0714', '#1E1B2E', '#2D1B3D', '#3B2F4D']}
        style={[styles.gradient, styles.centered]}
      >
        <ActivityIndicator size="large" color="#A78BFA" />
      </LinearGradient>
    );
  }

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
          <FadeInView duration={500}>
            <View style={styles.header}>
              <View style={styles.logoWrap}>
                {logoError ? (
                  <View
                    style={[
                      styles.logoPlaceholder,
                      { width: LOGO_SIZE, height: LOGO_SIZE, borderRadius: LOGO_SIZE / 2 },
                    ]}
                  />
                ) : (
                  <Image
                    source={require('../assets/images/geometry.jpeg')}
                    style={[
                      styles.logoImage,
                      { width: LOGO_SIZE, height: LOGO_SIZE, borderRadius: LOGO_SIZE / 2 },
                    ]}
                    resizeMode="cover"
                    onError={() => setLogoError(true)}
                  />
                )}
              </View>
              <Text style={styles.title}>{t('auth.welcomeBack')}</Text>
              <Text style={styles.subtitle}>{t('auth.signInSubtitle')}</Text>
            </View>
          </FadeInView>

          {displayError ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{displayError}</Text>
            </View>
          ) : null}

          <Animated.View style={[styles.formCard, { opacity: fadeAnim }]}>
            <Text style={styles.sectionLabel}>{t('auth.emailAndPassword')}</Text>
            <TextInput
              style={styles.input}
              placeholder={t('auth.emailPlaceholder')}
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
            <TextInput
              style={[styles.input, styles.inputLast]}
              placeholder={t('auth.passwordPlaceholder')}
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!isLoading}
            />
            <TouchableOpacity
              style={styles.forgotLink}
              onPress={() => router.push('/forgot-password')}
              disabled={isLoading}
            >
              <Text style={styles.forgotLinkText}>{t('auth.forgotPassword')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.primaryButton,
                (!canSubmitEmail || isLoading) && styles.primaryButtonDisabled,
              ]}
              onPress={handleLoginWithEmail}
              disabled={!canSubmitEmail || isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>{t('auth.signInWithEmail')}</Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>{t('auth.orContinueWith')}</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialRow}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={handleGoogleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <MaterialIcons name="language" size={22} color="#FFFFFF" />
              <Text style={styles.socialButtonText}>Google</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={handleAppleLogin}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <MaterialIcons name="phone-iphone" size={22} color="#FFFFFF" />
              <Text style={styles.socialButtonText}>Apple</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.signupLink}
            onPress={() => router.push('/signup')}
            disabled={isLoading}
          >
            <Text style={styles.signupLinkText}>
              {t('auth.noAccount')}
            </Text>
          </TouchableOpacity>

          <Text style={styles.hint}>
            {t('auth.signInHint')}
          </Text>

          <LanguageSwitcher />
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
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
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoWrap: {
    marginBottom: 20,
  },
  logoImage: {
    backgroundColor: 'transparent',
  },
  logoPlaceholder: {
    backgroundColor: 'rgba(139, 92, 246, 0.3)',
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
    marginBottom: 14,
  },
  inputLast: {
    marginBottom: 8,
  },
  forgotLink: {
    alignSelf: 'flex-end',
    marginBottom: 18,
    paddingVertical: 4,
  },
  forgotLinkText: {
    fontSize: 13,
    color: '#A78BFA',
    fontWeight: '500',
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
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    maxWidth: 360,
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  dividerText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 16,
  },
  socialRow: {
    flexDirection: 'row',
    gap: 14,
    width: '100%',
    maxWidth: 360,
    marginBottom: 32,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    height: 52,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
  },
  socialButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  signupLink: {
    marginBottom: 24,
    paddingVertical: 8,
  },
  signupLinkText: {
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

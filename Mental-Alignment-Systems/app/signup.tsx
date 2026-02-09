/**
 * Sign Up Screen
 *
 * Create account with Email + Password.
 * Firebase Auth: createUserWithEmailAndPassword.
 * Do NOT store passwords locally.
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
import { Text, FadeInView } from '@/shared/ui';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuthContext } from '@/shared/contexts';
import { promptGoogleSignIn } from '@/services/auth';

const { width } = Dimensions.get('window');
const LOGO_SIZE = Math.min(width * 0.28, 100);

export default function SignUpScreen() {
  const router = useRouter();
  const { signUpEmail, loading: authLoading, isAuthenticated, error } = useAuthContext();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/intro');
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  const displayError = localError ?? error;

  const passwordsMatch = password === confirmPassword && password.length > 0;
  const canSubmit =
    email.trim().length > 0 &&
    password.length >= 6 &&
    confirmPassword.length >= 6 &&
    passwordsMatch;

  const handleSignUpWithEmail = async () => {
    if (!canSubmit || isLoading) return;
    if (!passwordsMatch) {
      setLocalError('Passwords do not match');
      return;
    }
    setLocalError(null);
    setIsLoading(true);
    console.log('[SignUp] Create account pressed');
    try {
      await signUpEmail(email.trim(), password, name.trim() || undefined);
      console.log('[SignUp] Success');
      router.replace('/questions');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Sign up failed';
      console.log('[SignUp] Error:', msg);
      setLocalError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (isLoading) return;
    setLocalError(null);
    setIsLoading(true);
    console.log('[SignUp] Google sign up pressed');
    try {
      await promptGoogleSignIn();
      console.log('[SignUp] Google success');
      router.replace('/intro');
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Google sign up failed';
      console.log('[SignUp] Google error:', msg);
      setLocalError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateToLogin = () => {
    router.replace('/login');
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
                <Image
                  source={require('../assets/images/geometry.jpeg')}
                  style={[
                    styles.logoImage,
                    { width: LOGO_SIZE, height: LOGO_SIZE, borderRadius: LOGO_SIZE / 2 },
                  ]}
                  resizeMode="cover"
                />
              </View>
              <Text style={styles.title}>Create account</Text>
              <Text style={styles.subtitle}>Join and begin your journey</Text>
            </View>
          </FadeInView>

          {displayError ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{displayError}</Text>
            </View>
          ) : null}

          <Animated.View style={[styles.formCard, { opacity: fadeAnim }]}>
            <Text style={styles.sectionLabel}>Email & password</Text>
            <TextInput
              style={styles.input}
              placeholder="Name (optional)"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              editable={!isLoading}
            />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              editable={!isLoading}
            />
            <TextInput
              style={styles.input}
              placeholder="Password (min 6 characters)"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!isLoading}
            />
            <TextInput
              style={[styles.input, styles.inputLast]}
              placeholder="Confirm password"
              placeholderTextColor="rgba(255, 255, 255, 0.4)"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              editable={!isLoading}
            />
            <TouchableOpacity
              style={[
                styles.primaryButton,
                (!canSubmit || isLoading) && styles.primaryButtonDisabled,
              ]}
              onPress={handleSignUpWithEmail}
              disabled={!canSubmit || isLoading}
              activeOpacity={0.8}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color="#FFFFFF" />
              ) : (
                <Text style={styles.primaryButtonText}>Create account</Text>
              )}
            </TouchableOpacity>
          </Animated.View>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or continue with</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.socialRow}>
            <TouchableOpacity
              style={styles.socialButton}
              onPress={handleGoogleSignUp}
              disabled={isLoading}
              activeOpacity={0.8}
            >
              <MaterialIcons name="language" size={22} color="#FFFFFF" />
              <Text style={styles.socialButtonText}>Google</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.loginLink}
            onPress={handleNavigateToLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginLinkText}>
              Already have an account? Sign in
            </Text>
          </TouchableOpacity>

          <Text style={styles.hint}>
            Your password is never stored locally.
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
    marginBottom: 24,
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

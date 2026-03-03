import { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthContext } from '@/shared/contexts';
import { getSubscriptionStatus } from '@/services/billing/billingService';

export default function IndexScreen() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuthContext();

  useEffect(() => {
    if (loading) return;

    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }

    let isMounted = true;
    (async () => {
      try {
        const sub = await getSubscriptionStatus();
        if (!isMounted) return;
        if (sub.isActive) {
          router.replace('/welcome');
        } else {
          router.replace('/payment');
        }
      } catch {
        if (!isMounted) return;
        router.replace('/payment');
      } finally {
        // noop
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [loading, isAuthenticated, router]);

  return (
    <View style={styles.placeholder}>
      <ActivityIndicator size="large" color="#A78BF9" />
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    backgroundColor: '#0A0714',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

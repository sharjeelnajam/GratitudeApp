import { useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { useAuthContext } from '@/shared/contexts';
import { getSubscriptionStatus } from '@/services/billing/billingService';
import { SHOW_PAYMENT_ALWAYS } from '@/features/payments/config';
import {
  captureInitialInviteUrlOnce,
  getPendingRoomInviteHref,
  clearPendingRoomInviteHref,
} from '@/services/roomInvite/roomInviteLink';

export default function IndexScreen() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuthContext();

  useEffect(() => {
    void captureInitialInviteUrlOnce();
  }, []);

  useEffect(() => {
    if (loading) return;

    let cancelled = false;
    (async () => {
      await captureInitialInviteUrlOnce();
      if (cancelled) return;

      const pending = await getPendingRoomInviteHref();
      if (pending && isAuthenticated) {
        await clearPendingRoomInviteHref();
        if (!cancelled) router.replace(pending as Href);
        return;
      }

      if (cancelled) return;

      if (SHOW_PAYMENT_ALWAYS) {
        router.replace(isAuthenticated ? '/payment' : '/login');
        return;
      }

      if (!isAuthenticated) {
        router.replace('/login');
        return;
      }

      try {
        const sub = await getSubscriptionStatus();
        if (cancelled) return;
        if (sub.isActive) {
          router.replace('/home');
        } else {
          router.replace('/payment');
        }
      } catch {
        if (!cancelled) router.replace('/payment');
      }
    })();

    return () => {
      cancelled = true;
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

import { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthContext } from '@/shared/contexts';
import { getPaymentAccess } from '@/features/payments/storage';

export default function IndexScreen() {
  const router = useRouter();
  const { isAuthenticated } = useAuthContext();
  const [hasPaymentAccess, setHasPaymentAccess] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const hasAccess = await getPaymentAccess();
      if (!isMounted) return;
      setHasPaymentAccess(hasAccess);
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (hasPaymentAccess === null) return;
    if (!hasPaymentAccess) {
      router.replace('/payment');
      return;
    }
    if (isAuthenticated) {
      router.replace('/welcome');
    } else {
      router.replace('/login');
    }
  }, [hasPaymentAccess, isAuthenticated, router]);

  return (
    <View style={styles.placeholder}>
      {hasPaymentAccess === null ? (
        <ActivityIndicator size="large" color="#A78BF9" />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    backgroundColor: '#0A0714',
  },
});

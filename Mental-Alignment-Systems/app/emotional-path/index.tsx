/**
 * Choose emotional regulation path (client spec: Anxious vs Overwhelmed).
 */

import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/shared/ui';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

export default function EmotionalPathPicker() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient colors={['#0A0714', '#1a1528', '#1e2a38']} style={styles.root}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 20, paddingBottom: 32 + insets.bottom },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.back}
          onPress={() => router.back()}
          hitSlop={12}
          accessibilityRole="button"
          accessibilityLabel="Back"
        >
          <MaterialIcons name="arrow-back" size={22} color="rgba(255,255,255,0.85)" />
        </TouchableOpacity>

        <Text style={styles.kicker}>Emotional check-in</Text>
        <Text style={styles.title}>How does it feel inside?</Text>
        <Text style={styles.subtitle}>Choose what matches most. There is no wrong answer.</Text>

        <TouchableOpacity
          style={styles.cardOuter}
          activeOpacity={0.9}
          onPress={() => router.push('/emotional-path/anxious')}
        >
          <LinearGradient colors={['#1a3d48', '#120e18']} style={styles.cardInner}>
            <View style={styles.cardTop}>
              <View style={styles.bubble}>
                <MaterialIcons name="spa" size={22} color="#7dd3fc" />
              </View>
              <View style={[styles.dot, { backgroundColor: '#38bdf8' }]} />
            </View>
            <Text style={styles.cardEyebrow}>Path · Anxious</Text>
            <Text style={styles.cardTitle}>Physiological regulation</Text>
            <Text style={styles.cardBody}>
              We go to the body first—steady breath and grounding when the mind is racing.
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cardOuter}
          activeOpacity={0.9}
          onPress={() => router.push('/emotional-path/overwhelmed')}
        >
          <LinearGradient colors={['#3d2f50', '#120f18']} style={styles.cardInner}>
            <View style={styles.cardTop}>
              <View style={styles.bubble}>
                <MaterialIcons name="layers" size={22} color="#ddd6fe" />
              </View>
              <View style={[styles.dot, { backgroundColor: '#a78bfa' }]} />
            </View>
            <Text style={styles.cardEyebrow}>Path · Overwhelmed</Text>
            <Text style={styles.cardTitle}>From chaos to clarity</Text>
            <Text style={styles.cardBody}>
              A gentle mental reset—one sentence, one pivot, one step that feels breathable.
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  content: { paddingHorizontal: 24 },
  back: {
    alignSelf: 'flex-start',
    marginBottom: 18,
    padding: 4,
  },
  kicker: {
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    color: 'rgba(186,230,253,0.55)',
    marginBottom: 8,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.96)',
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 21,
    color: 'rgba(226,232,240,0.68)',
    marginBottom: 28,
  },
  cardOuter: {
    borderRadius: 22,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.32,
    shadowRadius: 14,
    elevation: 8,
  },
  cardInner: {
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bubble: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dot: { width: 8, height: 8, borderRadius: 4 },
  cardEyebrow: {
    marginTop: 14,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: 6,
  },
  cardTitle: {
    fontSize: 19,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.95)',
    marginBottom: 8,
  },
  cardBody: {
    fontSize: 13,
    lineHeight: 19,
    color: 'rgba(226,232,240,0.72)',
  },
});

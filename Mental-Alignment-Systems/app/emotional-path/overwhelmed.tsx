/**
 * PATH: OVERWHELMED — Game Changer mental dump, pivot cards, cloud integration (client spec).
 */

import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/shared/ui';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import {
  OVERWHELMED,
  fetchGameChanger,
  OVERWHELMED_DEVICE_TTS_ENABLED,
  VOICE_AUDIO_OVERWHELMED,
  usePathVoicePlayer,
  speakPathLine,
  stopDeviceSpeech,
  type GameChangerResult,
} from '@/features/emotional-paths';

type Phase = 'intro' | 'dump' | 'reframe' | 'cards' | 'integrate';

const { width: WIN_W } = Dimensions.get('window');

function CloudLayer({
  bottom,
  size,
  delayMs,
}: {
  bottom: number;
  size: number;
  delayMs: number;
}) {
  const fade = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    const anim = Animated.timing(fade, {
      toValue: 0,
      duration: 26000,
      useNativeDriver: true,
      delay: delayMs,
    });
    anim.start();
    return () => anim.stop();
  }, [delayMs, fade]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.cloud,
        {
          width: size,
          height: size * 0.62,
          bottom,
          borderRadius: size * 0.35,
          opacity: fade,
        },
      ]}
    />
  );
}

export default function OverwhelmedPathScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [phase, setPhase] = useState<Phase>('intro');
  const [dump, setDump] = useState('');
  const [loading, setLoading] = useState(false);
  const [gc, setGc] = useState<GameChangerResult | null>(null);
  const [selected, setSelected] = useState<'action' | 'acceptance' | null>(null);
  const [showPivotLine, setShowPivotLine] = useState(false);

  const skyFade = useRef(new Animated.Value(0)).current;
  const { playClip, stop: stopVoice } = usePathVoicePlayer();

  /** Part A — recorded clip if set, else device TTS reads the same intro copy */
  useEffect(() => {
    if (phase !== 'intro') return;
    stopDeviceSpeech();
    stopVoice();
    const clip = VOICE_AUDIO_OVERWHELMED.intro;
    if (clip != null) {
      playClip(clip);
    } else if (OVERWHELMED_DEVICE_TTS_ENABLED) {
      speakPathLine(OVERWHELMED.introVoice);
    } else {
      playClip(null);
    }
    return () => {
      stopVoice();
      stopDeviceSpeech();
    };
  }, [phase, playClip, stopVoice]);

  /** Part B — clip if set; else TTS reads live AI paragraph (`acknowledgmentAndPivot`) */
  useEffect(() => {
    if (phase !== 'reframe' || loading || !gc) return;
    stopDeviceSpeech();
    stopVoice();
    const clip = VOICE_AUDIO_OVERWHELMED.reframe;
    if (clip != null) {
      playClip(clip);
    } else if (OVERWHELMED_DEVICE_TTS_ENABLED) {
      speakPathLine(gc.acknowledgmentAndPivot);
    } else {
      playClip(null);
    }
    return () => {
      stopVoice();
      stopDeviceSpeech();
    };
  }, [phase, loading, gc, playClip, stopVoice]);

  /** Part D — integration; clip or TTS for closing copy */
  useEffect(() => {
    if (phase !== 'integrate') return;
    stopDeviceSpeech();
    stopVoice();
    const clip = VOICE_AUDIO_OVERWHELMED.integration;
    if (clip != null) {
      playClip(clip);
    } else if (OVERWHELMED_DEVICE_TTS_ENABLED) {
      speakPathLine(OVERWHELMED.integration);
    } else {
      playClip(null);
    }
    return () => {
      stopVoice();
      stopDeviceSpeech();
    };
  }, [phase, playClip, stopVoice]);

  useEffect(() => {
    if (phase !== 'integrate') return;
    skyFade.setValue(0);
    Animated.timing(skyFade, {
      toValue: 1,
      duration: 8000,
      useNativeDriver: true,
    }).start();
  }, [phase, skyFade]);

  const submitDump = async () => {
    if (!dump.trim()) return;
    setLoading(true);
    setPhase('reframe');
    try {
      const result = await fetchGameChanger(dump.trim());
      setGc(result);
    } finally {
      setLoading(false);
    }
  };

  const proceedToCards = () => {
    setPhase('cards');
  };

  const selectCard = (key: 'action' | 'acceptance') => {
    setSelected(key);
    setShowPivotLine(true);
  };

  const finish = () => {
    stopVoice();
    stopDeviceSpeech();
    router.replace('/(tabs)/home');
  };

  const goBack = () => {
    stopVoice();
    stopDeviceSpeech();
    router.back();
  };

  const softBg = ['#e8e4f2', '#dce8f0', '#c5d4e8'] as const;
  const focusBg = ['#141820', '#1a222e', '#121820'] as const;

  const bgColors =
    phase === 'dump' || phase === 'reframe' || phase === 'cards' ? focusBg : phase === 'integrate' ? softBg : focusBg;

  return (
    <LinearGradient colors={[...bgColors]} style={styles.root}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scroll,
            {
              paddingTop: insets.top + 12,
              paddingBottom: 32 + insets.bottom,
              flexGrow: 1,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableOpacity
            style={styles.back}
            onPress={goBack}
            hitSlop={12}
            accessibilityRole="button"
            accessibilityLabel="Back"
          >
            <MaterialIcons
              name="arrow-back"
              size={22}
              color={phase === 'integrate' ? 'rgba(30,27,50,0.75)' : 'rgba(255,255,255,0.85)'}
            />
          </TouchableOpacity>

          {phase === 'intro' ? (
            <View style={styles.block}>
              <Text style={styles.eyebrowMuted}>{OVERWHELMED.pathLabel}</Text>
              <Text style={styles.voiceLight}>{OVERWHELMED.introVoice}</Text>
              <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.88} onPress={() => setPhase('dump')}>
                <LinearGradient colors={['#3d3358', '#252036']} style={styles.primaryBtnInner}>
                  <Text style={styles.primaryBtnText}>Continue</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : null}

          {phase === 'dump' ? (
            <View style={styles.block}>
              <Text style={styles.promptLight}>{OVERWHELMED.dumpPrompt}</Text>
              <TextInput
                style={styles.input}
                multiline
                value={dump}
                onChangeText={setDump}
                placeholder={OVERWHELMED.dumpPlaceholder}
                placeholderTextColor="rgba(148,163,184,0.55)"
                maxLength={400}
              />
              <TouchableOpacity
                style={[styles.primaryBtn, !dump.trim() && styles.btnDisabled]}
                disabled={!dump.trim()}
                activeOpacity={0.88}
                onPress={() => void submitDump()}
              >
                <LinearGradient colors={['#4c3d6b', '#2a2438']} style={styles.primaryBtnInner}>
                  <Text style={styles.primaryBtnText}>Share with your guide</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          ) : null}

          {phase === 'reframe' ? (
            <View style={styles.block}>
              {loading || !gc ? (
                <Text style={styles.voiceLight}>Listening… finding your pivot.</Text>
              ) : (
                <>
                  <Text style={styles.voiceLight}>{gc.acknowledgmentAndPivot}</Text>
                  <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.88} onPress={proceedToCards}>
                    <LinearGradient colors={['#4c3d6b', '#2a2438']} style={styles.primaryBtnInner}>
                      <Text style={styles.primaryBtnText}>See your choices</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </>
              )}
            </View>
          ) : null}

          {phase === 'cards' && gc ? (
            <View style={styles.block}>
              <Text style={styles.cardPrompt}>{OVERWHELMED.cardPrompt}</Text>
              <TouchableOpacity
                style={[styles.choice, selected === 'action' && styles.choiceOn]}
                activeOpacity={0.88}
                onPress={() => selectCard('action')}
              >
                <Text style={styles.choiceLabel}>Option 1 · Action</Text>
                <Text style={styles.choiceBody}>{gc.optionAction}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.choice, selected === 'acceptance' && styles.choiceOn]}
                activeOpacity={0.88}
                onPress={() => selectCard('acceptance')}
              >
                <Text style={styles.choiceLabel}>Option 2 · Acceptance</Text>
                <Text style={styles.choiceBody}>{gc.optionAcceptance}</Text>
              </TouchableOpacity>
              {showPivotLine ? (
                <Text style={styles.pivotLine}>{OVERWHELMED.pivotAffirmation}</Text>
              ) : null}
              {selected ? (
                <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.88} onPress={() => setPhase('integrate')}>
                  <LinearGradient colors={['#4c3d6b', '#2a2438']} style={styles.primaryBtnInner}>
                    <Text style={styles.primaryBtnText}>Enter integration</Text>
                  </LinearGradient>
                </TouchableOpacity>
              ) : null}
            </View>
          ) : null}

          {phase === 'integrate' ? (
            <View style={styles.integrateWrap}>
              <Animated.View style={[styles.skyHint, { opacity: skyFade }]}>
                <Text style={styles.skyHintText}>Soft sky — let the weight thin out</Text>
              </Animated.View>
              <View style={styles.cloudStage}>
                <CloudLayer bottom={100} size={WIN_W * 0.92} delayMs={0} />
                <CloudLayer bottom={190} size={WIN_W * 0.72} delayMs={350} />
                <CloudLayer bottom={268} size={WIN_W * 0.55} delayMs={700} />
              </View>
              <Text style={styles.integrateCopy}>{OVERWHELMED.integration}</Text>
              <TouchableOpacity style={styles.softBtn} activeOpacity={0.88} onPress={finish}>
                <Text style={styles.softBtnText}>{OVERWHELMED.continueCta}</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  flex: { flex: 1 },
  scroll: { paddingHorizontal: 22 },
  back: { alignSelf: 'flex-start', marginBottom: 12, padding: 4 },
  block: { flex: 1 },
  integrateWrap: { minHeight: 480, paddingBottom: 24 },
  cloudStage: {
    height: 320,
    marginVertical: 12,
    alignItems: 'center',
  },
  cloud: {
    position: 'absolute',
    backgroundColor: 'rgba(100,116,139,0.42)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  skyHint: { alignItems: 'center', marginBottom: 4 },
  skyHintText: {
    fontSize: 12,
    letterSpacing: 0.6,
    color: 'rgba(51,65,85,0.75)',
    textAlign: 'center',
  },
  eyebrowMuted: {
    fontSize: 11,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    marginBottom: 12,
    color: 'rgba(186,230,253,0.55)',
  },
  voiceLight: {
    fontSize: 16,
    lineHeight: 24,
    color: 'rgba(241,245,249,0.9)',
    marginBottom: 20,
    letterSpacing: 0.15,
  },
  promptLight: {
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(226,232,240,0.88)',
    marginBottom: 14,
  },
  input: {
    minHeight: 120,
    borderRadius: 16,
    padding: 14,
    fontSize: 15,
    color: 'rgba(248,250,252,0.95)',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.35)',
    textAlignVertical: 'top',
    marginBottom: 18,
  },
  primaryBtn: {
    borderRadius: 20,
    overflow: 'hidden',
    marginTop: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  btnDisabled: { opacity: 0.45 },
  primaryBtnInner: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  primaryBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(255,255,255,0.95)',
  },
  cardPrompt: {
    fontSize: 14,
    lineHeight: 21,
    color: 'rgba(226,232,240,0.85)',
    marginBottom: 16,
  },
  choice: {
    marginBottom: 12,
    padding: 16,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(148,163,184,0.28)',
  },
  choiceOn: {
    borderColor: 'rgba(167,139,250,0.65)',
    backgroundColor: 'rgba(139,92,246,0.12)',
  },
  choiceLabel: {
    fontSize: 12,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: 'rgba(203,213,225,0.75)',
    marginBottom: 8,
  },
  choiceBody: {
    fontSize: 15,
    lineHeight: 22,
    color: 'rgba(248,250,252,0.92)',
  },
  pivotLine: {
    marginTop: 16,
    fontSize: 15,
    lineHeight: 22,
    fontStyle: 'italic',
    color: 'rgba(224,231,255,0.9)',
  },
  integrateCopy: {
    fontSize: 16,
    lineHeight: 25,
    color: 'rgba(30,41,59,0.88)',
    marginTop: 8,
    marginBottom: 20,
    letterSpacing: 0.2,
  },
  softBtn: {
    alignSelf: 'stretch',
    paddingVertical: 14,
    borderRadius: 18,
    backgroundColor: 'rgba(51,65,85,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(71,85,105,0.35)',
    alignItems: 'center',
  },
  softBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: 'rgba(30,41,59,0.9)',
  },
});

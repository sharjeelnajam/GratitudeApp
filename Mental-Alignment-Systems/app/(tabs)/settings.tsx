/**
 * Settings Tab
 *
 * Language selection, app info, and sign out.
 */

import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { Text, FadeInView, LanguageSwitcher } from '@/shared/ui';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuthContext } from '@/shared/contexts';

export default function SettingsTab() {
  const { t } = useTranslation();
  const router = useRouter();
  const { signOut, user } = useAuthContext();

  const handleSignOut = async () => {
    await signOut();
    router.replace('/login');
  };

  return (
    <LinearGradient
      colors={['#1E1B2E', '#2D1B3D', '#3B2F4D']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <FadeInView duration={600} delay={100}>
          <View style={styles.header}>
            <Text style={styles.title}>{t('settings.title')}</Text>
            {user?.name ? (
              <Text style={styles.userInfo}>{user.name}</Text>
            ) : null}
            {user?.email ? (
              <Text style={styles.userEmail}>{user.email}</Text>
            ) : null}
          </View>
        </FadeInView>

        <FadeInView duration={600} delay={200}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="language" size={20} color="#A78BFA" />
              <Text style={styles.sectionTitle}>{t('settings.selectLanguage')}</Text>
            </View>
            <LanguageSwitcher />
          </View>
        </FadeInView>

        <FadeInView duration={600} delay={300}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="info-outline" size={20} color="#A78BFA" />
              <Text style={styles.sectionTitle}>{t('welcome.appTitle')}</Text>
            </View>
            <Text style={styles.appDescription}>{t('welcome.appSubtitle')}</Text>
            <Text style={styles.version}>v1.0.0</Text>
          </View>
        </FadeInView>

        <FadeInView duration={600} delay={400}>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
            activeOpacity={0.7}
          >
            <MaterialIcons name="logout" size={20} color="#FCA5A5" />
            <Text style={styles.signOutText}>{t('settings.signOut')}</Text>
          </TouchableOpacity>
        </FadeInView>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '300',
    color: '#FFFFFF',
    fontFamily: 'serif',
    letterSpacing: 2,
    marginBottom: 12,
  },
  userInfo: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.85)',
    fontWeight: '500',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
  },
  section: {
    marginBottom: 28,
    padding: 20,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.15)',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    letterSpacing: 0.3,
  },
  appDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: 20,
    marginBottom: 8,
  },
  version: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.4)',
  },
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginTop: 12,
    paddingVertical: 16,
    borderRadius: 14,
    backgroundColor: 'rgba(239, 68, 68, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.25)',
  },
  signOutText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FCA5A5',
  },
});

/**
 * UserHeader
 * Compact top bar: logo + app name (left), avatar (right).
 * Avatar tap opens modal with user details and logout.
 */

import React, { useState, useContext } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Text } from './Text';
import { MaterialIcons } from '@expo/vector-icons';
import { AuthContext } from '@/shared/contexts';

const HEADER_HEIGHT = 48;

export function UserHeader() {
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);
  const auth = useContext(AuthContext);
  if (!auth) return null;
  const { user, signOut } = auth;

  const handleSignOut = async () => {
    setModalVisible(false);
    await signOut();
    router.replace('/login');
  };

  if (!user) return null;

  const displayName = user.name?.trim() || user.email || 'User';
  const email = user.email || '';

  return (
    <>
      <StatusBar style="light" backgroundColor="#0A0714" />
      <View style={styles.container}>
        <View style={styles.content}>
          <View style={styles.left}>
            <Image
              source={require('../../../assets/images/geometry.jpeg')}
              style={styles.logo}
              resizeMode="cover"
            />
            <Text style={styles.appName}>Gratitude Keeper</Text>
          </View>
          <TouchableOpacity
            onPress={() => setModalVisible(true)}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            {user.photoURL ? (
              <Image source={{ uri: user.photoURL }} style={styles.avatar} />
            ) : (
              <View style={styles.avatarPlaceholder}>
                <Text style={styles.avatarLetter}>
                  {displayName.charAt(0).toUpperCase()}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setModalVisible(false)}
        >
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <View style={styles.modalHeader}>
              {user.photoURL ? (
                <Image source={{ uri: user.photoURL }} style={styles.modalAvatar} />
              ) : (
                <View style={[styles.avatarPlaceholder, styles.modalAvatar]}>
                  <Text style={styles.avatarLetter}>
                    {displayName.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <View style={styles.modalUserInfo}>
                <Text style={styles.modalName} numberOfLines={1}>
                  {displayName}
                </Text>
                <Text style={styles.modalEmail} numberOfLines={1}>
                  {email}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.logoutButton}
              onPress={handleSignOut}
              activeOpacity={0.7}
            >
              <MaterialIcons name="logout" size={20} color="rgba(255,255,255,0.9)" />
              <Text style={styles.logoutText}>Sign out</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: -18,
    backgroundColor: 'rgba(10, 7, 20, 0.95)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    minHeight: HEADER_HEIGHT,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: 28,
    height: 28,
    borderRadius: 14,
  },
  appName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(139, 92, 246, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    paddingTop: 100,
    paddingHorizontal: 24,
    alignItems: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'rgba(30, 27, 46, 0.98)',
    borderRadius: 16,
    padding: 20,
    minWidth: 260,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  modalUserInfo: {
    marginLeft: 14,
    flex: 1,
    minWidth: 0,
  },
  modalName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalEmail: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
    marginTop: 2,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
  },
});

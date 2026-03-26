/**
 * Copies invite link and opens the native share sheet (WhatsApp, etc.).
 * Link uses app scheme from app.json (myapp://) — opens Gratitude Keeper to this room.
 */

import { useState } from 'react';
import { TouchableOpacity, StyleSheet, Share, ActivityIndicator, ViewStyle, StyleProp } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { buildRoomInviteLink, isValidRoomInviteType } from '@/services/roomInvite/roomInviteLink';

interface ShareRoomButtonProps {
  readonly roomType: string;
  readonly style?: StyleProp<ViewStyle>;
  readonly size?: number;
}

export function ShareRoomButton({ roomType, style, size = 22 }: ShareRoomButtonProps) {
  const { t } = useTranslation();
  const [busy, setBusy] = useState(false);

  if (!isValidRoomInviteType(roomType)) return null;

  const handlePress = async () => {
    const url = buildRoomInviteLink(roomType);
    if (!url || busy) return;
    setBusy(true);
    try {
      await Clipboard.setStringAsync(url);
      await Share.share({
        message: `${t('rooms.shareInviteMessage')}\n\n${url}`,
        title: t('rooms.shareRoom'),
      });
    } catch {
      /* Share dismissed or failed — link still on clipboard */
    } finally {
      setBusy(false);
    }
  };

  return (
    <TouchableOpacity
      style={[styles.btn, style]}
      onPress={() => void handlePress()}
      activeOpacity={0.75}
      accessibilityRole="button"
      accessibilityLabel={t('rooms.shareRoom')}
    >
      {busy ? (
        <ActivityIndicator size="small" color="#FFFFFF" />
      ) : (
        <MaterialIcons name="share" size={size} color="#FFFFFF" />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(139, 92, 246, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
});

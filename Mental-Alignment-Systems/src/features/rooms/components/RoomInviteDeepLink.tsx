/**
 * Listens for myapp:// room invite URLs while the app is running.
 * Saves pending invite for guests; navigates immediately if already signed in.
 */

import { useEffect } from 'react';
import * as Linking from 'expo-linking';
import { useRouter, type Href } from 'expo-router';
import { useAuthContext } from '@/shared/contexts';
import {
  parseRoomInviteUrlToHref,
  setPendingRoomInviteHref,
  clearPendingRoomInviteHref,
} from '@/services/roomInvite/roomInviteLink';

export function RoomInviteDeepLink() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuthContext();

  useEffect(() => {
    const handleUrl = async (url: string) => {
      const href = parseRoomInviteUrlToHref(url);
      if (!href) return;
      await setPendingRoomInviteHref(href);
      if (loading) return;
      if (isAuthenticated) {
        await clearPendingRoomInviteHref();
        router.replace(href as Href);
      } else {
        router.replace('/login');
      }
    };

    const sub = Linking.addEventListener('url', ({ url }) => {
      void handleUrl(url);
    });

    return () => sub.remove();
  }, [isAuthenticated, loading, router]);

  return null;
}

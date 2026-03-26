/**
 * Room invite deep links (custom scheme from app.json "scheme": "myapp").
 * Opens entering-room flow with ?room= so friends land in the same guided room after auth.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import * as Linking from 'expo-linking';

const STORAGE_KEY = '@gratitude_room_invite_href';

export const ROOM_INVITE_TYPES = ['fireplace', 'ocean', 'forest', 'nightSky'] as const;
export type RoomInviteType = (typeof ROOM_INVITE_TYPES)[number];

const VALID = new Set<string>(ROOM_INVITE_TYPES);

let didCaptureInitialUrl = false;

/**
 * Scheme registered in app.json ("scheme"). Used for shared links so preview/production APK
 * opens the app — never use Linking.createURL() here (it becomes exp://… in dev).
 */
function getNativeAppScheme(): string {
  const env = process.env.EXPO_PUBLIC_APP_LINK_SCHEME?.trim();
  if (env) return env.replace(/:$/, '');

  const scheme = Constants.expoConfig?.scheme;
  if (typeof scheme === 'string' && scheme.length > 0) return scheme;
  if (Array.isArray(scheme) && scheme[0]) return scheme[0];
  return 'myapp';
}

export function isValidRoomInviteType(room: string): room is RoomInviteType {
  return VALID.has(room);
}

/**
 * HTTPS invite page (host `invite.html` next to this base). Google / Gmail / Chat linkify https —
 * they usually do NOT linkify myapp://. Upload `hosting/invite.html` to this URL and set env.
 */
function buildHttpsInvitePageUrl(roomType: RoomInviteType): string | null {
  const raw = process.env.EXPO_PUBLIC_ROOM_INVITE_WEB_URL?.trim();
  if (!raw) return null;
  try {
    const baseStr = raw.includes('://') ? raw : `https://${raw}`;
    const base = new URL(baseStr.endsWith('/') ? baseStr : `${baseStr}/`);
    const target = new URL('invite.html', base);
    target.searchParams.set('room', roomType);
    target.searchParams.set('scheme', getNativeAppScheme());
    return target.toString();
  } catch {
    return null;
  }
}

function parseInviteHttpsUrl(url: string): string | null {
  const raw = process.env.EXPO_PUBLIC_ROOM_INVITE_WEB_URL?.trim();
  if (!raw) return null;
  let base: URL;
  let inviteUrl: URL;
  try {
    const baseStr = raw.includes('://') ? raw : `https://${raw}`;
    base = new URL(baseStr.endsWith('/') ? baseStr : `${baseStr}/`);
    inviteUrl = new URL(url);
  } catch {
    return null;
  }
  if (inviteUrl.protocol !== 'http:' && inviteUrl.protocol !== 'https:') return null;
  if (inviteUrl.origin !== base.origin) return null;

  const expectedPath = new URL('invite.html', base).pathname.replace(/\/$/, '') || '/invite.html';
  const gotPath = inviteUrl.pathname.replace(/\/$/, '');
  if (gotPath.toLowerCase() !== expectedPath.toLowerCase()) {
    return null;
  }

  const room = inviteUrl.searchParams.get('room');
  if (!room || !isValidRoomInviteType(room)) return null;
  return `/entering-room?room=${room}`;
}

/**
 * Prefer HTTPS invite page when `EXPO_PUBLIC_ROOM_INVITE_WEB_URL` is set (clickable in Google apps).
 * Otherwise native scheme (often not auto-linked).
 */
export function buildRoomInviteLink(roomType: string): string | null {
  if (!isValidRoomInviteType(roomType)) return null;
  const https = buildHttpsInvitePageUrl(roomType);
  if (https) return https;
  const scheme = getNativeAppScheme();
  return `${scheme}://entering-room?room=${encodeURIComponent(roomType)}`;
}

/** Expo Router href for navigation. */
export function roomInviteHref(roomType: string): string | null {
  if (!isValidRoomInviteType(roomType)) return null;
  return `/entering-room?room=${roomType}`;
}

export function parseRoomInviteUrlToHref(url: string): string | null {
  if (!url || typeof url !== 'string') return null;

  const fromHttps = parseInviteHttpsUrl(url);
  if (fromHttps) return fromHttps;

  const parsed = Linking.parse(url);
  const rawRoom = parsed.queryParams?.room;
  const room = Array.isArray(rawRoom) ? rawRoom[0] : rawRoom;
  if (!room || typeof room !== 'string' || !isValidRoomInviteType(room)) return null;

  const path = (parsed.path ?? '').replace(/^\/+/, '');
  // myapp://entering-room?room=, or Expo Go exp://host/--/entering-room?room=
  if (path.includes('entering-room')) {
    return `/entering-room?room=${room}`;
  }
  if (parsed.hostname === 'entering-room' || parsed.hostname === '/entering-room') {
    return `/entering-room?room=${room}`;
  }
  return null;
}

export async function setPendingRoomInviteHref(href: string): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, href);
  } catch {
    /* ignore */
  }
}

export async function getPendingRoomInviteHref(): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

export async function clearPendingRoomInviteHref(): Promise<void> {
  try {
    await AsyncStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}

/** Persist invite from a deep link URL (cold start). */
export async function persistInviteFromUrl(url: string): Promise<void> {
  const href = parseRoomInviteUrlToHref(url);
  if (href) await setPendingRoomInviteHref(href);
}

/**
 * Call once on startup before routing. Captures getInitialURL() into pending storage
 * so index/login can navigate after auth.
 */
export async function captureInitialInviteUrlOnce(): Promise<void> {
  if (didCaptureInitialUrl) return;
  didCaptureInitialUrl = true;
  const url = await Linking.getInitialURL();
  if (url) await persistInviteFromUrl(url);
}

/** Returns pending href and clears it (use when navigating to the invite). */
export async function consumePendingRoomInviteHref(): Promise<string | null> {
  const href = await getPendingRoomInviteHref();
  if (href) await clearPendingRoomInviteHref();
  return href;
}

type ReplaceFn = (href: string) => void;

/** After payment (or similar), open pending room invite if any, otherwise `fallback` (e.g. /home). */
export async function replaceWithPendingInviteOr(
  router: { replace: ReplaceFn },
  fallback: string,
): Promise<void> {
  const pending = await consumePendingRoomInviteHref();
  router.replace(pending ?? fallback);
}

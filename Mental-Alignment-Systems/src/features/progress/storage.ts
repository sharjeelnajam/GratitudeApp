import AsyncStorage from '@react-native-async-storage/async-storage';

const PROGRESS_KEY = '@gratitude_keeper:daily_progress_v1';
const RETENTION_DAYS = 35;
const WINDOW_DAYS = 7;

interface DailyCounters {
  logins: number;
  breathing: number;
}

type ProgressMap = Record<string, DailyCounters>;

export interface Last7DayProgress {
  logins: number;
  breathing: number;
  activeDays: number;
}

export interface Last7DayProgressPoint {
  dayLabel: string;
  logins: number;
  breathing: number;
  total: number;
}

function getLocalDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function getDayKeysBack(days: number): string[] {
  const keys: string[] = [];
  const now = new Date();
  for (let i = 0; i < days; i += 1) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    keys.push(getLocalDateKey(d));
  }
  return keys;
}

async function readProgressMap(): Promise<ProgressMap> {
  try {
    const raw = await AsyncStorage.getItem(PROGRESS_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as ProgressMap;
    return parsed ?? {};
  } catch {
    return {};
  }
}

async function writeProgressMap(map: ProgressMap): Promise<void> {
  const validKeys = new Set(getDayKeysBack(RETENTION_DAYS));
  const prunedEntries = Object.entries(map).filter(([key]) => validKeys.has(key));
  const pruned = Object.fromEntries(prunedEntries) as ProgressMap;
  await AsyncStorage.setItem(PROGRESS_KEY, JSON.stringify(pruned));
}

async function incrementCounter(counter: keyof DailyCounters): Promise<void> {
  const map = await readProgressMap();
  const todayKey = getLocalDateKey(new Date());
  const today = map[todayKey] ?? { logins: 0, breathing: 0 };
  today[counter] += 1;
  map[todayKey] = today;
  await writeProgressMap(map);
}

export async function recordLoginEvent(): Promise<void> {
  await incrementCounter('logins');
}

export async function recordBreathingCompletionEvent(): Promise<void> {
  await incrementCounter('breathing');
}

export async function getLast7DayProgress(): Promise<Last7DayProgress> {
  const map = await readProgressMap();
  const keys = getDayKeysBack(WINDOW_DAYS);

  let logins = 0;
  let breathing = 0;
  let activeDays = 0;

  for (const key of keys) {
    const day = map[key];
    if (!day) continue;
    logins += day.logins || 0;
    breathing += day.breathing || 0;
    if ((day.logins || 0) > 0 || (day.breathing || 0) > 0) {
      activeDays += 1;
    }
  }

  return { logins, breathing, activeDays };
}

export async function getLast7DayProgressSeries(): Promise<Last7DayProgressPoint[]> {
  const map = await readProgressMap();
  const keysNewestFirst = getDayKeysBack(WINDOW_DAYS);
  const keysOldestFirst = [...keysNewestFirst].reverse();

  return keysOldestFirst.map((key) => {
    const day = map[key] ?? { logins: 0, breathing: 0 };
    const date = new Date(`${key}T00:00:00`);
    const dayLabel = date.toLocaleDateString(undefined, { weekday: 'short' }).slice(0, 1);
    const total = (day.logins || 0) + (day.breathing || 0);
    return {
      dayLabel,
      logins: day.logins || 0,
      breathing: day.breathing || 0,
      total,
    };
  });
}


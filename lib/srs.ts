import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'fe_handbook_srs_v1';

export interface SrsState {
  easeFactor: number;
  intervalDays: number;
  repetitions: number;
  nextReviewMs: number;
}

const DEFAULT: SrsState = {
  easeFactor: 2.5,
  intervalDays: 0,
  repetitions: 0,
  nextReviewMs: 0,
};

export type Grade = 'again' | 'good' | 'easy';

function qualityFromGrade(g: Grade): number {
  if (g === 'again') return 0;
  if (g === 'good') return 3;
  return 5;
}

/** SM-2 style update; returns new state. */
export function applySm2(prev: SrsState, grade: Grade, nowMs: number): SrsState {
  const q = qualityFromGrade(grade);
  let ef = prev.easeFactor;
  let reps = prev.repetitions;
  let interval = prev.intervalDays;

  ef = Math.max(1.3, ef + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));

  if (q < 3) {
    reps = 0;
    interval = 0;
  } else {
    reps += 1;
    if (reps === 1) interval = 1;
    else if (reps === 2) interval = 6;
    else interval = Math.round(interval * ef);
  }

  const dayMs = 24 * 60 * 60 * 1000;
  const next = nowMs + Math.max(1, interval) * dayMs;

  return {
    easeFactor: ef,
    intervalDays: interval,
    repetitions: reps,
    nextReviewMs: q < 3 ? nowMs : next,
  };
}

async function loadAll(): Promise<Record<string, SrsState>> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as Record<string, SrsState>;
  } catch {
    return {};
  }
}

async function saveAll(map: Record<string, SrsState>) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export async function getSrsForQuizItem(quizItemId: string): Promise<SrsState> {
  const all = await loadAll();
  return all[quizItemId] ?? { ...DEFAULT };
}

export async function setSrsForQuizItem(
  quizItemId: string,
  state: SrsState
): Promise<void> {
  const all = await loadAll();
  all[quizItemId] = state;
  await saveAll(all);
}

export async function getDueQuizItemIds(
  allIds: string[],
  nowMs: number
): Promise<string[]> {
  const all = await loadAll();
  return allIds.filter((id) => {
    const s = all[id];
    if (!s) return true;
    return s.nextReviewMs <= nowMs;
  });
}

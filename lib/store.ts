import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { FUNDS, MODULES } from './content';

export type Allocation = {
  fundId: string;
  /** Percentage of monthly contribution, 0-100. */
  percent: number;
};

type ProgressState = {
  /** Lesson ids the user has completed. */
  completedLessons: string[];
  /** Total confidence points earned. */
  points: number;
  /** ISO date strings for each day a lesson was finished (streak tracking). */
  activeDays: string[];
  /** Glossary terms the user saved. */
  savedTerms: string[];
  /** Onboarding finished. */
  onboarded: boolean;
  displayName: string;
  /** Planned monthly investment in EUR. */
  monthlyAmount: number;
  /** Portfolio allocation across funds (must sum to 100 when set). */
  allocation: Allocation[];

  completeLesson: (lessonId: string, points: number) => void;
  toggleSavedTerm: (term: string) => void;
  setOnboarded: (name: string) => void;
  setMonthlyAmount: (amount: number) => void;
  setAllocation: (allocation: Allocation[]) => void;
  reset: () => void;
};

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

const TOTAL_LESSONS = MODULES.reduce((sum, m) => sum + m.lessons.length, 0);

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      completedLessons: [],
      points: 0,
      activeDays: [],
      savedTerms: [],
      onboarded: false,
      displayName: '',
      monthlyAmount: 100,
      allocation: [
        { fundId: 'world-esg', percent: 50 },
        { fundId: 'gender-equality', percent: 30 },
        { fundId: 'climate-bond', percent: 20 },
      ],

      completeLesson: (lessonId, points) => {
        const { completedLessons, points: cur, activeDays } = get();
        if (completedLessons.includes(lessonId)) return;
        const today = todayISO();
        set({
          completedLessons: [...completedLessons, lessonId],
          points: cur + points,
          activeDays: activeDays.includes(today) ? activeDays : [...activeDays, today],
        });
      },

      toggleSavedTerm: (term) => {
        const { savedTerms } = get();
        set({
          savedTerms: savedTerms.includes(term)
            ? savedTerms.filter((t) => t !== term)
            : [...savedTerms, term],
        });
      },

      setOnboarded: (name) => set({ onboarded: true, displayName: name.trim() }),
      setMonthlyAmount: (amount) => set({ monthlyAmount: Math.max(0, Math.round(amount)) }),
      setAllocation: (allocation) => set({ allocation }),

      reset: () =>
        set({
          completedLessons: [],
          points: 0,
          activeDays: [],
          savedTerms: [],
          onboarded: false,
          displayName: '',
          monthlyAmount: 100,
          allocation: [
            { fundId: 'world-esg', percent: 50 },
            { fundId: 'gender-equality', percent: 30 },
            { fundId: 'climate-bond', percent: 20 },
          ],
        }),
    }),
    {
      name: 'flinta-progress-v1',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

// ---- Derived selectors (plain functions; not hooks) ----

export function computeStreak(activeDays: string[]): number {
  if (activeDays.length === 0) return 0;
  const set = new Set(activeDays);
  let streak = 0;
  const cursor = new Date();
  // Allow today or yesterday as the streak anchor.
  const todayStr = cursor.toISOString().slice(0, 10);
  if (!set.has(todayStr)) {
    cursor.setDate(cursor.getDate() - 1);
    if (!set.has(cursor.toISOString().slice(0, 10))) return 0;
  }
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const key = cursor.toISOString().slice(0, 10);
    if (set.has(key)) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    } else {
      break;
    }
  }
  return streak;
}

export function progressPercent(completed: number): number {
  if (TOTAL_LESSONS === 0) return 0;
  return Math.round((completed / TOTAL_LESSONS) * 100);
}

export { TOTAL_LESSONS, FUNDS };

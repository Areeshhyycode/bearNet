"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { readStorage, writeStorage } from "./storage";
import type { QuizResult } from "./quiz-types";

const STORAGE_KEY = "bearnet:progress:v1";

/** XP awarded per action. */
export const XP = {
  noteSaved: 10,
  perCorrectQuiz: 5,
  perCorrectExam: 8,
  labSolved: 25,
  examPassed: 40,
} as const;

const XP_PER_LEVEL = 500;

export type RunSummary = {
  id: string;
  mode: "quiz" | "exam";
  topic: string;
  difficulty: string;
  score: number;
  total: number;
  percent: number;
  passed: boolean;
  seconds: number;
  finishedAt: string;
  byTopic: { topic: string; correct: number; total: number; percent: number }[];
};

export type Profile = {
  name: string;
  handle: string;
  dailyGoalMinutes: number;
  certTarget: string;
  buddy: "grizzly" | "panda" | "polar";
  accent: string;
  prefs: {
    reminders: boolean;
    sounds: boolean;
    weeklyDigest: boolean;
    publicProfile: boolean;
    reducedMotion: boolean;
  };
};

type ProgressState = {
  xp: number;
  runs: RunSummary[];
  labsSolved: string[];
  /** ISO YYYY-MM-DD for every day with any activity. */
  studyDays: string[];
  /** Minutes studied, keyed by ISO date. */
  minutesByDay: Record<string, number>;
  notesWritten: number;
  profile: Profile;
};

const DEFAULT_PROFILE: Profile = {
  name: "Bear Learner",
  handle: "@bearnet",
  dailyGoalMinutes: 45,
  certTarget: "CompTIA Network+ N10-008",
  buddy: "panda",
  accent: "blush",
  prefs: {
    reminders: true,
    sounds: false,
    weeklyDigest: true,
    publicProfile: false,
    reducedMotion: false,
  },
};

const EMPTY: ProgressState = {
  xp: 0,
  runs: [],
  labsSolved: [],
  studyDays: [],
  minutesByDay: {},
  notesWritten: 0,
  profile: DEFAULT_PROFILE,
};

/* -------------------------------- helpers -------------------------------- */

function isoDay(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

/** Consecutive days of activity, counting back from today or yesterday. */
function computeStreak(days: string[]) {
  if (days.length === 0) return 0;

  const set = new Set(days);
  const today = new Date();
  const cursor = new Date(today);

  // A streak stays alive if you studied today or yesterday.
  if (!set.has(isoDay(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!set.has(isoDay(cursor))) return 0;
  }

  let streak = 0;
  while (set.has(isoDay(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function levelFromXp(xp: number) {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export const RANKS = [
  { id: "beginner", title: "Beginner", emoji: "🌱", minLevel: 1 },
  { id: "explorer", title: "Network Explorer", emoji: "🎀", minLevel: 2 },
  { id: "learner", title: "Network Learner", emoji: "🐻", minLevel: 4 },
  { id: "defender", title: "Cyber Defender", emoji: "🌸", minLevel: 6 },
  { id: "vapt", title: "VAPT Apprentice", emoji: "🐻‍❄️", minLevel: 9 },
] as const;

export type Rank = (typeof RANKS)[number];

export function rankForLevel(level: number): Rank {
  let current: Rank = RANKS[0];
  for (const rank of RANKS) {
    if (level >= rank.minLevel) current = rank;
  }
  return current;
}

/* -------------------------------- context -------------------------------- */

type ProgressContextValue = {
  hydrated: boolean;
  xp: number;
  level: number;
  rank: Rank;
  xpIntoLevel: number;
  xpForNextLevel: number;
  levelPercent: number;
  streak: number;
  runs: RunSummary[];
  quizAccuracy: number | null;
  examsCompleted: number;
  quizzesCompleted: number;
  labsSolved: string[];
  notesWritten: number;
  minutesThisWeek: number;
  weeklyActivity: { day: string; date: string; minutes: number }[];
  topicMastery: { topic: string; percent: number; total: number }[];
  profile: Profile;
  recordRun: (result: QuizResult) => void;
  recordLabSolved: (id: string) => void;
  recordNoteSaved: () => void;
  recordStudyMinutes: (minutes: number) => void;
  updateProfile: (patch: Partial<Profile>) => void;
  resetProgress: () => void;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<ProgressState>(EMPTY);
  const [hydrated, setHydrated] = useState(false);
  const hydratedRef = useRef(false);

  useEffect(() => {
    const stored = readStorage<Partial<ProgressState> | null>(STORAGE_KEY, null);
    if (stored) {
      setState({
        ...EMPTY,
        ...stored,
        profile: {
          ...DEFAULT_PROFILE,
          ...(stored.profile ?? {}),
          prefs: { ...DEFAULT_PROFILE.prefs, ...(stored.profile?.prefs ?? {}) },
        },
      });
    }
    hydratedRef.current = true;
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydratedRef.current) return;
    writeStorage(STORAGE_KEY, state);
  }, [state]);

  /** Every scoring action also marks today as a study day. */
  const touchDay = useCallback((draft: ProgressState): ProgressState => {
    const today = isoDay();
    if (draft.studyDays.includes(today)) return draft;
    return { ...draft, studyDays: [...draft.studyDays, today] };
  }, []);

  const recordRun = useCallback(
    (result: QuizResult) => {
      setState((prev) => {
        const perCorrect =
          result.mode === "exam" ? XP.perCorrectExam : XP.perCorrectQuiz;
        const bonus = result.mode === "exam" && result.passed ? XP.examPassed : 0;

        const summary: RunSummary = {
          id: `${result.mode}-${Date.now()}`,
          mode: result.mode,
          topic: result.topic,
          difficulty: result.difficulty,
          score: result.score,
          total: result.total,
          percent: result.percent,
          passed: result.passed,
          seconds: result.seconds,
          finishedAt: result.finishedAt,
          byTopic: result.byTopic,
        };

        return touchDay({
          ...prev,
          xp: prev.xp + result.score * perCorrect + bonus,
          runs: [summary, ...prev.runs].slice(0, 100),
          minutesByDay: {
            ...prev.minutesByDay,
            [isoDay()]:
              (prev.minutesByDay[isoDay()] ?? 0) +
              Math.max(1, Math.round(result.seconds / 60)),
          },
        });
      });
    },
    [touchDay],
  );

  const recordLabSolved = useCallback(
    (id: string) => {
      setState((prev) => {
        if (prev.labsSolved.includes(id)) return prev;
        return touchDay({
          ...prev,
          xp: prev.xp + XP.labSolved,
          labsSolved: [...prev.labsSolved, id],
        });
      });
    },
    [touchDay],
  );

  const recordNoteSaved = useCallback(() => {
    setState((prev) =>
      touchDay({
        ...prev,
        xp: prev.xp + XP.noteSaved,
        notesWritten: prev.notesWritten + 1,
      }),
    );
  }, [touchDay]);

  const recordStudyMinutes = useCallback(
    (minutes: number) => {
      if (minutes <= 0) return;
      setState((prev) =>
        touchDay({
          ...prev,
          minutesByDay: {
            ...prev.minutesByDay,
            [isoDay()]: (prev.minutesByDay[isoDay()] ?? 0) + minutes,
          },
        }),
      );
    },
    [touchDay],
  );

  const updateProfile = useCallback((patch: Partial<Profile>) => {
    setState((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        ...patch,
        prefs: { ...prev.profile.prefs, ...(patch.prefs ?? {}) },
      },
    }));
  }, []);

  const resetProgress = useCallback(() => setState(EMPTY), []);

  /* ------------------------------ derived ------------------------------- */

  const level = levelFromXp(state.xp);
  const xpIntoLevel = state.xp % XP_PER_LEVEL;
  const streak = useMemo(() => computeStreak(state.studyDays), [state.studyDays]);

  const quizAccuracy = useMemo(() => {
    if (state.runs.length === 0) return null;
    const totals = state.runs.reduce(
      (acc, run) => ({ score: acc.score + run.score, total: acc.total + run.total }),
      { score: 0, total: 0 },
    );
    return totals.total === 0 ? null : Math.round((totals.score / totals.total) * 100);
  }, [state.runs]);

  const weeklyActivity = useMemo(() => {
    const out: { day: string; date: string; minutes: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const key = isoDay(date);
      out.push({
        day: date.toLocaleDateString(undefined, { weekday: "short" }),
        date: key,
        minutes: state.minutesByDay[key] ?? 0,
      });
    }
    return out;
  }, [state.minutesByDay]);

  const topicMastery = useMemo(() => {
    const map = new Map<string, { correct: number; total: number }>();
    for (const run of state.runs) {
      for (const entry of run.byTopic) {
        const current = map.get(entry.topic) ?? { correct: 0, total: 0 };
        current.correct += entry.correct;
        current.total += entry.total;
        map.set(entry.topic, current);
      }
    }
    return [...map.entries()]
      .map(([topic, value]) => ({
        topic,
        total: value.total,
        percent: Math.round((value.correct / value.total) * 100),
      }))
      .sort((a, b) => b.percent - a.percent);
  }, [state.runs]);

  const value = useMemo<ProgressContextValue>(
    () => ({
      hydrated,
      xp: state.xp,
      level,
      rank: rankForLevel(level),
      xpIntoLevel,
      xpForNextLevel: XP_PER_LEVEL,
      levelPercent: Math.round((xpIntoLevel / XP_PER_LEVEL) * 100),
      streak,
      runs: state.runs,
      quizAccuracy,
      examsCompleted: state.runs.filter((r) => r.mode === "exam").length,
      quizzesCompleted: state.runs.filter((r) => r.mode === "quiz").length,
      labsSolved: state.labsSolved,
      notesWritten: state.notesWritten,
      minutesThisWeek: weeklyActivity.reduce((sum, d) => sum + d.minutes, 0),
      weeklyActivity,
      topicMastery,
      profile: state.profile,
      recordRun,
      recordLabSolved,
      recordNoteSaved,
      recordStudyMinutes,
      updateProfile,
      resetProgress,
    }),
    [
      hydrated,
      state.xp,
      state.runs,
      state.labsSolved,
      state.notesWritten,
      state.profile,
      level,
      xpIntoLevel,
      streak,
      quizAccuracy,
      weeklyActivity,
      topicMastery,
      recordRun,
      recordLabSolved,
      recordNoteSaved,
      recordStudyMinutes,
      updateProfile,
      resetProgress,
    ],
  );

  return (
    <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error("useProgress must be used inside <ProgressProvider>");
  }
  return context;
}

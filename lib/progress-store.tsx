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
import { useAuth } from "./auth-context";
import {
  DEFAULT_PREFERENCES,
  type ProgressDoc,
  type RunSummary,
  type UserPreferences,
} from "./types";
import type { QuizResult } from "./quiz-types";

/** XP, streaks and scores, persisted per user in MongoDB. */

export const XP = {
  noteSaved: 10,
  perCorrectQuiz: 5,
  perCorrectExam: 8,
  labSolved: 25,
  examPassed: 40,
} as const;

const XP_PER_LEVEL = 500;

export const RANKS = [
  { id: "beginner", title: "Beginner", emoji: "🌱", minLevel: 1 },
  { id: "explorer", title: "Network Explorer", emoji: "🎀", minLevel: 2 },
  { id: "learner", title: "Network Learner", emoji: "🐻", minLevel: 4 },
  { id: "defender", title: "Cyber Defender", emoji: "🌸", minLevel: 6 },
  { id: "vapt", title: "VAPT Apprentice", emoji: "🐻‍❄️", minLevel: 9 },
] as const;

export type Rank = (typeof RANKS)[number];

export function levelFromXp(xp: number) {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function rankForLevel(level: number): Rank {
  let current: Rank = RANKS[0];
  for (const rank of RANKS) {
    if (level >= rank.minLevel) current = rank;
  }
  return current;
}

function isoDay(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

/** Consecutive days of activity counting back from today or yesterday. */
function computeStreak(days: string[]) {
  if (days.length === 0) return 0;
  const set = new Set(days);
  const cursor = new Date();

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

const EMPTY: Omit<ProgressDoc, "userId"> = {
  xp: 0,
  runs: [],
  labsSolved: [],
  studyDays: [],
  minutesByDay: {},
  notesWritten: 0,
  preferences: DEFAULT_PREFERENCES,
};

type ProgressContextValue = {
  loading: boolean;
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
  minutesToday: number;
  weeklyActivity: { day: string; date: string; minutes: number }[];
  topicMastery: { topic: string; percent: number; total: number }[];
  preferences: UserPreferences;
  recordRun: (result: QuizResult) => void;
  recordLabSolved: (id: string) => void;
  recordNoteSaved: () => void;
  recordStudyMinutes: (minutes: number) => void;
  updatePreferences: (patch: Partial<UserPreferences>) => void;
  resetProgress: () => void;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [state, setState] = useState<Omit<ProgressDoc, "userId">>(EMPTY);
  const [loading, setLoading] = useState(true);

  const loadedRef = useRef(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Load this user's document.
  useEffect(() => {
    let cancelled = false;
    loadedRef.current = false;

    (async () => {
      if (!user) {
        setState(EMPTY);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch("/api/progress", { cache: "no-store" });
        const data = await response.json();
        if (!cancelled && response.ok && data.progress) {
          const { userId: _drop, ...rest } = data.progress as ProgressDoc;
          setState({ ...EMPTY, ...rest });
        }
      } catch {
        // Keep the empty state; the UI still works, it just shows zeros.
      } finally {
        if (!cancelled) {
          loadedRef.current = true;
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  /**
   * Persist changes, debounced so a burst of updates becomes one request.
   * Never fires before the initial load, or an empty state would overwrite
   * real data.
   */
  useEffect(() => {
    if (!user || !loadedRef.current) return;

    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      void fetch("/api/progress", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(state),
      }).catch(() => {});
    }, 600);

    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, [state, user]);

  const touchDay = useCallback((draft: Omit<ProgressDoc, "userId">) => {
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

  const updatePreferences = useCallback((patch: Partial<UserPreferences>) => {
    setState((prev) => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        ...patch,
        timer: { ...prev.preferences.timer, ...(patch.timer ?? {}) },
        prefs: { ...prev.preferences.prefs, ...(patch.prefs ?? {}) },
      },
    }));
  }, []);

  const resetProgress = useCallback(
    () => setState({ ...EMPTY, preferences: DEFAULT_PREFERENCES }),
    [],
  );

  /* ------------------------------- derived ------------------------------- */

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
      loading,
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
      minutesToday: weeklyActivity[weeklyActivity.length - 1]?.minutes ?? 0,
      weeklyActivity,
      topicMastery,
      preferences: state.preferences,
      recordRun,
      recordLabSolved,
      recordNoteSaved,
      recordStudyMinutes,
      updatePreferences,
      resetProgress,
    }),
    [
      loading,
      state.xp,
      state.runs,
      state.labsSolved,
      state.notesWritten,
      state.preferences,
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
      updatePreferences,
      resetProgress,
    ],
  );

  return (
    <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) throw new Error("useProgress must be used inside <ProgressProvider>");
  return context;
}

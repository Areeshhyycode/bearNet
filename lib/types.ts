/**
 * Shared domain types.
 *
 * These are the shapes that cross the network boundary, so they never
 * contain Mongo `ObjectId`s or password hashes — repositories map those
 * away before anything leaves the server.
 */

export type Visibility = "private" | "public";

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export type Note = {
  id: string;
  userId: string;
  /** Denormalised so the community feed does not need a join. */
  authorName: string;
  title: string;
  content: string;
  category: string;
  emoji: string;
  tags: string[];
  visibility: Visibility;
  createdAt: string;
  updatedAt: string;
};

/** What a note looks like to someone who does not own it. */
export type PublicNote = Omit<Note, "userId">;

export type NoteInput = {
  title: string;
  content: string;
  category: string;
  visibility: Visibility;
  tags?: string[];
  emoji?: string;
};

export type RoadmapItem = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  order: number;
};

export type Roadmap = {
  userId: string;
  title: string;
  items: RoadmapItem[];
  updatedAt: string;
};

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

export type TimerPreferences = {
  focusMinutes: number;
  /** Lo-fi player volume, 0–1. */
  volume: number;
};

export type UserPreferences = {
  handle: string;
  dailyGoalMinutes: number;
  certTarget: string;
  buddy: "grizzly" | "panda" | "polar";
  accent: string;
  timer: TimerPreferences;
  prefs: {
    reminders: boolean;
    sounds: boolean;
    weeklyDigest: boolean;
    publicProfile: boolean;
    reducedMotion: boolean;
  };
};

export type ProgressDoc = {
  userId: string;
  xp: number;
  runs: RunSummary[];
  labsSolved: string[];
  /** ISO YYYY-MM-DD for every day with activity. */
  studyDays: string[];
  minutesByDay: Record<string, number>;
  notesWritten: number;
  preferences: UserPreferences;
};

export const DEFAULT_PREFERENCES: UserPreferences = {
  handle: "@bearnet",
  dailyGoalMinutes: 45,
  certTarget: "CompTIA Network+ N10-008",
  buddy: "panda",
  accent: "blush",
  timer: { focusMinutes: 25, volume: 0.5 },
  prefs: {
    reminders: true,
    sounds: false,
    weeklyDigest: true,
    publicProfile: false,
    reducedMotion: false,
  },
};

export const NOTE_CATEGORIES = [
  "Networking Basics",
  "IP Address",
  "MAC Address",
  "OSI Model",
  "TCP/IP",
  "DNS",
  "DHCP",
  "Ports",
  "Subnetting",
  "Linux",
  "Web Security",
  "VAPT",
  "Other",
] as const;

/** Small helper so every note gets a sensible icon without the user picking one. */
export function emojiForCategory(category: string) {
  const map: Record<string, string> = {
    "Networking Basics": "🔌",
    "IP Address": "🔢",
    "MAC Address": "🏷️",
    "OSI Model": "🌈",
    "TCP/IP": "🤝",
    DNS: "🌐",
    DHCP: "📮",
    Ports: "🚪",
    Subnetting: "🧮",
    Linux: "🐧",
    "Web Security": "🛡️",
    VAPT: "🔍",
    Other: "📘",
  };
  return map[category] ?? "📝";
}

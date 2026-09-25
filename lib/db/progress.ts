import "server-only";
import { getDb, ensureIndexes } from "./mongo";
import { DEFAULT_PREFERENCES, type ProgressDoc, type UserPreferences } from "../types";

/** XP, streaks, scores and preferences — one document per user. */

async function progress() {
  await ensureIndexes();
  const db = await getDb();
  return db.collection<ProgressDoc>("progress");
}

function emptyFor(userId: string): ProgressDoc {
  return {
    userId,
    xp: 0,
    runs: [],
    labsSolved: [],
    studyDays: [],
    minutesByDay: {},
    notesWritten: 0,
    preferences: DEFAULT_PREFERENCES,
  };
}

export async function getProgress(userId: string): Promise<ProgressDoc> {
  const collection = await progress();
  const doc = await collection.findOne({ userId });

  if (!doc) {
    const fresh = emptyFor(userId);
    await collection.insertOne(fresh);
    return fresh;
  }

  // Merge defaults so a document written by an older version stays valid.
  return {
    ...emptyFor(userId),
    ...doc,
    preferences: {
      ...DEFAULT_PREFERENCES,
      ...(doc.preferences ?? {}),
      timer: { ...DEFAULT_PREFERENCES.timer, ...(doc.preferences?.timer ?? {}) },
      prefs: { ...DEFAULT_PREFERENCES.prefs, ...(doc.preferences?.prefs ?? {}) },
    },
  };
}

/**
 * Replaces the mutable parts of the document.
 *
 * `userId` is taken from the session by the caller and used as the filter,
 * so a client cannot write into somebody else's progress row.
 */
export async function saveProgress(
  userId: string,
  patch: Partial<Omit<ProgressDoc, "userId">>,
): Promise<ProgressDoc> {
  const collection = await progress();

  await collection.updateOne(
    { userId },
    { $set: { ...patch, userId } },
    { upsert: true },
  );

  return getProgress(userId);
}

export async function savePreferences(
  userId: string,
  preferences: UserPreferences,
): Promise<ProgressDoc> {
  return saveProgress(userId, { preferences });
}

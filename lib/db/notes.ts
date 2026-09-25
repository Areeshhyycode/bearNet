import "server-only";
import { ObjectId, type WithId } from "mongodb";
import { getDb, ensureIndexes } from "./mongo";
import { emojiForCategory, type Note, type NoteInput, type PublicNote } from "../types";

/**
 * Notes repository.
 *
 * Every read and write is scoped by `userId` at the query level, so
 * permission is enforced by the database query itself rather than by
 * filtering in the UI. The only query that is not owner-scoped is
 * `listPublicNotes`, which hard-codes `visibility: "public"`.
 */

type NoteDoc = {
  _id: ObjectId;
  userId: string;
  authorName: string;
  title: string;
  content: string;
  category: string;
  emoji: string;
  tags: string[];
  visibility: "private" | "public";
  createdAt: Date;
  updatedAt: Date;
};

async function notes() {
  await ensureIndexes();
  const db = await getDb();
  return db.collection<NoteDoc>("notes");
}

function toNote(doc: WithId<NoteDoc>): Note {
  return {
    id: doc._id.toString(),
    userId: doc.userId,
    authorName: doc.authorName,
    title: doc.title,
    content: doc.content,
    category: doc.category,
    emoji: doc.emoji,
    tags: doc.tags ?? [],
    visibility: doc.visibility,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

/** Public view drops the owner id so it never reaches another user. */
function toPublicNote(doc: WithId<NoteDoc>): PublicNote {
  const { userId: _ownerId, ...rest } = toNote(doc);
  return rest;
}

function sanitise(input: NoteInput, authorName: string) {
  const category = input.category?.trim() || "Other";
  return {
    authorName,
    title: input.title?.trim() || "Untitled note",
    content: input.content ?? "",
    category,
    emoji: input.emoji || emojiForCategory(category),
    tags: (input.tags ?? []).map((t) => t.trim()).filter(Boolean).slice(0, 8),
    visibility: input.visibility === "public" ? ("public" as const) : ("private" as const),
  };
}

/* --------------------------------- owner --------------------------------- */

export async function listNotes(userId: string): Promise<Note[]> {
  const collection = await notes();
  const docs = await collection
    .find({ userId })
    .sort({ updatedAt: -1 })
    .limit(500)
    .toArray();
  return docs.map(toNote);
}

export async function getOwnedNote(userId: string, id: string): Promise<Note | null> {
  if (!ObjectId.isValid(id)) return null;
  const collection = await notes();
  // Scoped by userId: another user's id simply matches nothing.
  const doc = await collection.findOne({ _id: new ObjectId(id), userId });
  return doc ? toNote(doc) : null;
}

export async function createNote(
  userId: string,
  authorName: string,
  input: NoteInput,
): Promise<Note> {
  const collection = await notes();
  const now = new Date();

  const doc: NoteDoc = {
    _id: new ObjectId(),
    userId,
    ...sanitise(input, authorName),
    createdAt: now,
    updatedAt: now,
  };

  await collection.insertOne(doc);
  return toNote(doc);
}

export async function updateNote(
  userId: string,
  id: string,
  input: NoteInput,
  authorName: string,
): Promise<Note | null> {
  if (!ObjectId.isValid(id)) return null;
  const collection = await notes();

  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id), userId },
    { $set: { ...sanitise(input, authorName), updatedAt: new Date() } },
    { returnDocument: "after" },
  );

  return result ? toNote(result) : null;
}

/** Flips visibility without touching the rest of the note. */
export async function setNoteVisibility(
  userId: string,
  id: string,
  visibility: "private" | "public",
): Promise<Note | null> {
  if (!ObjectId.isValid(id)) return null;
  const collection = await notes();

  const result = await collection.findOneAndUpdate(
    { _id: new ObjectId(id), userId },
    { $set: { visibility, updatedAt: new Date() } },
    { returnDocument: "after" },
  );

  return result ? toNote(result) : null;
}

export async function deleteNote(userId: string, id: string): Promise<boolean> {
  if (!ObjectId.isValid(id)) return false;
  const collection = await notes();
  const result = await collection.deleteOne({ _id: new ObjectId(id), userId });
  return result.deletedCount === 1;
}

/** Keeps the denormalised author name in step with a profile rename. */
export async function renameAuthor(userId: string, authorName: string) {
  const collection = await notes();
  await collection.updateMany({ userId }, { $set: { authorName } });
}

/* -------------------------------- community ------------------------------- */

export async function listPublicNotes({
  search,
  category,
  limit = 60,
}: {
  search?: string;
  category?: string;
  limit?: number;
} = {}): Promise<PublicNote[]> {
  const collection = await notes();

  // visibility is pinned here — a private note cannot reach this result set.
  const query: Record<string, unknown> = { visibility: "public" };

  if (category && category !== "all") query.category = category;

  if (search?.trim()) {
    const safe = search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const rx = new RegExp(safe, "i");
    query.$or = [{ title: rx }, { content: rx }, { category: rx }, { authorName: rx }];
  }

  const docs = await collection
    .find(query)
    .sort({ updatedAt: -1 })
    .limit(Math.min(limit, 200))
    .toArray();

  return docs.map(toPublicNote);
}

export async function getPublicNote(id: string): Promise<PublicNote | null> {
  if (!ObjectId.isValid(id)) return null;
  const collection = await notes();
  const doc = await collection.findOne({ _id: new ObjectId(id), visibility: "public" });
  return doc ? toPublicNote(doc) : null;
}

export async function publicCategories(): Promise<string[]> {
  const collection = await notes();
  const values = await collection.distinct("category", { visibility: "public" });
  return values.filter(Boolean).sort();
}

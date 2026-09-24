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
import { NOTES, NOTE_TOPICS, type Note, type NoteTopic } from "./mock-data";
import { readStorage, writeStorage } from "./storage";

const STORAGE_KEY = "bearnet:notes:v1";

type NotesState = {
  notes: Note[];
  topics: NoteTopic[];
};

const SEED: NotesState = { notes: NOTES, topics: NOTE_TOPICS };

export type NoteDraft = {
  id?: string;
  title: string;
  topicId: string;
  body: string;
  visibility: "private" | "public";
  tags?: string[];
};

type NotesContextValue = {
  notes: Note[];
  /** Topics with a live note count derived from `notes`. */
  topics: NoteTopic[];
  /** False until localStorage has been read — used to avoid flashing seed data. */
  hydrated: boolean;
  getNote: (id: string) => Note | undefined;
  saveNote: (draft: NoteDraft) => string;
  deleteNote: (id: string) => void;
  addTopic: (title: string, emoji?: string) => string;
  deleteTopic: (id: string) => void;
  resetToSeed: () => void;
};

const NotesContext = createContext<NotesContextValue | null>(null);

/* -------------------------------- helpers -------------------------------- */

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

/** Slug that does not collide with anything already stored. */
function uniqueId(base: string, taken: string[]) {
  const root = base || "note";
  if (!taken.includes(root)) return root;

  let n = 2;
  while (taken.includes(`${root}-${n}`)) n += 1;
  return `${root}-${n}`;
}

/** Split a textarea value into paragraphs. */
function toParagraphs(body: string) {
  return body
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

function buildPreview(paragraphs: string[]) {
  const first = paragraphs[0] ?? "";
  return first.length > 180 ? `${first.slice(0, 177)}…` : first;
}

function readMinutes(body: string) {
  const words = body.trim() ? body.trim().split(/\s+/).length : 0;
  return Math.max(1, Math.round(words / 200));
}

/* -------------------------------- provider ------------------------------- */

export function NotesProvider({ children }: { children: React.ReactNode }) {
  // Server and first client render both use the seed, so markup matches.
  const [state, setState] = useState<NotesState>(SEED);
  const [hydrated, setHydrated] = useState(false);
  const hydratedRef = useRef(false);

  // Load whatever is in storage, once.
  useEffect(() => {
    const stored = readStorage<NotesState | null>(STORAGE_KEY, null);
    if (stored?.notes && stored?.topics) setState(stored);
    hydratedRef.current = true;
    setHydrated(true);
  }, []);

  // Persist every change — but never before the load above has run,
  // or the seed would overwrite real notes.
  useEffect(() => {
    if (!hydratedRef.current) return;
    writeStorage(STORAGE_KEY, state);
  }, [state]);

  const getNote = useCallback(
    (id: string) => state.notes.find((note) => note.id === id),
    [state.notes],
  );

  const saveNote = useCallback((draft: NoteDraft) => {
    let savedId = draft.id ?? "";

    setState((prev) => {
      const paragraphs = toParagraphs(draft.body);
      const topic = prev.topics.find((t) => t.id === draft.topicId);
      const now = new Date().toISOString();
      const title = draft.title.trim() || "Untitled note";

      // Update in place.
      if (draft.id) {
        const existing = prev.notes.find((n) => n.id === draft.id);
        if (existing) {
          savedId = existing.id;
          const updated: Note = {
            ...existing,
            title,
            topicId: draft.topicId,
            topic: topic?.title ?? existing.topic,
            preview: buildPreview(paragraphs),
            body: paragraphs,
            visibility: draft.visibility,
            tags: draft.tags ?? existing.tags,
            readMinutes: readMinutes(draft.body),
            updatedAt: now,
          };
          return {
            ...prev,
            notes: prev.notes.map((n) => (n.id === existing.id ? updated : n)),
          };
        }
      }

      // Create.
      const id = uniqueId(
        slugify(title),
        prev.notes.map((n) => n.id),
      );
      savedId = id;

      const created: Note = {
        id,
        title,
        topicId: draft.topicId,
        topic: topic?.title ?? "Networking Basics",
        emoji: topic?.emoji ?? "📝",
        preview: buildPreview(paragraphs),
        body: paragraphs,
        visibility: draft.visibility,
        tags: draft.tags ?? [],
        readMinutes: readMinutes(draft.body),
        updatedAt: now,
      };

      return { ...prev, notes: [created, ...prev.notes] };
    });

    return savedId;
  }, []);

  const deleteNote = useCallback((id: string) => {
    setState((prev) => ({
      ...prev,
      notes: prev.notes.filter((note) => note.id !== id),
    }));
  }, []);

  const addTopic = useCallback((title: string, emoji = "📘") => {
    let newId = "";

    setState((prev) => {
      const clean = title.trim();
      if (!clean) return prev;

      newId = uniqueId(
        slugify(clean),
        prev.topics.map((t) => t.id),
      );

      return {
        ...prev,
        topics: [...prev.topics, { id: newId, title: clean, emoji, noteCount: 0 }],
      };
    });

    return newId;
  }, []);

  /** Removes the topic and every note filed under it. */
  const deleteTopic = useCallback((id: string) => {
    setState((prev) => ({
      topics: prev.topics.filter((topic) => topic.id !== id),
      notes: prev.notes.filter((note) => note.topicId !== id),
    }));
  }, []);

  const resetToSeed = useCallback(() => setState(SEED), []);

  // Note counts always reflect reality rather than a stored number.
  const topics = useMemo(
    () =>
      state.topics.map((topic) => ({
        ...topic,
        noteCount: state.notes.filter((note) => note.topicId === topic.id).length,
      })),
    [state.topics, state.notes],
  );

  const value = useMemo<NotesContextValue>(
    () => ({
      notes: state.notes,
      topics,
      hydrated,
      getNote,
      saveNote,
      deleteNote,
      addTopic,
      deleteTopic,
      resetToSeed,
    }),
    [
      state.notes,
      topics,
      hydrated,
      getNote,
      saveNote,
      deleteNote,
      addTopic,
      deleteTopic,
      resetToSeed,
    ],
  );

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error("useNotes must be used inside <NotesProvider>");
  }
  return context;
}

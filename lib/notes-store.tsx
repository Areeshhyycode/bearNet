"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "./auth-context";
import { NOTE_CATEGORIES, type Note, type NoteInput, type Visibility } from "./types";

/**
 * Notes are stored in MongoDB and reached through /api/notes.
 *
 * Ownership is enforced server-side; this store only mirrors what the API
 * returns so the UI stays snappy.
 */

export type NoteCategory = { id: string; title: string; emoji: string; noteCount: number };

type NotesContextValue = {
  notes: Note[];
  categories: NoteCategory[];
  loading: boolean;
  error: string | null;
  getNote: (id: string) => Note | undefined;
  saveNote: (input: NoteInput & { id?: string }) => Promise<Note | null>;
  deleteNote: (id: string) => Promise<boolean>;
  setVisibility: (id: string, visibility: Visibility) => Promise<Note | null>;
  refresh: () => Promise<void>;
};

const NotesContext = createContext<NotesContextValue | null>(null);

export function NotesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setNotes([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/notes", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data?.error ?? "Could not load notes.");
      setNotes(data.notes ?? []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load notes.");
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Reload whenever the signed-in user changes, so one account never
  // shows another account's notes.
  useEffect(() => {
    void refresh();
  }, [refresh]);

  const getNote = useCallback(
    (id: string) => notes.find((note) => note.id === id),
    [notes],
  );

  const saveNote = useCallback(
    async (input: NoteInput & { id?: string }) => {
      const { id, ...body } = input;
      const response = await fetch(id ? `/api/notes/${id}` : "/api/notes", {
        method: id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data?.error ?? "Could not save the note.");
        return null;
      }

      const saved: Note = data.note;
      setNotes((prev) => {
        const without = prev.filter((note) => note.id !== saved.id);
        return [saved, ...without].sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        );
      });
      setError(null);
      return saved;
    },
    [],
  );

  const deleteNote = useCallback(async (id: string) => {
    // Optimistic: put it back if the server disagrees.
    const snapshot = notes;
    setNotes((prev) => prev.filter((note) => note.id !== id));

    const response = await fetch(`/api/notes/${id}`, { method: "DELETE" });
    if (!response.ok) {
      setNotes(snapshot);
      setError("Could not delete that note.");
      return false;
    }
    return true;
  }, [notes]);

  const setVisibility = useCallback(async (id: string, visibility: Visibility) => {
    const response = await fetch(`/api/notes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visibility }),
    });
    const data = await response.json();

    if (!response.ok) {
      setError(data?.error ?? "Could not change visibility.");
      return null;
    }

    const saved: Note = data.note;
    setNotes((prev) => prev.map((note) => (note.id === saved.id ? saved : note)));
    return saved;
  }, []);

  /** Standard shelves plus any custom category the learner has used. */
  const categories = useMemo<NoteCategory[]>(() => {
    const counts = new Map<string, number>();
    for (const note of notes) {
      counts.set(note.category, (counts.get(note.category) ?? 0) + 1);
    }

    const custom = [...counts.keys()].filter(
      (name) => !NOTE_CATEGORIES.includes(name as (typeof NOTE_CATEGORIES)[number]),
    );

    return [...NOTE_CATEGORIES, ...custom].map((title) => ({
      id: title,
      title,
      emoji: notes.find((n) => n.category === title)?.emoji ?? "📘",
      noteCount: counts.get(title) ?? 0,
    }));
  }, [notes]);

  const value = useMemo<NotesContextValue>(
    () => ({
      notes,
      categories,
      loading,
      error,
      getNote,
      saveNote,
      deleteNote,
      setVisibility,
      refresh,
    }),
    [notes, categories, loading, error, getNote, saveNote, deleteNote, setVisibility, refresh],
  );

  return <NotesContext.Provider value={value}>{children}</NotesContext.Provider>;
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (!context) throw new Error("useNotes must be used inside <NotesProvider>");
  return context;
}

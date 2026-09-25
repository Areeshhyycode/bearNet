import type { Note, PublicNote } from "./types";

/** Display helpers derived from a note's content, shared by every card. */

type AnyNote = Pick<Note | PublicNote, "content">;

export function paragraphs(note: AnyNote): string[] {
  return note.content
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export function preview(note: AnyNote, max = 180): string {
  const first = paragraphs(note)[0] ?? "";
  return first.length > max ? `${first.slice(0, max - 1)}…` : first;
}

export function wordCount(note: AnyNote): number {
  return note.content.trim() ? note.content.trim().split(/\s+/).length : 0;
}

export function readMinutes(note: AnyNote): number {
  return Math.max(1, Math.round(wordCount(note) / 200));
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, PencilLine, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge, VisibilityBadge } from "@/components/ui/badge";
import { useNotes } from "@/lib/notes-store";
import type { Note } from "@/lib/mock-data";
import { formatRelative } from "@/lib/utils";

/** Note preview tile: topic, snippet, last updated, visibility, actions. */
export function NoteCard({ note }: { note: Note }) {
  const { deleteNote } = useNotes();
  const [confirming, setConfirming] = useState(false);

  return (
    <Card hoverable className="group relative flex flex-col gap-space-md">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-container-low text-[18px]">
            <span aria-hidden>{note.emoji}</span>
          </span>
          <div className="min-w-0">
            <h3 className="truncate font-headline-md text-[16px] font-bold text-on-surface">
              {note.title}
            </h3>
            <p className="font-label-badge text-label-badge uppercase tracking-wider text-on-surface-variant">
              {note.topic}
            </p>
          </div>
        </div>
        <VisibilityBadge visibility={note.visibility} />
      </div>

      <p className="line-clamp-3 font-body-sm text-body-sm leading-relaxed text-on-surface-variant">
        {note.preview || "No content yet — open it and start writing."}
      </p>

      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {note.tags.map((tag) => (
            <Badge key={tag} tone="outline">
              {tag}
            </Badge>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between gap-2 font-body-sm text-body-sm text-on-surface-variant">
        <span>🕰️ {formatRelative(note.updatedAt)}</span>
        <span>☕ {note.readMinutes} min read</span>
      </div>

      <div className="mt-auto flex items-center gap-2 pt-1">
        <Link
          href={`/notes/${note.id}`}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-surface-container-high px-3 py-2 font-body-sm text-body-sm font-semibold text-on-surface transition-all hover:bg-primary-container hover:text-on-primary-container"
        >
          <Eye className="h-4 w-4" /> View
        </Link>
        <Link
          href={`/notes/${note.id}`}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-primary-container px-3 py-2 font-body-sm text-body-sm font-semibold text-on-primary-container shadow-sm transition-all hover:bg-primary-fixed-dim"
        >
          <PencilLine className="h-4 w-4" /> Edit
        </Link>
        <button
          type="button"
          aria-label={`Delete ${note.title}`}
          title="Delete note"
          onClick={() => setConfirming(true)}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-surface-container-low text-on-surface-variant transition-colors hover:bg-error-container hover:text-on-error-container"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Delete confirmation */}
      {confirming && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-space-md rounded-[24px] bg-surface-container-lowest/95 p-space-lg text-center backdrop-blur-sm">
          <span className="text-3xl" aria-hidden>
            🥺
          </span>
          <p className="font-body-md text-body-md text-on-surface">
            Delete <strong className="font-semibold">{note.title}</strong>?
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="rounded-full bg-surface-container-high px-4 py-2 font-body-sm text-body-sm font-semibold text-on-surface transition-colors hover:bg-surface-container"
            >
              Keep it
            </button>
            <button
              type="button"
              onClick={() => deleteNote(note.id)}
              className="rounded-full bg-error-container px-4 py-2 font-body-sm text-body-sm font-semibold text-on-error-container transition-colors hover:bg-error hover:text-on-error"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </Card>
  );
}

/** Dashed "start a new note" tile that sits first in the grid. */
export function NewNoteCard({ topicId }: { topicId?: string }) {
  const href = topicId ? `/notes/new?topic=${topicId}` : "/notes/new";

  return (
    <Link
      href={href}
      className="group flex min-h-[220px] flex-col items-center justify-center gap-2 rounded-[24px] border-2 border-dashed border-primary-container bg-surface-container-low/60 p-space-lg text-center transition-all duration-300 hover:-translate-y-1 hover:bg-primary-fixed"
    >
      <span
        className="text-3xl transition-transform duration-300 group-hover:scale-110"
        aria-hidden
      >
        🎀
      </span>
      <span className="font-headline-md text-[16px] font-bold text-on-surface">
        + Write a New Note
      </span>
      <span className="max-w-[220px] font-body-sm text-body-sm text-on-surface-variant">
        Start a fresh page and write down what you learned today.
      </span>
    </Link>
  );
}

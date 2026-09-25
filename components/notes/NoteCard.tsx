"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, Globe, Lock, PencilLine, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge, VisibilityBadge } from "@/components/ui/badge";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useNotes } from "@/lib/notes-store";
import { useToast } from "@/lib/toast";
import { preview, readMinutes } from "@/lib/note-view";
import type { Note } from "@/lib/types";
import { formatRelative } from "@/lib/utils";

/** Note tile with a working visibility toggle and delete confirmation. */
export function NoteCard({ note }: { note: Note }) {
  const { deleteNote, setVisibility } = useNotes();
  const toast = useToast();
  const [confirming, setConfirming] = useState(false);
  const [busy, setBusy] = useState(false);

  const isPublic = note.visibility === "public";

  async function toggleVisibility() {
    setBusy(true);
    const updated = await setVisibility(note.id, isPublic ? "private" : "public");
    setBusy(false);

    if (updated) {
      toast.success(
        updated.visibility === "public"
          ? "🌎 Shared to the community"
          : "🔒 Back to private",
      );
    } else {
      toast.error("Could not change visibility.");
    }
  }

  async function confirmDelete() {
    setConfirming(false);
    const ok = await deleteNote(note.id);
    toast[ok ? "success" : "error"](
      ok ? "Note deleted" : "Could not delete that note.",
    );
  }

  return (
    <>
      <Card hoverable className="group flex flex-col gap-space-md">
        <div className="flex items-start justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-container-low text-[18px]">
              <span aria-hidden>{note.emoji}</span>
            </span>
            <div className="min-w-0">
              <h3 className="truncate font-headline-md text-[16px] font-bold text-on-surface">
                {note.title}
              </h3>
              <p className="truncate font-label-badge text-label-badge uppercase tracking-wider text-on-surface-variant">
                {note.category}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={toggleVisibility}
            disabled={busy}
            title={isPublic ? "Make private" : "Share publicly"}
            className="shrink-0 transition-transform active:scale-95 disabled:opacity-50"
          >
            <VisibilityBadge visibility={note.visibility} />
          </button>
        </div>

        <p className="line-clamp-3 font-body-sm text-body-sm leading-relaxed text-on-surface-variant">
          {preview(note) || "No content yet — open it and start writing."}
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

        <div className="flex flex-wrap items-center justify-between gap-2 font-body-sm text-body-sm text-on-surface-variant">
          <span>🕰️ {formatRelative(note.updatedAt)}</span>
          <span>☕ {readMinutes(note)} min read</span>
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
      </Card>

      <ConfirmDialog
        open={confirming}
        title={`Delete "${note.title}"?`}
        description="This cannot be undone."
        onConfirm={confirmDelete}
        onCancel={() => setConfirming(false)}
      />
    </>
  );
}

/** Dashed "write a new note" tile. */
export function NewNoteCard({ category }: { category?: string }) {
  const href = category && category !== "all"
    ? `/notes/new?category=${encodeURIComponent(category)}`
    : "/notes/new";

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

/** Compact card used in the community feed. */
export function PublicNoteCard({
  note,
}: {
  note: Omit<Note, "userId">;
}) {
  return (
    <Link
      href={`/community/${note.id}`}
      className="group flex flex-col gap-space-sm rounded-[24px] bg-surface-container-lowest p-space-lg shadow-cozy transition-all duration-300 hover:-translate-y-1 hover:shadow-float"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-container-low text-[18px]">
          <span aria-hidden>{note.emoji}</span>
        </span>
        <Badge tone="lavender">
          <Globe className="h-3 w-3" /> Public
        </Badge>
      </div>

      <div className="min-w-0">
        <h3 className="line-clamp-2 font-headline-md text-[16px] font-bold leading-snug text-on-surface">
          {note.title}
        </h3>
        <p className="mt-0.5 font-label-badge text-label-badge uppercase tracking-wider text-on-surface-variant">
          {note.category}
        </p>
      </div>

      <p className="line-clamp-3 font-body-sm text-body-sm leading-relaxed text-on-surface-variant">
        {preview(note)}
      </p>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-2 border-t border-outline-variant/40 pt-space-sm font-body-sm text-body-sm text-on-surface-variant">
        <span className="flex min-w-0 items-center gap-1.5">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary font-label-badge text-label-badge text-on-primary">
            {note.authorName.slice(0, 1).toUpperCase()}
          </span>
          <span className="truncate">{note.authorName}</span>
        </span>
        <span className="shrink-0">{formatRelative(note.createdAt)}</span>
      </div>
    </Link>
  );
}

export { Lock };

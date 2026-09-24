"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight } from "lucide-react";
import { Badge, VisibilityBadge } from "@/components/ui/badge";
import { InsetBox } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatCard } from "@/components/ui/stat-card";
import { useNotes } from "@/lib/notes-store";
import { formatRelative } from "@/lib/utils";

/** Most recently updated notes, straight from the store. */
function useRecentNotes(count = 4) {
  const { notes } = useNotes();
  return useMemo(
    () =>
      [...notes]
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        )
        .slice(0, count),
    [notes, count],
  );
}

/** Live "Notes Saved" tile for the dashboard stat row. */
export function NotesCountStat() {
  const { notes, topics } = useNotes();
  const activeTopics = topics.filter((t) => t.noteCount > 0).length;

  return (
    <StatCard
      emoji="📝"
      label="Notes Saved"
      value={notes.length}
      caption={`${activeTopics} topic${activeTopics === 1 ? "" : "s"} in use`}
    />
  );
}

/** Live detail block inside the "My Notes" module card. */
export function NotesModuleInset() {
  const { notes, topics } = useNotes();
  const [latest] = useRecentNotes(1);
  const activeTopics = topics.filter((t) => t.noteCount > 0).length;

  return (
    <InsetBox className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant">
        <span className="font-medium text-on-surface">
          {notes.length} Notes saved
        </span>
        <Badge tone="neutral">{activeTopics} Topics active</Badge>
      </div>
      <div className="flex items-start gap-1.5 pt-1 font-body-sm text-body-sm text-on-surface">
        <span className="text-tertiary" aria-hidden>
          📌
        </span>
        <span className="truncate">
          {latest ? (
            <>
              Recent: <strong className="font-semibold">{latest.title}</strong>
            </>
          ) : (
            "No notes yet — write your first one!"
          )}
        </span>
      </div>
    </InsetBox>
  );
}

/** Recent notes strip on the dashboard. */
export function RecentNotesSection() {
  const recent = useRecentNotes(4);

  return (
    <section className="flex flex-col gap-space-lg">
      <SectionHeading
        eyebrow="Straight from your notebook"
        title="Recent Notes"
        size="md"
        aside={
          <Link
            href="/notes"
            className="inline-flex items-center gap-1 rounded-full bg-surface-container-low px-3 py-1.5 font-body-sm text-body-sm font-semibold text-on-surface-variant transition-colors hover:text-primary"
          >
            Browse all notes <ArrowRight className="h-4 w-4" />
          </Link>
        }
      />

      {recent.length === 0 ? (
        <Link
          href="/notes/new"
          className="flex flex-col items-center gap-2 rounded-[24px] border-2 border-dashed border-primary-container bg-surface-container-low/60 p-space-xl text-center transition-all hover:bg-primary-fixed"
        >
          <span className="text-3xl" aria-hidden>
            🎀
          </span>
          <span className="font-headline-md text-[16px] font-bold text-on-surface">
            Your notebook is empty
          </span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            Write your first note and the bears will take it from there.
          </span>
        </Link>
      ) : (
        <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2 xl:grid-cols-4">
          {recent.map((note) => (
            <Link
              key={note.id}
              href={`/notes/${note.id}`}
              className="group flex flex-col gap-2 rounded-[22px] bg-surface-container-lowest p-space-md shadow-cozy transition-all duration-300 hover:-translate-y-1 hover:shadow-float"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xl" aria-hidden>
                  {note.emoji}
                </span>
                <VisibilityBadge visibility={note.visibility} />
              </div>
              <h3 className="font-headline-md text-[15px] font-bold leading-snug text-on-surface">
                {note.title}
              </h3>
              <p className="line-clamp-2 font-body-sm text-body-sm text-on-surface-variant">
                {note.preview}
              </p>
              <div className="mt-auto flex items-center justify-between pt-2 font-label-badge text-label-badge text-on-surface-variant">
                <span className="truncate">{note.topic}</span>
                <span className="shrink-0">{formatRelative(note.updatedAt)}</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}

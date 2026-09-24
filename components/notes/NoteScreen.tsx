"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeading } from "@/components/ui/section-heading";
import { Badge, VisibilityBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BearMascot } from "@/components/bears/BearMascot";
import { NoteEditor } from "./NoteEditor";
import { useNotes } from "@/lib/notes-store";
import { formatRelative } from "@/lib/utils";

/** Editor screen for one stored note. */
export function NoteScreen({ id }: { id: string }) {
  const { getNote, hydrated } = useNotes();
  const note = getNote(id);

  // Before storage is read, a missing note may simply not be loaded yet.
  if (!note && !hydrated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <BearMascot variant="grizzly" size={88} animated />
          <p className="font-body-md text-body-md text-on-surface-variant">
            Fetching your note…
          </p>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="flex flex-col items-center gap-space-md rounded-[28px] bg-surface-container-lowest p-space-xl text-center shadow-cozy">
        <BearMascot variant="polar" size={120} animated />
        <h1 className="font-headline-md text-headline-md font-bold text-on-surface">
          This note is gone
        </h1>
        <p className="max-w-md font-body-md text-body-md text-on-surface-variant">
          It was either deleted, or it lives in a different browser — notes are
          stored locally for now.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Button variant="primary" href="/notes">
            Back to all notes
          </Button>
          <Button variant="outline" href="/notes/new">
            Write a new one
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-space-md">
        <Link
          href="/notes"
          className="inline-flex w-fit items-center gap-1.5 rounded-full bg-surface-container-low px-3 py-1.5 font-body-sm text-body-sm font-semibold text-on-surface-variant transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Back to all notes
        </Link>

        <PageHeading
          title={
            <>
              <span aria-hidden>✏️</span> What did I learn today?
            </>
          }
          subtitle="Write it in your own words — Panda will use these notes to tutor and quiz you later."
          badges={
            <>
              <Badge tone="blush" size="md">
                <span aria-hidden>{note.emoji}</span> {note.topic}
              </Badge>
              <VisibilityBadge visibility={note.visibility} />
              <Badge tone="outline" size="md">
                Updated {formatRelative(note.updatedAt)}
              </Badge>
            </>
          }
        />
      </div>

      <NoteEditor key={note.id} note={note} />
    </>
  );
}

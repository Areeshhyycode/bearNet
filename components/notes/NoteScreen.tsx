"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageHeading } from "@/components/ui/section-heading";
import { Badge, VisibilityBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BearMascot } from "@/components/bears/BearMascot";
import { NoteEditor } from "./NoteEditor";
import { useNotes } from "@/lib/notes-store";
import { formatRelative } from "@/lib/utils";

export function NoteScreen({ id }: { id: string }) {
  const { getNote, loading } = useNotes();
  const note = getNote(id);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-space-lg lg:grid-cols-12">
        <div className="space-y-space-md lg:col-span-8">
          <Skeleton className="h-10 w-2/3 rounded-2xl" />
          <Skeleton className="h-12 w-full rounded-full" />
          <Skeleton className="h-[320px] w-full rounded-[20px]" />
        </div>
        <div className="space-y-space-md lg:col-span-4">
          <Skeleton className="h-64 w-full rounded-[24px]" />
          <Skeleton className="h-44 w-full rounded-[24px]" />
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="flex flex-col items-center gap-space-md rounded-[28px] bg-surface-container-lowest p-space-xl text-center shadow-cozy">
        <BearMascot variant="polar" size={110} animated />
        <h1 className="font-headline-md text-headline-md font-bold text-on-surface">
          This note is not here
        </h1>
        <p className="max-w-md font-body-md text-body-md text-on-surface-variant">
          It was deleted, or it belongs to another account. Notes are private to
          whoever wrote them.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Button variant="primary" href="/notes">
            Back to my notes
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
          subtitle="Write it in your own words — Panda uses these notes to tutor and quiz you."
          badges={
            <>
              <Badge tone="blush" size="md">
                <span aria-hidden>{note.emoji}</span> {note.category}
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

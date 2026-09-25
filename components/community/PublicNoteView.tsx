"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Globe } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { BearMascot } from "@/components/bears/BearMascot";
import { paragraphs, readMinutes } from "@/lib/note-view";
import type { PublicNote } from "@/lib/types";
import { formatRelative } from "@/lib/utils";

/** Read-only view of somebody else's public note. */
export function PublicNoteView({ id }: { id: string }) {
  const [note, setNote] = useState<PublicNote | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const response = await fetch(`/api/notes/public/${id}`, {
          cache: "no-store",
        });
        const data = await response.json();

        if (cancelled) return;
        if (!response.ok) {
          setError(data?.error ?? "Could not load this note.");
        } else {
          setNote(data.note);
        }
      } catch {
        if (!cancelled) setError("Could not reach the server.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-space-md">
        <Skeleton className="h-9 w-40 rounded-full" />
        <Skeleton className="h-12 w-2/3 rounded-2xl" />
        <Skeleton className="h-64 w-full rounded-[24px]" />
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="flex flex-col items-center gap-space-md rounded-[28px] bg-surface-container-lowest p-space-xl text-center shadow-cozy">
        <BearMascot variant="polar" size={110} animated />
        <h1 className="font-headline-md text-headline-md font-bold text-on-surface">
          Not available
        </h1>
        <p className="max-w-md font-body-md text-body-md text-on-surface-variant">
          {error ?? "That note is private, or it no longer exists."}
        </p>
        <Button variant="primary" href="/community">
          Back to community notes
        </Button>
      </div>
    );
  }

  const body = paragraphs(note);

  return (
    <>
      <Link
        href="/community"
        className="inline-flex w-fit items-center gap-1.5 rounded-full bg-surface-container-low px-3 py-1.5 font-body-sm text-body-sm font-semibold text-on-surface-variant transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" /> Back to community
      </Link>

      <article className="rounded-[28px] bg-surface-container-lowest p-space-md shadow-cozy sm:p-space-xl">
        <header className="flex flex-col gap-space-md border-b border-outline-variant/40 pb-space-lg">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="lavender" size="md">
              <Globe className="h-3 w-3" /> Public note
            </Badge>
            <Badge tone="blush" size="md">
              <span aria-hidden>{note.emoji}</span> {note.category}
            </Badge>
            <Badge tone="outline" size="md">
              ☕ {readMinutes(note)} min read
            </Badge>
          </div>

          <h1 className="font-headline-lg text-headline-lg font-bold leading-tight text-on-surface sm:font-headline-xl sm:text-headline-xl">
            {note.title}
          </h1>

          <div className="flex flex-wrap items-center gap-3">
            <span className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-body-sm text-body-sm font-bold text-on-primary">
                {note.authorName.slice(0, 1).toUpperCase()}
              </span>
              <span className="font-body-md text-body-md font-semibold text-on-surface">
                {note.authorName}
              </span>
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Published {formatRelative(note.createdAt)}
              {note.updatedAt !== note.createdAt &&
                ` · updated ${formatRelative(note.updatedAt)}`}
            </span>
          </div>

          {note.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {note.tags.map((tag) => (
                <Badge key={tag} tone="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </header>

        <div className="space-y-space-md pt-space-lg">
          {body.length === 0 ? (
            <p className="font-body-md text-body-md text-on-surface-variant">
              This note has no content yet.
            </p>
          ) : (
            body.map((para, index) => (
              <p
                key={index}
                className="whitespace-pre-wrap font-body-lg text-body-lg leading-relaxed text-on-surface"
              >
                {para}
              </p>
            ))
          )}
        </div>
      </article>

      <div className="flex flex-wrap justify-center gap-2">
        <Button variant="outline" href="/community">
          Browse more notes
        </Button>
        <Button variant="primary" href="/notes/new">
          ✏️ Write your own
        </Button>
      </div>
    </>
  );
}

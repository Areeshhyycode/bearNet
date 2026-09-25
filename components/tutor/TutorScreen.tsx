"use client";

import Link from "next/link";
import { useMemo } from "react";
import { PageHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { BearMascot } from "@/components/bears/BearMascot";
import { ChatPanel } from "./ChatPanel";
import { useNotes } from "@/lib/notes-store";

const SUGGESTIONS_WITH_NOTES = [
  "Summarize my notes in five bullet points",
  "Quiz me on my weakest topic",
  "Give me a real-world example from my latest note",
];

const SUGGESTIONS_EMPTY = [
  "Explain the OSI model like I'm five",
  "What is the difference between TCP and UDP?",
  "How do I subnet a /24 into four networks?",
];

export function TutorScreen() {
  const { notes, categories } = useNotes();

  const recent = useMemo(
    () =>
      [...notes]
        .sort(
          (a, b) =>
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
        )
        .slice(0, 5),
    [notes],
  );

  const activeTopics = categories.filter((t) => t.noteCount > 0).length;

  return (
    <>
      <PageHeading
        title={
          <>
            <span aria-hidden>🐼</span> My AI Study Buddy
          </>
        }
        subtitle="Ask me anything from your notes."
        badges={
          <>
            <Badge tone="blush" size="md">
              <span className="h-2 w-2 animate-pulse rounded-full bg-tertiary" />
              Panda is online
            </Badge>
            <Badge tone="neutral" size="md">
              {notes.length === 0
                ? "No notes in context yet"
                : `${notes.length} note${notes.length === 1 ? "" : "s"} · ${activeTopics} topic${activeTopics === 1 ? "" : "s"} in context`}
            </Badge>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-space-lg lg:grid-cols-12">
        <div className="lg:col-span-8">
          <ChatPanel />
        </div>

        <div className="flex flex-col gap-space-lg lg:col-span-4">
          <div className="flex flex-col items-center gap-2 rounded-[28px] bg-surface-container-lowest p-space-lg text-center shadow-cozy">
            <BearMascot variant="panda" size={104} animated />
            <h2 className="font-headline-md text-[17px] font-bold text-on-surface">
              Panda
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Patient, a little sleepy, and very good at explaining subnet masks
              twice without sighing.
            </p>
            <div className="mt-1 flex flex-wrap justify-center gap-1.5">
              <Badge tone="lavender">Reads your notes</Badge>
              <Badge tone="blush">Says which note it used</Badge>
            </div>
          </div>

          <div className="flex flex-col gap-space-sm rounded-[28px] bg-surface-container-low p-space-lg">
            <h3 className="font-headline-md text-[15px] font-bold text-on-surface">
              📚 Notes in this session
            </h3>

            {recent.length === 0 ? (
              <>
                <p className="font-body-sm text-body-sm text-on-surface-variant">
                  Panda has nothing of yours to read yet. Write a note and the
                  answers become personal to you.
                </p>
                <Link
                  href="/notes/new"
                  className="mt-1 rounded-full bg-primary-container px-3 py-2 text-center font-body-sm text-body-sm font-semibold text-on-primary-container transition-all hover:bg-primary-fixed-dim"
                >
                  ✏️ Write my first note
                </Link>
              </>
            ) : (
              <>
                <ul className="flex flex-col gap-1.5">
                  {recent.map((note) => (
                    <li key={note.id}>
                      <Link
                        href={`/notes/${note.id}`}
                        className="flex items-center gap-2 rounded-xl bg-surface-container-lowest px-3 py-2 font-body-sm text-body-sm text-on-surface-variant shadow-sm transition-all hover:-translate-y-0.5 hover:text-primary"
                      >
                        <span aria-hidden>{note.emoji}</span>
                        <span className="truncate">{note.title}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/notes"
                  className="mt-1 rounded-full bg-surface-container-high px-3 py-2 text-center font-body-sm text-body-sm font-semibold text-on-surface transition-all hover:bg-primary-container hover:text-on-primary-container"
                >
                  Manage note context
                </Link>
              </>
            )}
          </div>

          <div className="flex flex-col gap-2 rounded-[28px] bg-primary-fixed p-space-lg">
            <h3 className="font-headline-md text-[15px] font-bold text-on-primary-fixed">
              ✨ Try asking
            </h3>
            {(notes.length > 0 ? SUGGESTIONS_WITH_NOTES : SUGGESTIONS_EMPTY).map(
              (prompt) => (
                <span
                  key={prompt}
                  className="rounded-2xl bg-surface-container-lowest/80 px-3 py-2 text-left font-body-sm text-body-sm text-on-surface"
                >
                  &ldquo;{prompt}&rdquo;
                </span>
              ),
            )}
          </div>
        </div>
      </div>
    </>
  );
}

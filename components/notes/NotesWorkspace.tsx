"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeading } from "@/components/ui/section-heading";
import { NoteGridSkeleton } from "@/components/ui/skeleton";
import { CategorySidebar } from "./CategorySidebar";
import { NewNoteCard, NoteCard } from "./NoteCard";
import { BearMascot } from "@/components/bears/BearMascot";
import { useNotes } from "@/lib/notes-store";
import { preview } from "@/lib/note-view";
import { cn } from "@/lib/utils";

type Filter = "all" | "private" | "public";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "private", label: "🔒 Private" },
  { id: "public", label: "🌎 Public" },
];

export function NotesWorkspace() {
  const { notes, categories, loading, error } = useNotes();
  const [category, setCategory] = useState("all");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return notes
      .filter((note) => (category === "all" ? true : note.category === category))
      .filter((note) => (filter === "all" ? true : note.visibility === filter))
      .filter((note) => {
        if (!needle) return true;
        return (
          note.title.toLowerCase().includes(needle) ||
          note.content.toLowerCase().includes(needle) ||
          note.category.toLowerCase().includes(needle) ||
          note.tags.some((tag) => tag.toLowerCase().includes(needle))
        );
      });
  }, [notes, category, filter, query]);

  const publicCount = notes.filter((n) => n.visibility === "public").length;
  const activeShelves = categories.filter((c) => c.noteCount > 0).length;
  const activeTitle =
    category === "all" ? "All notes" : category;

  return (
    <>
      <PageHeading
        title={
          <>
            <span aria-hidden>📖</span> My Networking Notes
          </>
        }
        subtitle="Everything you have written down, shelved by topic and ready for revision."
        badges={
          <>
            <Badge tone="blush" size="md">
              <span aria-hidden>🐻</span> Grizzly keeps these tidy
            </Badge>
            <Badge tone="neutral" size="md">
              {notes.length} notes • {activeShelves} shelves • {publicCount} public
            </Badge>
          </>
        }
        actions={
          <>
            <Button variant="outline" href="/community">
              🌎 Community notes
            </Button>
            <Button variant="primary" href="/notes/new">
              + Write a New Note
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-space-lg lg:grid-cols-12">
        <CategorySidebar
          activeCategory={category}
          onCategoryChange={setCategory}
          query={query}
          onQueryChange={setQuery}
          className="lg:col-span-3 lg:sticky lg:top-[88px] lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto"
        />

        <div className="flex min-w-0 flex-col gap-space-lg lg:col-span-9">
          <div className="flex flex-wrap items-center justify-between gap-space-sm rounded-[22px] bg-surface-container-low px-space-md py-2 sm:rounded-full">
            <div className="flex flex-wrap items-center gap-1.5">
              {FILTERS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFilter(item.id)}
                  className={cn(
                    "rounded-full px-3 py-1 font-body-sm text-body-sm transition-colors",
                    filter === item.id
                      ? "bg-primary-container font-semibold text-on-primary-container shadow-sm"
                      : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
                  )}
                >
                  {item.label}
                </button>
              ))}
            </div>
            <span className="px-2 font-body-sm text-body-sm text-on-surface-variant">
              {activeTitle} • {visible.length} note{visible.length === 1 ? "" : "s"}
            </span>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-[20px] bg-error-container px-space-md py-3 font-body-sm text-body-sm text-on-error-container"
            >
              🥺 {error}
            </div>
          )}

          {loading ? (
            <NoteGridSkeleton />
          ) : notes.length === 0 ? (
            <FirstNotePrompt />
          ) : visible.length === 0 ? (
            <EmptyState
              onClear={() => {
                setQuery("");
                setFilter("all");
                setCategory("all");
              }}
            />
          ) : (
            <div className="grid grid-cols-1 gap-space-lg md:grid-cols-2 2xl:grid-cols-3">
              <NewNoteCard category={category} />
              {visible.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function FirstNotePrompt() {
  return (
    <div className="flex flex-col items-center gap-space-md rounded-[28px] bg-surface-container-lowest p-space-lg text-center shadow-cozy sm:p-space-xl">
      <div className="flex items-end gap-2">
        <BearMascot variant="grizzly" size={78} animated />
        <BearMascot variant="panda" size={62} withPlate={false} />
        <BearMascot variant="polar" size={62} withPlate={false} />
      </div>

      <div className="space-y-1">
        <h3 className="font-headline-md text-headline-md font-bold text-on-surface sm:font-headline-lg sm:text-headline-lg">
          🎀 Your notebook is brand new
        </h3>
        <p className="mx-auto max-w-md font-body-md text-body-md text-on-surface-variant">
          Nothing here yet — and that is exactly right. Write what you learned
          today and the bears take it from there.
        </p>
      </div>

      <div className="grid w-full max-w-lg grid-cols-1 gap-2 pt-1 sm:grid-cols-3">
        {[
          { emoji: "✍️", title: "Write", caption: "One thing you learned" },
          { emoji: "🐼", title: "Ask", caption: "Panda explains it back" },
          { emoji: "🧠", title: "Test", caption: "Quiz built from it" },
        ].map((step, index) => (
          <div
            key={step.title}
            className="flex flex-col items-center gap-0.5 rounded-[20px] bg-surface-container-low p-space-md"
          >
            <span className="text-xl" aria-hidden>
              {step.emoji}
            </span>
            <span className="font-body-md text-body-md font-semibold text-on-surface">
              {index + 1}. {step.title}
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              {step.caption}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap justify-center gap-2 pt-1">
        <Button variant="primary" size="lg" href="/notes/new">
          ✏️ Write my first note
        </Button>
        <Button variant="outline" href="/community">
          🌎 Browse community notes
        </Button>
      </div>
    </div>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center gap-space-md rounded-[28px] bg-surface-container-lowest p-space-lg text-center shadow-cozy sm:p-space-xl">
      <BearMascot variant="polar" size={96} animated />
      <h3 className="font-headline-md text-[17px] font-bold text-on-surface">
        Nothing matches that yet
      </h3>
      <p className="max-w-sm font-body-md text-body-md text-on-surface-variant">
        Polar searched every shelf and came back empty-pawed.
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <Button variant="secondary" onClick={onClear}>
          Clear filters
        </Button>
        <Button variant="primary" href="/notes/new">
          + New note
        </Button>
      </div>
      <Link
        href="/tutor"
        className="font-body-sm text-body-sm text-on-surface-variant underline-offset-4 hover:text-primary hover:underline"
      >
        or ask Panda about it
      </Link>
    </div>
  );
}

export { preview };

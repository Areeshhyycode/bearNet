"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PageHeading } from "@/components/ui/section-heading";
import { TopicSidebar } from "./TopicSidebar";
import { NewNoteCard, NoteCard } from "./NoteCard";
import { BearMascot } from "@/components/bears/BearMascot";
import { useNotes } from "@/lib/notes-store";
import { cn } from "@/lib/utils";

type Filter = "all" | "private" | "public";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "private", label: "🔒 Private" },
  { id: "public", label: "🌍 Public" },
];

/** Notes dashboard: live filtering over the stored notes. */
export function NotesWorkspace() {
  const { notes, topics } = useNotes();
  const [topic, setTopic] = useState("all");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return notes
      .filter((note) => (topic === "all" ? true : note.topicId === topic))
      .filter((note) => (filter === "all" ? true : note.visibility === filter))
      .filter((note) => {
        if (!needle) return true;
        return (
          note.title.toLowerCase().includes(needle) ||
          note.preview.toLowerCase().includes(needle) ||
          note.topic.toLowerCase().includes(needle) ||
          note.tags.some((tag) => tag.toLowerCase().includes(needle))
        );
      })
      .sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
  }, [notes, topic, filter, query]);

  const activeTopicTitle =
    topic === "all"
      ? "All notes"
      : (topics.find((t) => t.id === topic)?.title ?? "All notes");

  const publicCount = notes.filter((n) => n.visibility === "public").length;

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
              {notes.length} notes • {topics.length} topics • {publicCount} public
            </Badge>
          </>
        }
        actions={
          <>
            <Button variant="outline" href="/tutor">
              🐼 Ask Panda about a note
            </Button>
            <Button variant="primary" href="/notes/new">
              + Write a New Note
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-space-lg lg:grid-cols-12">
      <TopicSidebar
        activeTopic={topic}
        onTopicChange={setTopic}
        query={query}
        onQueryChange={setQuery}
        className="lg:col-span-3 lg:sticky lg:top-[88px] lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto"
      />

      <div className="flex flex-col gap-space-lg lg:col-span-9">
        {/* Filter row */}
        <div className="flex flex-wrap items-center justify-between gap-space-sm rounded-full bg-surface-container-low px-space-md py-2">
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
            {activeTopicTitle} • {visible.length} note
            {visible.length === 1 ? "" : "s"} • sorted by ✨ recently updated
          </span>
        </div>

        {visible.length === 0 && (query || filter !== "all" || topic !== "all") ? (
          <EmptyState
            onClear={() => {
              setQuery("");
              setFilter("all");
              setTopic("all");
            }}
          />
        ) : (
          <div className="grid grid-cols-1 gap-space-lg md:grid-cols-2 2xl:grid-cols-3">
            <NewNoteCard topicId={topic === "all" ? undefined : topic} />
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

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center gap-space-md rounded-[28px] bg-surface-container-lowest p-space-xl text-center shadow-cozy">
      <BearMascot variant="polar" size={110} animated />
      <h3 className="font-headline-md text-[17px] font-bold text-on-surface">
        Nothing matches that yet
      </h3>
      <p className="max-w-sm font-body-md text-body-md text-on-surface-variant">
        Polar searched every shelf and came back empty-pawed. Try a different
        topic, or write this one yourself.
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
      <Badge tone="outline">Saved locally in this browser</Badge>
    </div>
  );
}

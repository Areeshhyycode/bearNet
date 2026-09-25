"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { PageHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { NoteGridSkeleton } from "@/components/ui/skeleton";
import { PublicNoteCard } from "@/components/notes/NoteCard";
import { BearMascot } from "@/components/bears/BearMascot";
import type { PublicNote } from "@/lib/types";
import { cn } from "@/lib/utils";

type Sort = "newest" | "oldest" | "title";

/** Browse notes other learners have deliberately made public. */
export function CommunityFeed() {
  const [notes, setNotes] = useState<PublicNote[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<Sort>("newest");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      if (category !== "all") params.set("category", category);

      const response = await fetch(`/api/notes/public?${params}`, {
        cache: "no-store",
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data?.error ?? "Could not load notes.");
      setNotes(data.notes ?? []);
      setCategories(data.categories ?? []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load notes.");
    } finally {
      setLoading(false);
    }
  }, [query, category]);

  // Debounce so typing does not fire a request per keystroke.
  useEffect(() => {
    const timeout = setTimeout(() => void load(), 300);
    return () => clearTimeout(timeout);
  }, [load]);

  const sorted = useMemo(() => {
    const copy = [...notes];
    if (sort === "title") return copy.sort((a, b) => a.title.localeCompare(b.title));
    return copy.sort((a, b) => {
      const left = new Date(a.createdAt).getTime();
      const right = new Date(b.createdAt).getTime();
      return sort === "newest" ? right - left : left - right;
    });
  }, [notes, sort]);

  return (
    <>
      <PageHeading
        title={
          <>
            <span aria-hidden>🌎</span> Community Notes
          </>
        }
        subtitle="Notes other learners chose to share. Private notes never appear here."
        badges={
          <>
            <Badge tone="lavender" size="md">
              <span aria-hidden>🐼</span> Shared by the bears&apos; study circle
            </Badge>
            <Badge tone="neutral" size="md">
              {loading ? "Loading…" : `${sorted.length} public note${sorted.length === 1 ? "" : "s"}`}
            </Badge>
          </>
        }
        actions={
          <Button variant="outline" href="/notes">
            📖 My notes
          </Button>
        }
      />

      {/* Controls */}
      <div className="flex flex-col gap-space-sm rounded-[24px] bg-surface-container-low p-space-md">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title, content, topic or author…"
            className="w-full rounded-full bg-surface-container-lowest py-2.5 pl-9 pr-3 font-body-md text-body-md text-on-surface outline-none ring-1 ring-inset ring-transparent transition-all placeholder:text-on-surface-variant/70 focus:ring-primary-container"
          />
        </div>

        <div className="flex flex-col gap-space-sm sm:flex-row sm:items-center sm:justify-between">
          {/* Category chips scroll horizontally instead of wrapping on mobile. */}
          <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 no-scrollbar">
            <Chip
              active={category === "all"}
              onClick={() => setCategory("all")}
              label="All topics"
            />
            {categories.map((name) => (
              <Chip
                key={name}
                active={category === name}
                onClick={() => setCategory(name)}
                label={name}
              />
            ))}
          </div>

          <label className="flex shrink-0 items-center gap-2 self-start sm:self-auto">
            <span className="font-label-badge text-label-badge uppercase tracking-wider text-on-surface-variant">
              Sort
            </span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as Sort)}
              className="cursor-pointer rounded-full bg-surface-container-lowest px-3 py-1.5 font-body-sm text-body-sm font-semibold text-on-surface outline-none ring-1 ring-inset ring-transparent focus:ring-primary-container"
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
              <option value="title">Title A–Z</option>
            </select>
          </label>
        </div>
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
        <NoteGridSkeleton count={6} />
      ) : sorted.length === 0 ? (
        <div className="flex flex-col items-center gap-space-md rounded-[28px] bg-surface-container-lowest p-space-xl text-center shadow-cozy">
          <BearMascot variant="panda" size={104} animated />
          <h3 className="font-headline-md text-[17px] font-bold text-on-surface">
            {query || category !== "all"
              ? "Nothing matches that yet"
              : "No public notes yet"}
          </h3>
          <p className="max-w-md font-body-md text-body-md text-on-surface-variant">
            {query || category !== "all"
              ? "Try a different search or topic."
              : "Be the first — open one of your notes and switch it to 🌎 Public."}
          </p>
          <Button variant="primary" href="/notes">
            Share one of my notes
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-space-lg sm:grid-cols-2 xl:grid-cols-3">
          {sorted.map((note) => (
            <PublicNoteCard key={note.id} note={note} />
          ))}
        </div>
      )}
    </>
  );
}

function Chip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 font-body-sm text-body-sm transition-colors",
        active
          ? "bg-primary-container font-semibold text-on-primary-container shadow-sm"
          : "bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
      )}
    >
      {label}
    </button>
  );
}

"use client";

import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { BearMascot } from "@/components/bears/BearMascot";
import { useNotes } from "@/lib/notes-store";
import { cn } from "@/lib/utils";

/** Search + category filter rail for the notes dashboard. */
export function CategorySidebar({
  activeCategory,
  onCategoryChange,
  query,
  onQueryChange,
  className,
}: {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  query: string;
  onQueryChange: (value: string) => void;
  className?: string;
}) {
  const { notes, categories } = useNotes();

  // Only show shelves that hold something, plus the one being viewed.
  const visible = categories.filter(
    (category) => category.noteCount > 0 || category.id === activeCategory,
  );

  return (
    <aside
      className={cn(
        "flex flex-col gap-space-md rounded-[24px] bg-surface-container-lowest p-space-md shadow-cozy",
        className,
      )}
    >
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
        <input
          type="search"
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Search notes…"
          className="w-full rounded-full bg-surface-container-low py-2 pl-9 pr-3 font-body-sm text-body-sm text-on-surface outline-none ring-1 ring-inset ring-transparent transition-all placeholder:text-on-surface-variant/80 focus:ring-primary-container"
        />
      </div>

      <div className="flex items-center justify-between px-1">
        <span className="flex items-center gap-1.5 font-headline-md text-[15px] font-bold text-on-surface">
          <span aria-hidden>🌐</span> My shelves
        </span>
        <span className="font-label-badge text-label-badge text-on-surface-variant">
          {notes.length} note{notes.length === 1 ? "" : "s"}
        </span>
      </div>

      <nav className="flex max-h-[42vh] flex-col gap-1 overflow-y-auto lg:max-h-none">
        <button
          type="button"
          onClick={() => onCategoryChange("all")}
          className={cn(
            "flex items-center justify-between rounded-xl px-3 py-2 text-left font-body-sm text-body-sm transition-all",
            activeCategory === "all"
              ? "bg-primary-container font-semibold text-on-primary-container shadow-sm"
              : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface",
          )}
        >
          <span className="flex items-center gap-2">
            <span aria-hidden>🎀</span> All Notes
          </span>
          <span className="font-label-badge text-label-badge">{notes.length}</span>
        </button>

        {visible.length === 0 && (
          <p className="px-3 py-2 font-body-sm text-body-sm text-on-surface-variant">
            Shelves appear here once you file your first note.
          </p>
        )}

        {visible.map((category) => {
          const selected = activeCategory === category.id;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left font-body-sm text-body-sm transition-all",
                selected
                  ? "bg-primary-container font-semibold text-on-primary-container shadow-sm"
                  : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface",
              )}
            >
              <span className="flex min-w-0 items-center gap-2">
                <span aria-hidden>{category.emoji}</span>
                <span className="truncate">{category.title}</span>
              </span>
              <span className="font-label-badge text-label-badge">
                {category.noteCount}
              </span>
            </button>
          );
        })}
      </nav>

      <Link
        href="/notes/new"
        className="flex items-center justify-center gap-2 rounded-full border-2 border-dashed border-primary-container bg-transparent px-3 py-2 font-body-sm text-body-sm font-semibold text-primary transition-all hover:bg-primary-fixed active:scale-[0.98]"
      >
        <Plus className="h-4 w-4" /> New note
      </Link>

      <div className="mt-auto hidden items-center gap-3 rounded-[20px] bg-surface-container-low p-3 lg:flex">
        <BearMascot variant="grizzly" size={44} withPlate={false} />
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          <strong className="font-semibold text-on-surface">Grizzly says:</strong>{" "}
          a note you can explain out loud is a note you actually know.
        </p>
      </div>
    </aside>
  );
}

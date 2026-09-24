"use client";

import { Plus, Search } from "lucide-react";
import { useState } from "react";
import { BearMascot } from "@/components/bears/BearMascot";
import { NOTE_TOPICS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

/**
 * Notes navigation rail. Selection is local UI state only —
 * nothing is filtered from a data source yet.
 */
export function TopicSidebar({
  className,
}: {
  className?: string;
}) {
  const [active, setActive] = useState<string>("all");

  return (
    <aside
      className={cn(
        "flex flex-col gap-space-md rounded-[24px] bg-surface-container-lowest p-space-md shadow-cozy",
        className,
      )}
    >
      {/* Search */}
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
        <input
          type="search"
          placeholder="Search notes…"
          className="w-full rounded-full bg-surface-container-low py-2 pl-9 pr-3 font-body-sm text-body-sm text-on-surface outline-none ring-1 ring-inset ring-transparent transition-all placeholder:text-on-surface-variant/80 focus:ring-primary-container"
        />
      </div>

      {/* Track header */}
      <div className="flex items-center justify-between px-1">
        <span className="flex items-center gap-1.5 font-headline-md text-[15px] font-bold text-on-surface">
          <span aria-hidden>🌐</span> Networking
        </span>
        <span className="font-label-badge text-label-badge text-on-surface-variant">
          {NOTE_TOPICS.length} topics
        </span>
      </div>

      {/* Topic list */}
      <nav className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => setActive("all")}
          className={cn(
            "flex items-center justify-between rounded-xl px-3 py-2 text-left font-body-sm text-body-sm transition-all",
            active === "all"
              ? "bg-primary-container font-semibold text-on-primary-container shadow-sm"
              : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface",
          )}
        >
          <span className="flex items-center gap-2">
            <span aria-hidden>🎀</span> All Notes
          </span>
          <span className="font-label-badge text-label-badge">24</span>
        </button>

        {NOTE_TOPICS.map((topic) => {
          const selected = active === topic.id;
          return (
            <button
              key={topic.id}
              type="button"
              onClick={() => setActive(topic.id)}
              className={cn(
                "flex items-center justify-between rounded-xl px-3 py-2 text-left font-body-sm text-body-sm transition-all",
                selected
                  ? "bg-primary-container font-semibold text-on-primary-container shadow-sm"
                  : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface",
              )}
            >
              <span className="flex min-w-0 items-center gap-2">
                <span aria-hidden>{topic.emoji}</span>
                <span className="truncate">{topic.title}</span>
              </span>
              <span className="font-label-badge text-label-badge">
                {topic.noteCount}
              </span>
            </button>
          );
        })}
      </nav>

      <button
        type="button"
        className="flex items-center justify-center gap-2 rounded-full border-2 border-dashed border-primary-container bg-transparent px-3 py-2 font-body-sm text-body-sm font-semibold text-primary transition-all hover:bg-primary-fixed active:scale-[0.98]"
      >
        <Plus className="h-4 w-4" /> Create New Topic
      </button>

      {/* Grizzly nudge */}
      <div className="mt-auto flex items-center gap-3 rounded-[20px] bg-surface-container-low p-3">
        <BearMascot variant="grizzly" size={44} withPlate={false} />
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          <strong className="font-semibold text-on-surface">Grizzly says:</strong>{" "}
          revise Subnetting — it&apos;s your softest topic this week.
        </p>
      </div>
    </aside>
  );
}

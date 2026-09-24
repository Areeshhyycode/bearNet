"use client";

import { useState } from "react";
import { Check, Plus, Search, Trash2, X } from "lucide-react";
import { BearMascot } from "@/components/bears/BearMascot";
import { useNotes } from "@/lib/notes-store";
import { cn } from "@/lib/utils";

/** Notes navigation rail — search, topic filter and topic creation. */
export function TopicSidebar({
  activeTopic,
  onTopicChange,
  query,
  onQueryChange,
  className,
}: {
  activeTopic: string;
  onTopicChange: (topicId: string) => void;
  query: string;
  onQueryChange: (value: string) => void;
  className?: string;
}) {
  const { topics, notes, addTopic, deleteTopic } = useNotes();
  const [creating, setCreating] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");

  function submitTopic() {
    const id = addTopic(draftTitle);
    setDraftTitle("");
    setCreating(false);
    if (id) onTopicChange(id);
  }

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
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
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
          {topics.length} topics
        </span>
      </div>

      {/* Topic list */}
      <nav className="flex flex-col gap-1">
        <button
          type="button"
          onClick={() => onTopicChange("all")}
          className={cn(
            "flex items-center justify-between rounded-xl px-3 py-2 text-left font-body-sm text-body-sm transition-all",
            activeTopic === "all"
              ? "bg-primary-container font-semibold text-on-primary-container shadow-sm"
              : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface",
          )}
        >
          <span className="flex items-center gap-2">
            <span aria-hidden>🎀</span> All Notes
          </span>
          <span className="font-label-badge text-label-badge">{notes.length}</span>
        </button>

        {topics.map((topic) => {
          const selected = activeTopic === topic.id;
          return (
            <div key={topic.id} className="group/topic relative">
              <button
                type="button"
                onClick={() => onTopicChange(topic.id)}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left font-body-sm text-body-sm transition-all",
                  selected
                    ? "bg-primary-container font-semibold text-on-primary-container shadow-sm"
                    : "text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface",
                )}
              >
                <span className="flex min-w-0 items-center gap-2">
                  <span aria-hidden>{topic.emoji}</span>
                  <span className="truncate">{topic.title}</span>
                </span>
                <span className="font-label-badge text-label-badge group-hover/topic:opacity-0">
                  {topic.noteCount}
                </span>
              </button>

              <button
                type="button"
                title={`Delete ${topic.title} and its notes`}
                aria-label={`Delete topic ${topic.title}`}
                onClick={() => {
                  deleteTopic(topic.id);
                  if (selected) onTopicChange("all");
                }}
                className="absolute right-2 top-1/2 hidden -translate-y-1/2 rounded-full p-1 text-on-surface-variant transition-colors hover:bg-error-container hover:text-on-error-container group-hover/topic:block"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          );
        })}
      </nav>

      {/* Create topic */}
      {creating ? (
        <div className="flex items-center gap-1.5 rounded-full bg-surface-container-low p-1 pl-3">
          <input
            autoFocus
            value={draftTitle}
            onChange={(event) => setDraftTitle(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") submitTopic();
              if (event.key === "Escape") setCreating(false);
            }}
            placeholder="Topic name…"
            className="min-w-0 flex-1 bg-transparent font-body-sm text-body-sm text-on-surface outline-none placeholder:text-on-surface-variant/70"
          />
          <button
            type="button"
            onClick={submitTopic}
            aria-label="Add topic"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-on-primary transition-transform active:scale-95"
          >
            <Check className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setCreating(false)}
            aria-label="Cancel"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="flex items-center justify-center gap-2 rounded-full border-2 border-dashed border-primary-container bg-transparent px-3 py-2 font-body-sm text-body-sm font-semibold text-primary transition-all hover:bg-primary-fixed active:scale-[0.98]"
        >
          <Plus className="h-4 w-4" /> Create New Topic
        </button>
      )}

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

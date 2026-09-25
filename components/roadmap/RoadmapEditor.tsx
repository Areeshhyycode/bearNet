"use client";

import { useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronUp,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ProgressBar } from "@/components/ui/progress";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { ListSkeleton } from "@/components/ui/skeleton";
import { useRoadmap } from "@/lib/roadmap-store";
import { useToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

/** The learner's own roadmap: add, edit, complete, reorder, delete. */
export function RoadmapEditor() {
  const { roadmap, loading, busy, addItem, updateItem, deleteItem, moveItem } =
    useRoadmap();
  const toast = useToast();

  const [adding, setAdding] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftDescription, setDraftDescription] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [pendingDelete, setPendingDelete] = useState<string | null>(null);

  const items = roadmap?.items ?? [];
  const done = items.filter((item) => item.completed).length;
  const percent = items.length === 0 ? 0 : Math.round((done / items.length) * 100);

  async function submitNew() {
    if (!draftTitle.trim()) return;
    await addItem(draftTitle, draftDescription);
    setDraftTitle("");
    setDraftDescription("");
    setAdding(false);
    toast.success("🌱 Step added to your roadmap");
  }

  async function submitEdit(itemId: string) {
    if (!editTitle.trim()) return;
    await updateItem(itemId, { title: editTitle });
    setEditingId(null);
    toast.success("Roadmap updated");
  }

  async function confirmDelete() {
    if (!pendingDelete) return;
    const id = pendingDelete;
    setPendingDelete(null);
    await deleteItem(id);
    toast.success("Step removed");
  }

  return (
    <>
      <section className="flex flex-col gap-space-lg rounded-[28px] bg-surface-container-lowest p-space-md shadow-cozy sm:p-space-xl">
        <div className="flex flex-col items-start justify-between gap-space-sm sm:flex-row sm:items-center">
          <div className="min-w-0">
            <span className="font-label-badge text-label-badge font-bold uppercase tracking-wider text-tertiary">
              🌷 Roadmap
            </span>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
              Active Learning Journey
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="neutral" size="md">
              {done}/{items.length} completed
            </Badge>
            <button
              type="button"
              onClick={() => setAdding((v) => !v)}
              className="inline-flex items-center gap-1.5 rounded-full bg-primary-container px-4 py-2 font-body-sm text-body-sm font-semibold text-on-primary-container shadow-sm transition-all hover:bg-primary-fixed-dim active:scale-95"
            >
              <Plus className="h-4 w-4" /> Add Roadmap
            </button>
          </div>
        </div>

        {items.length > 0 && <ProgressBar value={percent} label="Roadmap progress" />}

        {/* New step form */}
        {adding && (
          <div className="animate-fade-up flex flex-col gap-2 rounded-[20px] bg-surface-container-low p-space-md">
            <input
              autoFocus
              value={draftTitle}
              onChange={(event) => setDraftTitle(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") void submitNew();
                if (event.key === "Escape") setAdding(false);
              }}
              placeholder="What do you want to learn? e.g. Web Security"
              className="w-full rounded-full bg-surface-container-lowest px-4 py-2.5 font-body-md text-body-md text-on-surface outline-none ring-1 ring-inset ring-transparent focus:ring-primary-container"
            />
            <input
              value={draftDescription}
              onChange={(event) => setDraftDescription(event.target.value)}
              placeholder="A short note about this step (optional)"
              className="w-full rounded-full bg-surface-container-lowest px-4 py-2 font-body-sm text-body-sm text-on-surface outline-none ring-1 ring-inset ring-transparent focus:ring-primary-container"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setAdding(false)}
                className="rounded-full bg-surface-container-high px-4 py-2 font-body-sm text-body-sm font-semibold text-on-surface"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submitNew}
                disabled={!draftTitle.trim() || busy}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 font-body-sm text-body-sm font-semibold text-on-primary disabled:opacity-50"
              >
                {busy && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Add step
              </button>
            </div>
          </div>
        )}

        {/* Items */}
        {loading ? (
          <ListSkeleton rows={4} />
        ) : items.length === 0 ? (
          <div className="rounded-[20px] bg-surface-container-low p-space-lg text-center">
            <span className="text-2xl" aria-hidden>
              🌱
            </span>
            <p className="mt-1 font-body-md text-body-md text-on-surface-variant">
              Your roadmap is empty. Add the first thing you want to learn.
            </p>
          </div>
        ) : (
          <ol className="flex flex-col">
            {items.map((item, index) => (
              <li key={item.id} className="flex gap-space-sm sm:gap-space-md">
                {/* Rail */}
                <div className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() =>
                      updateItem(item.id, { completed: !item.completed })
                    }
                    aria-label={
                      item.completed ? "Mark as not done" : "Mark as completed"
                    }
                    className={cn(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-lg transition-all active:scale-95 sm:h-12 sm:w-12",
                      item.completed
                        ? "bg-primary text-on-primary shadow-sm"
                        : "bg-surface-container-high text-on-surface-variant hover:bg-primary-fixed",
                    )}
                  >
                    {item.completed ? (
                      <Check className="h-5 w-5" strokeWidth={3} />
                    ) : (
                      <span className="font-body-sm text-body-sm font-bold">
                        {index + 1}
                      </span>
                    )}
                  </button>
                  {index < items.length - 1 && (
                    <div
                      className={cn(
                        "my-1 w-1 flex-1 rounded-full",
                        item.completed ? "bg-primary-fixed-dim" : "bg-surface-container",
                      )}
                    />
                  )}
                </div>

                {/* Body */}
                <div
                  className={cn(
                    "mb-space-sm min-w-0 flex-1 rounded-[20px] p-space-md transition-colors",
                    item.completed
                      ? "bg-surface-container-low"
                      : "bg-primary-fixed/50",
                  )}
                >
                  {editingId === item.id ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <input
                        autoFocus
                        value={editTitle}
                        onChange={(event) => setEditTitle(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") void submitEdit(item.id);
                          if (event.key === "Escape") setEditingId(null);
                        }}
                        className="min-w-0 flex-1 rounded-full bg-surface-container-lowest px-3 py-1.5 font-body-md text-body-md text-on-surface outline-none ring-1 ring-inset ring-primary-container"
                      />
                      <button
                        type="button"
                        onClick={() => submitEdit(item.id)}
                        aria-label="Save"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-on-primary"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingId(null)}
                        aria-label="Cancel"
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <h3
                          className={cn(
                            "font-headline-md text-[16px] font-bold text-on-surface",
                            item.completed && "line-through opacity-60",
                          )}
                        >
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="mt-0.5 font-body-sm text-body-sm text-on-surface-variant">
                            {item.description}
                          </p>
                        )}
                      </div>

                      {/* Row actions */}
                      <div className="flex shrink-0 items-center gap-0.5">
                        <button
                          type="button"
                          onClick={() => moveItem(item.id, "up")}
                          disabled={index === 0 || busy}
                          aria-label="Move up"
                          className="flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-lowest hover:text-primary disabled:opacity-30"
                        >
                          <ChevronUp className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveItem(item.id, "down")}
                          disabled={index === items.length - 1 || busy}
                          aria-label="Move down"
                          className="flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-lowest hover:text-primary disabled:opacity-30"
                        >
                          <ChevronDown className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(item.id);
                            setEditTitle(item.title);
                          }}
                          aria-label={`Edit ${item.title}`}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-lowest hover:text-primary"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setPendingDelete(item.id)}
                          aria-label={`Delete ${item.title}`}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-error-container hover:text-on-error-container"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      <ConfirmDialog
        open={pendingDelete !== null}
        title="Remove this step?"
        description="You can always add it back later."
        confirmLabel="Remove"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </>
  );
}

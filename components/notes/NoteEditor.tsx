"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Bold,
  Code2,
  Heading1,
  ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Loader2,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/field";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { BearMascot } from "@/components/bears/BearMascot";
import { useNotes } from "@/lib/notes-store";
import { XP, useProgress } from "@/lib/progress-store";
import { useToast } from "@/lib/toast";
import { NOTE_CATEGORIES, type Note, type Visibility } from "@/lib/types";
import { cn } from "@/lib/utils";

const TOOLBAR = [
  { icon: Heading1, label: "Heading", wrap: ["## ", ""], placeholder: "Heading" },
  { icon: Bold, label: "Bold", wrap: ["**", "**"], placeholder: "bold text" },
  { icon: Italic, label: "Italic", wrap: ["_", "_"], placeholder: "italic text" },
  { icon: List, label: "Bullet list", wrap: ["- ", ""], placeholder: "list item" },
  { icon: ListOrdered, label: "Numbered list", wrap: ["1. ", ""], placeholder: "first item" },
  { icon: Code2, label: "Code", wrap: ["`", "`"], placeholder: "ping 8.8.8.8" },
  { icon: Link2, label: "Link", wrap: ["[", "](https://)"], placeholder: "link text" },
  { icon: ImageIcon, label: "Image", wrap: ["![", "](https://)"], placeholder: "alt text" },
] as const;

const PLACEHOLDER = `Start writing…

## What I learned
- The three-way handshake is SYN → SYN-ACK → ACK
- Routers forward using IP addresses at layer 3

## Why it matters
Write it in your own words — that's what makes it stick. 🎀`;

export function NoteEditor({
  note,
  initialCategory,
}: {
  note?: Note;
  initialCategory?: string;
}) {
  const router = useRouter();
  const { saveNote, deleteNote } = useNotes();
  const { recordNoteSaved } = useProgress();
  const toast = useToast();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [title, setTitle] = useState(note?.title ?? "");
  const [category, setCategory] = useState(
    note?.category ?? initialCategory ?? NOTE_CATEGORIES[0],
  );
  const [customCategory, setCustomCategory] = useState("");
  const [content, setContent] = useState(note?.content ?? "");
  const [visibility, setVisibility] = useState<Visibility>(
    note?.visibility ?? "private",
  );
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const words = content.trim() ? content.trim().split(/\s+/).length : 0;
  const canSave = title.trim().length > 0 || content.trim().length > 0;
  const usingCustom = category === "__custom__";
  const effectiveCategory = usingCustom ? customCategory.trim() : category;

  function applyFormat(wrap: readonly [string, string], placeholder: string) {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = content.slice(start, end) || placeholder;
    const [before, after] = wrap;

    setContent(
      content.slice(0, start) + before + selected + after + content.slice(end),
    );
    setDirty(true);

    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(
        start + before.length,
        start + before.length + selected.length,
      );
    });
  }

  async function handleSave() {
    if (!canSave || saving) return;

    setSaving(true);
    const saved = await saveNote({
      id: note?.id,
      title,
      content,
      category: effectiveCategory || "Other",
      visibility,
      tags: note?.tags,
    });
    setSaving(false);

    if (!saved) {
      toast.error("Could not save the note.");
      return;
    }

    setDirty(false);

    if (!note?.id) {
      recordNoteSaved();
      toast.success(`🎀 Note saved · +${XP.noteSaved} XP`);
      router.replace(`/notes/${saved.id}`);
    } else {
      toast.success("🎀 Changes saved");
    }
  }

  async function handleDelete() {
    if (!note) return;
    setConfirmingDelete(false);
    const ok = await deleteNote(note.id);
    toast[ok ? "success" : "error"](ok ? "Note deleted" : "Could not delete.");
    if (ok) router.push("/notes");
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-space-lg lg:grid-cols-12">
        {/* Editor */}
        <div className="flex min-w-0 flex-col gap-space-md rounded-[28px] bg-surface-container-lowest p-space-md shadow-cozy sm:p-space-lg lg:col-span-8">
          <Input
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              setDirty(true);
            }}
            placeholder="Give this note a name…"
            className="border-0 bg-transparent px-0 font-headline-md text-headline-md font-bold text-on-surface ring-0 placeholder:text-on-surface-variant/50 focus:ring-0 sm:font-headline-lg sm:text-headline-lg"
          />

          {/* Category picker */}
          <div className="flex flex-wrap items-center gap-2">
            <label className="flex items-center gap-2 rounded-full bg-surface-container-low py-1.5 pl-3 pr-1.5">
              <span className="font-label-badge text-label-badge font-semibold uppercase tracking-wider text-on-surface-variant">
                Topic
              </span>
              <select
                value={category}
                onChange={(event) => {
                  setCategory(event.target.value);
                  setDirty(true);
                }}
                className="max-w-[10rem] cursor-pointer truncate rounded-full bg-surface-container-lowest px-3 py-1 font-body-sm text-body-sm font-semibold text-on-surface outline-none ring-1 ring-inset ring-transparent transition-all focus:ring-primary-container"
              >
                {NOTE_CATEGORIES.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
                {note && !NOTE_CATEGORIES.includes(note.category as never) && (
                  <option value={note.category}>{note.category}</option>
                )}
                <option value="__custom__">+ New topic…</option>
              </select>
            </label>

            {usingCustom && (
              <input
                autoFocus
                value={customCategory}
                onChange={(event) => {
                  setCustomCategory(event.target.value);
                  setDirty(true);
                }}
                placeholder="Topic name…"
                className="min-w-0 flex-1 rounded-full bg-surface-container-low px-4 py-2 font-body-sm text-body-sm text-on-surface outline-none ring-1 ring-inset ring-transparent focus:ring-primary-container"
              />
            )}
          </div>

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-1 rounded-[20px] bg-surface-container-low p-1.5 sm:rounded-full">
            {TOOLBAR.map((tool) => {
              const Icon = tool.icon;
              return (
                <button
                  key={tool.label}
                  type="button"
                  title={tool.label}
                  aria-label={tool.label}
                  onClick={() => applyFormat(tool.wrap, tool.placeholder)}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant transition-all hover:bg-surface-container-lowest hover:text-primary hover:shadow-sm active:scale-95"
                >
                  <Icon className="h-4 w-4" />
                </button>
              );
            })}
            <span className="ml-auto hidden px-3 font-label-badge text-label-badge text-on-surface-variant sm:inline">
              Markdown
            </span>
          </div>

          <textarea
            ref={textareaRef}
            value={content}
            onChange={(event) => {
              setContent(event.target.value);
              setDirty(true);
            }}
            placeholder={PLACEHOLDER}
            rows={16}
            className="min-h-[320px] w-full resize-y rounded-[20px] bg-surface-container-low/60 p-space-md font-body-md text-body-md leading-relaxed text-on-surface caret-primary outline-none ring-1 ring-inset ring-transparent transition-all placeholder:whitespace-pre-line placeholder:text-on-surface-variant/60 focus:bg-surface-container-low focus:ring-primary-container sm:min-h-[420px]"
          />

          <div className="flex flex-wrap items-center justify-between gap-2 font-body-sm text-body-sm text-on-surface-variant">
            <span>
              ✍️ {words} word{words === 1 ? "" : "s"} · ☕{" "}
              {Math.max(1, Math.round(words / 200))} min read
            </span>
            <span className={cn(dirty && "font-semibold text-tertiary")}>
              {dirty ? "● Unsaved changes" : "✓ All changes saved"}
            </span>
          </div>
        </div>

        {/* Side column */}
        <div className="flex flex-col gap-space-lg lg:col-span-4">
          <div className="flex flex-col gap-space-md rounded-[24px] bg-surface-container-lowest p-space-lg shadow-cozy">
            <h3 className="font-headline-md text-[16px] font-bold text-on-surface">
              Who can see this note?
            </h3>

            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { id: "private", emoji: "🔒", label: "Private", caption: "Only me" },
                  { id: "public", emoji: "🌎", label: "Public", caption: "Shareable" },
                ] as const
              ).map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => {
                    setVisibility(option.id);
                    setDirty(true);
                  }}
                  aria-pressed={visibility === option.id}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-[20px] p-space-md transition-all active:scale-[0.98]",
                    visibility === option.id
                      ? "bg-primary-fixed shadow-soft ring-2 ring-primary-container"
                      : "bg-surface-container-low hover:bg-surface-container-high",
                  )}
                >
                  <span className="text-xl" aria-hidden>
                    {option.emoji}
                  </span>
                  <span className="font-body-md text-body-md font-semibold text-on-surface">
                    {option.label}
                  </span>
                  <span className="font-label-badge text-label-badge text-on-surface-variant">
                    {option.caption}
                  </span>
                </button>
              ))}
            </div>

            <p className="font-body-sm text-body-sm text-on-surface-variant">
              {visibility === "public"
                ? "🌎 Other signed-in learners can read this note and see your name."
                : "🔒 Only you can open this note. It never appears in the community feed."}
            </p>

            <div className="flex flex-col gap-2 pt-1">
              <Button
                variant="primary"
                block
                onClick={handleSave}
                disabled={!canSave || saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving…
                  </>
                ) : (
                  <>🎀 Save Note</>
                )}
              </Button>
              <Button variant="ghost" block href="/notes">
                Cancel
              </Button>

              {note && (
                <button
                  type="button"
                  onClick={() => setConfirmingDelete(true)}
                  className="inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 font-body-sm text-body-sm font-semibold text-on-surface-variant transition-colors hover:bg-error-container hover:text-on-error-container"
                >
                  <Trash2 className="h-4 w-4" /> Delete note
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-space-sm rounded-[24px] bg-surface-container-low p-space-lg">
            <div className="flex items-center gap-2">
              <BearMascot variant="grizzly" size={42} withPlate={false} animated />
              <div>
                <h3 className="font-headline-md text-[15px] font-bold text-on-surface">
                  Grizzly&apos;s writing tips
                </h3>
                <p className="font-label-badge text-label-badge text-on-surface-variant">
                  For notes that actually stick
                </p>
              </div>
            </div>
            <ul className="space-y-1.5 font-body-sm text-body-sm text-on-surface-variant">
              <li>🌸 Explain it like you would to a friend.</li>
              <li>🧮 Add one worked example per concept.</li>
              <li>📌 End with the one line you must remember.</li>
            </ul>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <Badge tone="blush">Markdown friendly</Badge>
              <Badge tone="lavender">Synced to your account</Badge>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmingDelete}
        title="Delete this note?"
        description="This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setConfirmingDelete(false)}
      />
    </>
  );
}

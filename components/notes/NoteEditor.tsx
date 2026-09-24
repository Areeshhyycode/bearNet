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
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/field";
import { Toast } from "@/components/ui/toast";
import { BearMascot } from "@/components/bears/BearMascot";
import { useNotes } from "@/lib/notes-store";
import type { Note } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

/** Markdown snippets each toolbar button inserts at the cursor. */
const TOOLBAR = [
  { icon: Heading1, label: "Heading", wrap: ["## ", ""], placeholder: "Heading" },
  { icon: Bold, label: "Bold", wrap: ["**", "**"], placeholder: "bold text" },
  { icon: Italic, label: "Italic", wrap: ["_", "_"], placeholder: "italic text" },
  { icon: List, label: "Bullet list", wrap: ["- ", ""], placeholder: "list item" },
  {
    icon: ListOrdered,
    label: "Numbered list",
    wrap: ["1. ", ""],
    placeholder: "first item",
  },
  { icon: Code2, label: "Code", wrap: ["`", "`"], placeholder: "ping 8.8.8.8" },
  { icon: Link2, label: "Link", wrap: ["[", "](https://)"], placeholder: "link text" },
  {
    icon: ImageIcon,
    label: "Image",
    wrap: ["![", "](https://)"],
    placeholder: "alt text",
  },
] as const;

const PLACEHOLDER = `Start writing…

## What I learned
- The three-way handshake is SYN → SYN-ACK → ACK
- Routers forward using IP addresses at layer 3

## Why it matters
Write it in your own words — that's what makes it stick. 🎀`;

export function NoteEditor({
  note,
  initialTopicId,
}: {
  note?: Note;
  initialTopicId?: string;
}) {
  const router = useRouter();
  const { topics, saveNote, deleteNote } = useNotes();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [title, setTitle] = useState(note?.title ?? "");
  const [topic, setTopic] = useState(
    note?.topicId ?? initialTopicId ?? topics[0]?.id ?? "basics",
  );
  const [body, setBody] = useState(note?.body.join("\n\n") ?? "");
  const [visibility, setVisibility] = useState<"private" | "public">(
    note?.visibility ?? "private",
  );
  const [toast, setToast] = useState<string | null>(null);
  const [dirty, setDirty] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const words = body.trim() ? body.trim().split(/\s+/).length : 0;
  const canSave = title.trim().length > 0 || body.trim().length > 0;

  /** Wrap the selection (or insert a placeholder) with markdown syntax. */
  function applyFormat(wrap: readonly [string, string], placeholder: string) {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = body.slice(start, end) || placeholder;
    const [before, after] = wrap;

    const next = body.slice(0, start) + before + selected + after + body.slice(end);
    setBody(next);
    setDirty(true);

    // Put the cursor around the inserted text.
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  }

  function handleSave() {
    const id = saveNote({
      id: note?.id,
      title,
      topicId: topic,
      body,
      visibility,
      tags: note?.tags,
    });

    setDirty(false);
    setToast(`🎀 Saved · ${new Date().toLocaleTimeString()}`);

    // A brand-new note gets its own URL so refreshing keeps working.
    if (!note?.id && id) {
      setTimeout(() => router.replace(`/notes/${id}`), 400);
    }
  }

  function handleDelete() {
    if (!note) return;
    deleteNote(note.id);
    router.push("/notes");
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-space-lg lg:grid-cols-12">
        {/* Editor column */}
        <div className="flex flex-col gap-space-md rounded-[28px] bg-surface-container-lowest p-space-md shadow-cozy sm:p-space-lg lg:col-span-8">
          <Input
            value={title}
            onChange={(event) => {
              setTitle(event.target.value);
              setDirty(true);
            }}
            placeholder="Give this note a name…"
            className="border-0 bg-transparent px-0 font-headline-lg text-headline-lg font-bold text-on-surface ring-0 placeholder:text-on-surface-variant/50 focus:ring-0"
          />

          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-1 rounded-full bg-surface-container-low p-1.5">
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

            <span className="ml-auto px-3 font-label-badge text-label-badge text-on-surface-variant">
              Markdown
            </span>
          </div>

          {/* Writing surface */}
          <textarea
            ref={textareaRef}
            value={body}
            onChange={(event) => {
              setBody(event.target.value);
              setDirty(true);
            }}
            placeholder={PLACEHOLDER}
            rows={18}
            className="min-h-[420px] w-full resize-y rounded-[20px] bg-surface-container-low/60 p-space-md font-body-md text-body-md leading-relaxed text-on-surface caret-primary outline-none ring-1 ring-inset ring-transparent transition-all placeholder:whitespace-pre-line placeholder:text-on-surface-variant/60 focus:bg-surface-container-low focus:ring-primary-container"
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
                  { id: "public", emoji: "🌍", label: "Public", caption: "Shareable" },
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

            <div className="space-y-1.5">
              <span className="font-label-badge text-label-badge font-semibold uppercase tracking-wider text-on-surface-variant">
                Topic
              </span>
              <div className="flex flex-wrap gap-1.5">
                {topics.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      setTopic(option.id);
                      setDirty(true);
                    }}
                    className={cn(
                      "rounded-full px-2.5 py-1 font-label-badge text-label-badge transition-all",
                      topic === option.id
                        ? "bg-primary text-on-primary shadow-sm"
                        : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
                    )}
                  >
                    {option.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <Button variant="primary" block onClick={handleSave} disabled={!canSave}>
                🎀 Save Note
              </Button>
              <Button variant="ghost" block href="/notes">
                Cancel
              </Button>

              {note && (
                <>
                  {confirmingDelete ? (
                    <div className="flex items-center gap-2 rounded-[18px] bg-error-container/60 p-2">
                      <span className="flex-1 px-1 font-body-sm text-body-sm text-on-error-container">
                        Delete this note?
                      </span>
                      <button
                        type="button"
                        onClick={() => setConfirmingDelete(false)}
                        className="rounded-full bg-surface-container-lowest px-3 py-1.5 font-body-sm text-body-sm font-semibold text-on-surface"
                      >
                        No
                      </button>
                      <button
                        type="button"
                        onClick={handleDelete}
                        className="rounded-full bg-error px-3 py-1.5 font-body-sm text-body-sm font-semibold text-on-error"
                      >
                        Yes
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setConfirmingDelete(true)}
                      className="inline-flex items-center justify-center gap-1.5 rounded-full px-4 py-2 font-body-sm text-body-sm font-semibold text-on-surface-variant transition-colors hover:bg-error-container hover:text-on-error-container"
                    >
                      <Trash2 className="h-4 w-4" /> Delete note
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Grizzly writing tips */}
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
              <li>🌸 Explain it like you would to a friend, not a textbook.</li>
              <li>🧮 Add one worked example per concept.</li>
              <li>🔗 Link related topics so revision flows naturally.</li>
              <li>📌 End with the one line you must remember.</li>
            </ul>
            <div className="flex flex-wrap gap-1.5 pt-1">
              <Badge tone="blush">Markdown friendly</Badge>
              <Badge tone="lavender">Saved in this browser</Badge>
            </div>
          </div>
        </div>
      </div>

      <Toast message={toast} />
    </>
  );
}

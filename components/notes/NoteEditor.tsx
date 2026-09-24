"use client";

import { useState } from "react";
import {
  Bold,
  Code2,
  Heading1,
  ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Redo2,
  Undo2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/field";
import { BearMascot } from "@/components/bears/BearMascot";
import { NOTE_TOPICS, type Note } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const TOOLBAR = [
  { icon: Heading1, label: "Heading" },
  { icon: Bold, label: "Bold" },
  { icon: Italic, label: "Italic" },
  { icon: List, label: "Bullet list" },
  { icon: ListOrdered, label: "Numbered list" },
  { icon: Code2, label: "Code" },
  { icon: Link2, label: "Link" },
  { icon: ImageIcon, label: "Image" },
];

const PLACEHOLDER = `Start writing…

## What I learned
- The three-way handshake is SYN → SYN-ACK → ACK
- Routers forward using IP addresses at layer 3

## Why it matters
Write it in your own words — that's what makes it stick. 🎀`;

/**
 * Visual note editor. The toolbar and visibility switch are styled UI only —
 * no formatting is applied and nothing is persisted yet.
 */
export function NoteEditor({ note }: { note?: Note }) {
  const [title, setTitle] = useState(note?.title ?? "");
  const [topic, setTopic] = useState(note?.topicId ?? NOTE_TOPICS[0].id);
  const [body, setBody] = useState(note?.body.join("\n\n") ?? "");
  const [visibility, setVisibility] = useState<"private" | "public">(
    note?.visibility ?? "private",
  );

  const words = body.trim() ? body.trim().split(/\s+/).length : 0;

  return (
    <div className="grid grid-cols-1 gap-space-lg lg:grid-cols-12">
      {/* Editor column */}
      <div className="flex flex-col gap-space-md rounded-[28px] bg-surface-container-lowest p-space-md shadow-cozy sm:p-space-lg lg:col-span-8">
        {/* Title */}
        <Input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
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
                className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant transition-all hover:bg-surface-container-lowest hover:text-primary hover:shadow-sm active:scale-95"
              >
                <Icon className="h-4 w-4" />
              </button>
            );
          })}

          <span className="mx-1 h-5 w-px bg-outline-variant" aria-hidden />

          <button
            type="button"
            title="Undo"
            aria-label="Undo"
            className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant transition-all hover:bg-surface-container-lowest hover:text-primary"
          >
            <Undo2 className="h-4 w-4" />
          </button>
          <button
            type="button"
            title="Redo"
            aria-label="Redo"
            className="flex h-9 w-9 items-center justify-center rounded-full text-on-surface-variant transition-all hover:bg-surface-container-lowest hover:text-primary"
          >
            <Redo2 className="h-4 w-4" />
          </button>
        </div>

        {/* Writing surface */}
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder={PLACEHOLDER}
          rows={18}
          className="min-h-[420px] w-full resize-y rounded-[20px] bg-surface-container-low/60 p-space-md font-body-md text-body-md leading-relaxed text-on-surface caret-primary outline-none ring-1 ring-inset ring-transparent transition-all placeholder:whitespace-pre-line placeholder:text-on-surface-variant/60 focus:bg-surface-container-low focus:ring-primary-container"
        />

        <div className="flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant">
          <span>
            ✍️ {words} word{words === 1 ? "" : "s"}
          </span>
          <span>Draft only — saving arrives in a later step.</span>
        </div>
      </div>

      {/* Side column */}
      <div className="flex flex-col gap-space-lg lg:col-span-4">
        {/* Visibility */}
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
                onClick={() => setVisibility(option.id)}
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
              {NOTE_TOPICS.map((option) => (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setTopic(option.id)}
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
            <Button variant="primary" block>
              🎀 Save Notes
            </Button>
            <Button variant="ghost" block href="/notes">
              Cancel
            </Button>
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
            <Badge tone="lavender">Autosave soon</Badge>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Paperclip, SendHorizonal, Sparkles } from "lucide-react";
import { ChatBubble, TypingBubble } from "./ChatBubble";
import { TUTOR_MESSAGES, TUTOR_QUICK_ACTIONS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

/**
 * Chat surface for the AI Tutor page.
 * The transcript is static mock data and the composer is visual only —
 * no model is called anywhere in this project yet.
 */
export function ChatPanel() {
  const [draft, setDraft] = useState("");

  return (
    <div className="flex h-[min(74vh,720px)] flex-col overflow-hidden rounded-[28px] bg-surface-container-low shadow-cozy">
      {/* Conversation */}
      <div className="flex flex-1 flex-col gap-space-md overflow-y-auto p-space-md sm:p-space-lg">
        <div className="mx-auto w-fit rounded-full bg-surface-container-lowest px-3 py-1 font-label-badge text-label-badge text-on-surface-variant shadow-sm">
          🌸 Today&apos;s study session
        </div>

        {TUTOR_MESSAGES.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}

        <TypingBubble />
      </div>

      {/* Quick actions */}
      <div className="border-t border-outline-variant/40 px-space-md pt-space-md sm:px-space-lg">
        <div className="flex items-center gap-1.5 pb-2 font-label-badge text-label-badge font-semibold uppercase tracking-wider text-on-surface-variant">
          <Sparkles className="h-3.5 w-3.5 text-tertiary" /> Quick actions
        </div>
        <div className="flex flex-wrap gap-2">
          {TUTOR_QUICK_ACTIONS.map((action) => (
            <button
              key={action.label}
              type="button"
              className="rounded-full bg-surface-container-lowest px-3 py-1.5 font-body-sm text-body-sm font-medium text-on-surface-variant shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-fixed hover:text-on-primary-fixed active:scale-95"
            >
              <span aria-hidden>{action.emoji}</span> {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Composer */}
      <div className="p-space-md sm:p-space-lg">
        <div className="flex items-end gap-2 rounded-[22px] bg-surface-container-lowest p-2 shadow-sm ring-1 ring-inset ring-outline-variant/60 transition-all focus-within:ring-2 focus-within:ring-primary-container">
          <button
            type="button"
            aria-label="Attach a note"
            title="Attach a note"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"
          >
            <Paperclip className="h-4 w-4" />
          </button>

          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            rows={1}
            placeholder="Ask me anything from your notes…"
            className="max-h-32 min-h-[40px] flex-1 resize-none bg-transparent py-2.5 font-body-md text-body-md text-on-surface caret-primary outline-none placeholder:text-on-surface-variant/70"
          />

          <button
            type="button"
            aria-label="Send message"
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-200 active:scale-95",
              draft.trim()
                ? "bg-primary text-on-primary shadow-sm hover:bg-tertiary"
                : "bg-surface-container-high text-on-surface-variant",
            )}
          >
            <SendHorizonal className="h-4 w-4" />
          </button>
        </div>
        <p className="px-2 pt-2 font-body-sm text-body-sm text-on-surface-variant">
          🐼 Panda only answers from your own notes — a real model gets wired up
          in a later step.
        </p>
      </div>
    </div>
  );
}

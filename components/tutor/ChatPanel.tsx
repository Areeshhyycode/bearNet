"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { RotateCcw, SendHorizonal, Sparkles } from "lucide-react";
import { ChatBubble, TypingBubble } from "./ChatBubble";
import { useNotes } from "@/lib/notes-store";
import { TUTOR_QUICK_ACTIONS } from "@/lib/mock-data";
import type { ChatMessage } from "./ChatBubble";
import { cn } from "@/lib/utils";

/** Chat surface for the AI Tutor — talks to Groq through /api/tutor. */
export function ChatPanel() {
  const { notes } = useNotes();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const notesRef = useRef(notes);
  notesRef.current = notes;

  // Keep the newest message in view.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, thinking]);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || thinking) return;

      const now = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      const userMessage: ChatMessage = {
        id: `u-${Date.now()}`,
        role: "user",
        text: trimmed,
        time: now,
      };

      const history = [...messages, userMessage];
      setMessages(history);
      setDraft("");
      setThinking(true);
      setError(null);

      try {
        const response = await fetch("/api/tutor", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: history.map((m) => ({
              role: m.role === "bear" ? "assistant" : "user",
              content: m.text,
            })),
            notes: notesRef.current.slice(0, 12).map((note) => ({
              title: note.title,
              topic: note.topic,
              body: note.body.join("\n\n"),
            })),
          }),
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data?.error ?? "Panda could not answer.");

        setMessages((prev) => [
          ...prev,
          {
            id: `b-${Date.now()}`,
            role: "bear",
            text: data.reply,
            time: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setThinking(false);
      }
    },
    [messages, thinking],
  );

  const hasConversation = messages.length > 0;

  return (
    <div className="flex h-[min(74vh,720px)] flex-col overflow-hidden rounded-[28px] bg-surface-container-low shadow-cozy">
      {/* Conversation */}
      <div
        ref={scrollRef}
        className="flex flex-1 flex-col gap-space-md overflow-y-auto p-space-md sm:p-space-lg"
      >
        <div className="mx-auto w-fit rounded-full bg-surface-container-lowest px-3 py-1 font-label-badge text-label-badge text-on-surface-variant shadow-sm">
          🌸 {notes.length > 0
            ? `Panda can read your ${notes.length} note${notes.length === 1 ? "" : "s"}`
            : "No notes yet — Panda will answer from general knowledge"}
        </div>

        {!hasConversation && (
          <div className="my-auto flex flex-col items-center gap-3 text-center">
            <span className="text-4xl" aria-hidden>
              🐼
            </span>
            <p className="max-w-sm font-body-md text-body-md text-on-surface-variant">
              Ask me anything from your notes — or anything about networking at
              all. I will tell you which of your notes I used.
            </p>
          </div>
        )}

        {messages.map((message) => (
          <ChatBubble key={message.id} message={message} />
        ))}

        {thinking && <TypingBubble />}

        {error && (
          <div className="mx-auto w-fit max-w-full rounded-2xl bg-error-container px-4 py-2.5 text-center font-body-sm text-body-sm text-on-error-container">
            🥺 {error}
          </div>
        )}
      </div>

      {/* Quick actions */}
      <div className="border-t border-outline-variant/40 px-space-md pt-space-md sm:px-space-lg">
        <div className="flex items-center justify-between gap-2 pb-2">
          <span className="flex items-center gap-1.5 font-label-badge text-label-badge font-semibold uppercase tracking-wider text-on-surface-variant">
            <Sparkles className="h-3.5 w-3.5 text-tertiary" /> Quick actions
          </span>
          {hasConversation && (
            <button
              type="button"
              onClick={() => {
                setMessages([]);
                setError(null);
              }}
              className="flex items-center gap-1 rounded-full px-2 py-1 font-label-badge text-label-badge text-on-surface-variant transition-colors hover:text-primary"
            >
              <RotateCcw className="h-3 w-3" /> New chat
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {TUTOR_QUICK_ACTIONS.map((action) => (
            <button
              key={action.label}
              type="button"
              disabled={thinking}
              onClick={() => send(action.prompt)}
              className="rounded-full bg-surface-container-lowest px-3 py-1.5 font-body-sm text-body-sm font-medium text-on-surface-variant shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-fixed hover:text-on-primary-fixed active:scale-95 disabled:pointer-events-none disabled:opacity-50"
            >
              <span aria-hidden>{action.emoji}</span> {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Composer */}
      <div className="p-space-md sm:p-space-lg">
        <div className="flex items-end gap-2 rounded-[22px] bg-surface-container-lowest p-2 shadow-sm ring-1 ring-inset ring-outline-variant/60 transition-all focus-within:ring-2 focus-within:ring-primary-container">
          <textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                send(draft);
              }
            }}
            rows={1}
            placeholder="Ask me anything from your notes…"
            className="max-h-32 min-h-[40px] flex-1 resize-none bg-transparent px-3 py-2.5 font-body-md text-body-md text-on-surface caret-primary outline-none placeholder:text-on-surface-variant/70"
          />

          <button
            type="button"
            aria-label="Send message"
            onClick={() => send(draft)}
            disabled={!draft.trim() || thinking}
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-all duration-200 active:scale-95",
              draft.trim() && !thinking
                ? "bg-primary text-on-primary shadow-sm hover:bg-tertiary"
                : "bg-surface-container-high text-on-surface-variant",
            )}
          >
            <SendHorizonal className="h-4 w-4" />
          </button>
        </div>
        <p className="px-2 pt-2 font-body-sm text-body-sm text-on-surface-variant">
          🐼 Enter sends · Shift+Enter makes a new line
        </p>
      </div>
    </div>
  );
}

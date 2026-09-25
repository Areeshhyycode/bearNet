"use client";

import { useEffect, useRef, useState } from "react";
import type { LabScenario } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type Line = {
  type: "command" | "output" | "muted" | "success" | "error";
  text: string;
};

const LINE_STYLES: Record<Line["type"], string> = {
  command: "text-primary-fixed-dim",
  output: "text-inverse-on-surface",
  muted: "text-inverse-on-surface/55",
  success: "text-[#A4E4C3]",
  error: "text-[#FF8EA8]",
};

const BANNER: Line[] = [
  { type: "muted", text: "BearNet Cozy Lab — simulated shell 🐻‍❄️" },
  { type: "muted", text: "Type `help` to see what this box understands." },
  { type: "muted", text: "" },
];

/**
 * Interactive simulated terminal.
 *
 * Nothing is executed: commands are matched against the scenario's script.
 * Unknown commands get a friendly nudge rather than a shell error.
 */
export function TerminalSim({
  scenario,
  onCommandRun,
  className,
}: {
  scenario: LabScenario;
  onCommandRun?: (command: string) => void;
  className?: string;
}) {
  const [lines, setLines] = useState<Line[]>(BANNER);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset when the scenario changes.
  useEffect(() => {
    setLines(BANNER);
    setHistory([]);
    setHistoryIndex(-1);
  }, [scenario.id]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const known = Object.keys(scenario.commands);

  function run(raw: string) {
    const command = raw.trim();
    if (!command) return;

    const next: Line[] = [...lines, { type: "command", text: command }];
    const lower = command.toLowerCase();

    if (lower === "clear") {
      setLines(BANNER);
      setInput("");
      return;
    }

    if (lower === "help") {
      next.push(
        { type: "muted", text: "Commands this scenario understands:" },
        ...known.map((c) => ({ type: "output" as const, text: `  ${c}` })),
        { type: "muted", text: "  clear    wipe the screen" },
        { type: "muted", text: "" },
      );
    } else {
      // Exact match first, then a forgiving prefix match.
      const key =
        known.find((c) => c.toLowerCase() === lower) ??
        known.find((c) => lower.startsWith(c.toLowerCase())) ??
        known.find((c) => c.toLowerCase().startsWith(lower.split(" ")[0]));

      if (key) {
        next.push(...scenario.commands[key], { type: "muted", text: "" });
      } else {
        next.push(
          {
            type: "error",
            text: `bearnet: ${command.split(" ")[0]}: not part of this scenario`,
          },
          { type: "muted", text: "Try `help` to see what is available." },
          { type: "muted", text: "" },
        );
      }
    }

    setLines(next);
    setHistory((prev) => [command, ...prev]);
    setHistoryIndex(-1);
    setInput("");
    onCommandRun?.(command);
  }

  return (
    <div
      className={cn("overflow-hidden rounded-[24px] bg-[#2E1E20] shadow-float", className)}
      onClick={() => inputRef.current?.focus()}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-white/10 px-space-md py-3">
        <span className="h-3 w-3 rounded-full bg-[#FF8EA8]" />
        <span className="h-3 w-3 rounded-full bg-[#FFD9E2]" />
        <span className="h-3 w-3 rounded-full bg-[#A4E4C3]" />
        <span className="ml-2 truncate font-label-code text-label-code text-inverse-on-surface/70">
          polar@bearnet-lab: ~/scenarios/{scenario.code.toLowerCase()}
        </span>
        <span className="ml-auto hidden rounded-full bg-white/10 px-2 py-0.5 font-label-badge text-label-badge text-inverse-on-surface/80 sm:inline">
          simulated
        </span>
      </div>

      {/* Output */}
      <div
        ref={scrollRef}
        className="h-[340px] overflow-y-auto p-space-md font-label-code text-label-code leading-relaxed"
      >
        {lines.map((line, index) => (
          <div
            key={index}
            className={cn("whitespace-pre-wrap", LINE_STYLES[line.type])}
          >
            {line.type === "command" ? (
              <>
                <span className="text-[#CFA4DF]">$</span> {line.text}
              </>
            ) : (
              line.text || " "
            )}
          </div>
        ))}

        {/* Live prompt */}
        <div className="flex items-center gap-2 text-inverse-on-surface">
          <span className="text-[#CFA4DF]">$</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") run(input);
              if (event.key === "ArrowUp") {
                event.preventDefault();
                const nextIndex = Math.min(historyIndex + 1, history.length - 1);
                if (nextIndex >= 0) {
                  setHistoryIndex(nextIndex);
                  setInput(history[nextIndex]);
                }
              }
              if (event.key === "ArrowDown") {
                event.preventDefault();
                const nextIndex = historyIndex - 1;
                setHistoryIndex(nextIndex);
                setInput(nextIndex >= 0 ? history[nextIndex] : "");
              }
            }}
            spellCheck={false}
            autoComplete="off"
            aria-label="Terminal input"
            placeholder="type a command…"
            className="flex-1 bg-transparent font-label-code text-label-code text-inverse-on-surface caret-[#FFD9E2] outline-none placeholder:text-inverse-on-surface/30"
          />
        </div>
      </div>

      {/* Command hints */}
      <div className="flex flex-wrap items-center gap-1.5 border-t border-white/10 px-space-md py-2.5">
        <span className="font-label-badge text-label-badge text-inverse-on-surface/50">
          try:
        </span>
        {known.slice(0, 4).map((command) => (
          <button
            key={command}
            type="button"
            onClick={() => run(command)}
            className="rounded-full bg-white/10 px-2 py-0.5 font-label-code text-[11px] text-primary-fixed transition-colors hover:bg-white/20"
          >
            {command}
          </button>
        ))}
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import type { TerminalLine } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const LINE_STYLES: Record<TerminalLine["type"], string> = {
  command: "text-primary-fixed-dim",
  output: "text-inverse-on-surface",
  muted: "text-inverse-on-surface/55",
  success: "text-[#A4E4C3]",
  error: "text-[#FF8EA8]",
};

/**
 * Cozy cocoa-brown terminal. Lines reveal one by one on mount —
 * it is a visual simulator, nothing is executed.
 */
export function TerminalSim({
  lines,
  title = "polar@bearnet-lab: ~/scenarios/04",
  className,
}: {
  lines: TerminalLine[];
  title?: string;
  className?: string;
}) {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    if (visible >= lines.length) return;
    const timeout = setTimeout(() => setVisible((v) => v + 1), 220);
    return () => clearTimeout(timeout);
  }, [visible, lines.length]);

  const done = visible >= lines.length;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-[24px] bg-[#2E1E20] shadow-float",
        className,
      )}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 border-b border-white/10 px-space-md py-3">
        <span className="h-3 w-3 rounded-full bg-[#FF8EA8]" />
        <span className="h-3 w-3 rounded-full bg-[#FFD9E2]" />
        <span className="h-3 w-3 rounded-full bg-[#A4E4C3]" />
        <span className="ml-2 truncate font-label-code text-label-code text-inverse-on-surface/70">
          {title}
        </span>
        <span className="ml-auto hidden rounded-full bg-white/10 px-2 py-0.5 font-label-badge text-label-badge text-inverse-on-surface/80 sm:inline">
          simulated
        </span>
      </div>

      {/* Output */}
      <div className="max-h-[360px] overflow-y-auto p-space-md font-label-code text-label-code leading-relaxed">
        {lines.slice(0, visible).map((line, index) => (
          <div
            key={`${line.text}-${index}`}
            className={cn("animate-fade-up whitespace-pre-wrap", LINE_STYLES[line.type])}
          >
            {line.type === "command" ? (
              <>
                <span className="text-[#CFA4DF]">$</span> {line.text}
              </>
            ) : (
              line.text || " "
            )}
          </div>
        ))}

        {/* Prompt */}
        <div className="flex items-center gap-2 pt-1 text-inverse-on-surface">
          <span className="text-[#CFA4DF]">$</span>
          <span
            className={cn(
              "inline-block h-4 w-2 bg-primary-fixed-dim",
              done ? "animate-pulse" : "opacity-40",
            )}
          />
        </div>
      </div>
    </div>
  );
}

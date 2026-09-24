"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Selectable answer / topic card. Purely visual selection state —
 * no grading or scoring logic lives here.
 */
export function OptionCard({
  label,
  title,
  caption,
  emoji,
  selected = false,
  onSelect,
  className,
  state = "idle",
}: {
  /** Short marker such as A / B / C. */
  label?: string;
  title: string;
  caption?: string;
  emoji?: string;
  selected?: boolean;
  onSelect?: () => void;
  className?: string;
  state?: "idle" | "correct" | "incorrect";
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "group flex w-full items-center gap-space-md rounded-[20px] p-space-md text-left transition-all duration-200 active:scale-[0.99]",
        state === "idle" &&
          (selected
            ? "bg-primary-fixed shadow-soft ring-2 ring-primary-container"
            : "bg-surface-container-low ring-1 ring-transparent hover:bg-surface-container-high hover:ring-primary-container/60"),
        state === "correct" && "bg-[#E4F5EB] ring-2 ring-[#8FCBAA]",
        state === "incorrect" && "bg-error-container ring-2 ring-error/40",
        className,
      )}
    >
      {(label || emoji) && (
        <span
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-body-sm text-body-sm font-bold transition-colors",
            selected
              ? "bg-primary text-on-primary"
              : "bg-surface-container-lowest text-on-surface-variant",
          )}
        >
          {emoji ? <span className="text-[18px]" aria-hidden>{emoji}</span> : label}
        </span>
      )}

      <span className="min-w-0 flex-1">
        <span className="block font-body-md text-body-md font-semibold text-on-surface">
          {title}
        </span>
        {caption && (
          <span className="mt-0.5 block font-body-sm text-body-sm text-on-surface-variant">
            {caption}
          </span>
        )}
      </span>

      <span
        className={cn(
          "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all",
          selected
            ? "border-primary bg-primary text-on-primary"
            : "border-primary-container bg-transparent text-transparent",
        )}
      >
        <Check className="h-3.5 w-3.5" strokeWidth={3} />
      </span>
    </button>
  );
}

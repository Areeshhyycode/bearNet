"use client";

import { cn } from "@/lib/utils";

export type SegmentedOption<T extends string | number> = {
  value: T;
  label: string;
  emoji?: string;
};

/** Pill group used for difficulty and question-count selection. */
export function Segmented<T extends string | number>({
  options,
  value,
  onChange,
  className,
  size = "md",
  label,
}: {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
  size?: "sm" | "md";
  label?: string;
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn(
        "inline-flex flex-wrap items-center gap-1 rounded-full bg-surface-container-low p-1",
        className,
      )}
    >
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <button
            key={String(option.value)}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-full font-body-sm text-body-sm font-semibold transition-all duration-200 active:scale-95",
              size === "sm" ? "px-3 py-1" : "px-space-md py-1.5",
              selected
                ? "bg-primary-container text-on-primary-container shadow-sm"
                : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
            )}
          >
            {option.emoji && <span className="mr-1" aria-hidden>{option.emoji}</span>}
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

/** Soft ivory input, pill or 16px rounded, per the design system. */
export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement> & { pill?: boolean }
>(({ className, pill = false, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "w-full bg-surface-container-lowest px-4 py-2.5 font-body-md text-body-md text-on-surface caret-primary outline-none transition-all",
      "ring-1 ring-inset ring-outline-variant placeholder:text-on-surface-variant/70",
      "focus:ring-2 focus:ring-primary-container",
      pill ? "rounded-full" : "rounded-2xl",
      className,
    )}
    {...props}
  />
));
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full resize-none rounded-2xl bg-surface-container-lowest px-4 py-3 font-body-md text-body-md text-on-surface caret-primary outline-none transition-all",
      "ring-1 ring-inset ring-outline-variant placeholder:text-on-surface-variant/70",
      "focus:ring-2 focus:ring-primary-container",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";

/** Label + helper text wrapper. */
export function Field({
  label,
  hint,
  children,
  className,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block space-y-1.5", className)}>
      <span className="font-label-badge text-label-badge font-semibold uppercase tracking-wider text-on-surface-variant">
        {label}
      </span>
      {children}
      {hint && (
        <span className="block font-body-sm text-body-sm text-on-surface-variant">
          {hint}
        </span>
      )}
    </label>
  );
}

/** Cozy switch with a soft berry fill when on. */
export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (next: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative h-7 w-12 shrink-0 rounded-full transition-colors duration-300",
        checked ? "bg-primary" : "bg-surface-container-high",
      )}
    >
      <span
        className={cn(
          "absolute top-1 h-5 w-5 rounded-full bg-surface-container-lowest shadow-sm transition-all duration-300",
          checked ? "left-6" : "left-1",
        )}
      />
    </button>
  );
}

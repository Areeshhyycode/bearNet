"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

/**
 * Accessible confirmation modal.
 *
 * Traps nothing fancy — it moves focus to the cancel button, closes on
 * Escape, and blocks background scroll while open.
 */
export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Delete",
  cancelLabel = "Keep it",
  tone = "danger",
  emoji = "🥺",
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: "danger" | "primary";
  emoji?: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    cancelRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onCancel();
    }
    document.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onCancel]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-[70] flex items-center justify-center p-4"
    >
      <button
        type="button"
        aria-hidden
        tabIndex={-1}
        onClick={onCancel}
        className="absolute inset-0 bg-inverse-surface/25 backdrop-blur-sm"
      />

      <div className="animate-fade-up relative w-full max-w-sm rounded-[28px] bg-surface-container-lowest p-space-lg text-center shadow-float">
        <span className="text-3xl" aria-hidden>
          {emoji}
        </span>
        <h2 className="mt-2 font-headline-md text-[17px] font-bold text-on-surface">
          {title}
        </h2>
        {description && (
          <p className="mt-1 font-body-sm text-body-sm text-on-surface-variant">
            {description}
          </p>
        )}

        <div className="mt-space-lg flex flex-col-reverse gap-2 sm:flex-row sm:justify-center">
          <button
            ref={cancelRef}
            type="button"
            onClick={onCancel}
            className="rounded-full bg-surface-container-high px-5 py-2.5 font-body-sm text-body-sm font-semibold text-on-surface transition-colors hover:bg-surface-container"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={cn(
              "rounded-full px-5 py-2.5 font-body-sm text-body-sm font-semibold transition-colors",
              tone === "danger"
                ? "bg-error-container text-on-error-container hover:bg-error hover:text-on-error"
                : "bg-primary text-on-primary hover:bg-tertiary",
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

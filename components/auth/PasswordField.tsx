"use client";

import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

/** Text input with a show/hide toggle and inline error slot. */
export function PasswordField({
  label,
  value,
  onChange,
  error,
  hint,
  autoComplete = "current-password",
  placeholder = "••••••••",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  hint?: string;
  autoComplete?: string;
  placeholder?: string;
}) {
  const id = useId();
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block font-label-badge text-label-badge font-semibold uppercase tracking-wider text-on-surface-variant"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined}
          className={cn(
            "w-full rounded-2xl bg-surface-container-lowest py-2.5 pl-4 pr-12 font-body-md text-body-md text-on-surface caret-primary outline-none transition-all",
            "ring-1 ring-inset placeholder:text-on-surface-variant/60",
            error
              ? "ring-2 ring-error"
              : "ring-outline-variant focus:ring-2 focus:ring-primary-container",
          )}
        />

        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-primary"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>

      {error ? (
        <p id={`${id}-error`} className="font-body-sm text-body-sm text-error">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="font-body-sm text-body-sm text-on-surface-variant">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

/** Plain text/email input matching the password field's styling. */
export function TextField({
  label,
  value,
  onChange,
  error,
  type = "text",
  autoComplete,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  type?: string;
  autoComplete?: string;
  placeholder?: string;
}) {
  const id = useId();

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="block font-label-badge text-label-badge font-semibold uppercase tracking-wider text-on-surface-variant"
      >
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        autoComplete={autoComplete}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={cn(
          "w-full rounded-2xl bg-surface-container-lowest px-4 py-2.5 font-body-md text-body-md text-on-surface caret-primary outline-none transition-all",
          "ring-1 ring-inset placeholder:text-on-surface-variant/60",
          error
            ? "ring-2 ring-error"
            : "ring-outline-variant focus:ring-2 focus:ring-primary-container",
        )}
      />
      {error && (
        <p id={`${id}-error`} className="font-body-sm text-body-sm text-error">
          {error}
        </p>
      )}
    </div>
  );
}

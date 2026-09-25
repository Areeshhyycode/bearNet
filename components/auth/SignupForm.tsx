"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Loader2, X } from "lucide-react";
import { PasswordField, TextField } from "./PasswordField";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Live checklist so the rules are visible before submitting. */
function rules(password: string) {
  return [
    { label: "At least 8 characters", ok: password.length >= 8 },
    { label: "Contains a letter", ok: /[a-zA-Z]/.test(password) },
    { label: "Contains a number", ok: /[0-9]/.test(password) },
  ];
}

export function SignupForm() {
  const router = useRouter();
  const { signup } = useAuth();
  const toast = useToast();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const checks = rules(password);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;

    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = "Tell us what to call you.";
    if (!EMAIL_RE.test(email)) next.email = "Enter a valid email address.";
    if (checks.some((c) => !c.ok)) next.password = "Password does not meet the rules yet.";
    if (password !== confirmPassword) next.confirmPassword = "Passwords do not match.";

    setErrors(next);
    setFormError(null);
    if (Object.keys(next).length > 0) return;

    setBusy(true);
    const message = await signup({ name, email, password, confirmPassword });
    setBusy(false);

    if (message) {
      setFormError(message);
      return;
    }

    toast.success("🌸 Account created — welcome to BearNet!");
    router.push("/");
    router.refresh();
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-space-md">
      <TextField
        label="Name"
        value={name}
        onChange={setName}
        error={errors.name}
        autoComplete="name"
        placeholder="Areesha"
      />

      <TextField
        label="Email"
        type="email"
        value={email}
        onChange={setEmail}
        error={errors.email}
        autoComplete="email"
        placeholder="you@example.com"
      />

      <PasswordField
        label="Password"
        value={password}
        onChange={setPassword}
        error={errors.password}
        autoComplete="new-password"
      />

      {/* Rule checklist appears as soon as they start typing. */}
      {password.length > 0 && (
        <ul className="space-y-1 rounded-2xl bg-surface-container-low px-4 py-3">
          {checks.map((rule) => (
            <li
              key={rule.label}
              className={cn(
                "flex items-center gap-2 font-body-sm text-body-sm",
                rule.ok ? "text-tertiary" : "text-on-surface-variant",
              )}
            >
              <span
                className={cn(
                  "flex h-4 w-4 items-center justify-center rounded-full",
                  rule.ok ? "bg-tertiary text-on-tertiary" : "bg-surface-container-high",
                )}
              >
                {rule.ok ? (
                  <Check className="h-2.5 w-2.5" strokeWidth={3} />
                ) : (
                  <X className="h-2.5 w-2.5 text-on-surface-variant" strokeWidth={3} />
                )}
              </span>
              {rule.label}
            </li>
          ))}
        </ul>
      )}

      <PasswordField
        label="Confirm password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        error={errors.confirmPassword}
        autoComplete="new-password"
      />

      {formError && (
        <div
          role="alert"
          className="rounded-2xl bg-error-container px-4 py-3 font-body-sm text-body-sm text-on-error-container"
        >
          🥺 {formError}
        </div>
      )}

      <button
        type="submit"
        disabled={busy}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-body-md text-body-md font-semibold text-on-primary shadow-sm transition-all duration-200 hover:bg-tertiary active:scale-[0.98] disabled:pointer-events-none disabled:opacity-60"
      >
        {busy && <Loader2 className="h-4 w-4 animate-spin" />}
        {busy ? "Creating your space…" : "Create account 🌸"}
      </button>

      <p className="text-center font-body-sm text-body-sm text-on-surface-variant">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}

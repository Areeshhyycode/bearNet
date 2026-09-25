"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2 } from "lucide-react";
import { PasswordField, TextField } from "./PasswordField";
import { useAuth } from "@/lib/auth-context";
import { useToast } from "@/lib/toast";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const { login } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (busy) return;

    const next: typeof errors = {};
    if (!EMAIL_RE.test(email)) next.email = "Enter a valid email address.";
    if (!password) next.password = "Enter your password.";

    setErrors(next);
    setFormError(null);
    if (Object.keys(next).length > 0) return;

    setBusy(true);
    const message = await login(email, password);
    setBusy(false);

    if (message) {
      setFormError(message);
      return;
    }

    toast.success("🎀 Welcome back!");
    // Honour ?next= so a deep link survives the login redirect.
    const destination = params.get("next") || "/";
    router.push(destination);
    router.refresh();
  }

  return (
    <form onSubmit={submit} noValidate className="space-y-space-md">
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
        autoComplete="current-password"
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
        {busy ? "Signing you in…" : "Sign in 🎀"}
      </button>

      <p className="text-center font-body-sm text-body-sm text-on-surface-variant">
        New here?{" "}
        <Link
          href="/signup"
          className="font-semibold text-primary underline-offset-4 hover:underline"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}

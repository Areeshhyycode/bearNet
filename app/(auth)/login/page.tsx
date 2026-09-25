import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/LoginForm";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your cozy BearNet study space.",
};

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back 🎀"
      subtitle="Sign in to pick up where you left off."
      footer={
        <>Your notes stay private unless you choose to share them.</>
      }
    >
      {/* useSearchParams needs a Suspense boundary. */}
      <Suspense fallback={<div className="h-64" />}>
        <LoginForm />
      </Suspense>
    </AuthShell>
  );
}

import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignupForm } from "@/components/auth/SignupForm";

export const metadata: Metadata = {
  title: "Create account",
  description: "Start your cozy networking and cybersecurity study journey.",
};

export default function SignupPage() {
  return (
    <AuthShell
      title="Make yourself at home 🌸"
      subtitle="Create an account to save your notes, roadmap and progress."
      footer={<>By signing up you get your own private study space.</>}
    >
      <SignupForm />
    </AuthShell>
  );
}

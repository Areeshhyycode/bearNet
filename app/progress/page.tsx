import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/AppShell";
import { ProgressScreen } from "@/components/progress/ProgressScreen";

export const metadata: Metadata = {
  title: "My Progress",
  description: "Your cozy learning journey from Sprout to VAPT Apprentice.",
};

export default function ProgressPage() {
  return (
    <PageContainer>
      <ProgressScreen />
    </PageContainer>
  );
}

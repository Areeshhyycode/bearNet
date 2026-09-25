import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/AppShell";
import { TutorScreen } from "@/components/tutor/TutorScreen";

export const metadata: Metadata = {
  title: "AI Tutor",
  description: "Panda, your cozy study buddy, grounded in your own notes.",
};

export default function TutorPage() {
  return (
    <PageContainer>
      <TutorScreen />
    </PageContainer>
  );
}

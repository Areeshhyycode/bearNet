import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/AppShell";
import { ExamScreen } from "@/components/exam/ExamScreen";

export const metadata: Metadata = {
  title: "AI Exam",
  description: "A calm, proctored-style exam room built from your own notes.",
};

export default function ExamPage() {
  return (
    <PageContainer>
      <ExamScreen />
    </PageContainer>
  );
}

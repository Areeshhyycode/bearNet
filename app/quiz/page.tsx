import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/AppShell";
import { QuizScreen } from "@/components/quiz/QuizScreen";

export const metadata: Metadata = {
  title: "Quiz Me",
  description: "Quick active-recall drills built from your own notes.",
};

export default function QuizPage() {
  return (
    <PageContainer>
      <QuizScreen />
    </PageContainer>
  );
}

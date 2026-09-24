import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/AppShell";
import { PageHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { ExamWorkspace } from "@/components/exam/ExamWorkspace";
import { LEARNER, SCHEDULED_EXAM } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "AI Exam",
  description:
    "A calm, proctored-style exam room simulated from your own notes.",
};

export default function ExamPage() {
  return (
    <PageContainer>
      <PageHeading
        title={
          <>
            <span aria-hidden>🎀</span> Let&apos;s See What You Remember!
          </>
        }
        subtitle="A full exam simulation built from your notes — pick a topic, set the difficulty, and take a proper run at it."
        badges={
          <>
            <Badge tone="blush" size="md">
              <span aria-hidden>🎓</span> CompTIA Net+ style
            </Badge>
            <Badge tone="neutral" size="md">
              {SCHEDULED_EXAM.title} in {SCHEDULED_EXAM.daysLeft} days
            </Badge>
          </>
        }
      />

      <section className="grid grid-cols-2 gap-space-md lg:grid-cols-4">
        <StatCard
          emoji="🎓"
          label="Exams Completed"
          value={LEARNER.examsCompleted}
          caption="Since you started"
        />
        <StatCard emoji="🏅" label="Best Score" value="92%" caption="Ports & Protocols" />
        <StatCard emoji="📜" label="Pass Mark" value="80%" caption="Net+ standard" />
        <StatCard
          emoji="🌸"
          label="Readiness"
          value={`${SCHEDULED_EXAM.prepared}%`}
          caption="Panda's estimate"
        />
      </section>

      <ExamWorkspace />
    </PageContainer>
  );
}

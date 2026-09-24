import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/AppShell";
import { PageHeading, SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { QuizSetup } from "@/components/quiz/QuizSetup";
import { QuizRunner } from "@/components/quiz/QuizRunner";
import { BearMascot } from "@/components/bears/BearMascot";
import { LEARNER } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Quiz Me",
  description: "Quick active-recall drills built from your own notes.",
};

export default function QuizPage() {
  return (
    <PageContainer>
      <PageHeading
        title={
          <>
            <span aria-hidden>🧠</span> Quiz Me
          </>
        }
        subtitle="Short active-recall sprints. Answer fast, then find out what quietly slipped away."
        badges={
          <>
            <Badge tone="blush" size="md">
              <span aria-hidden>💡</span> Active recall sprint
            </Badge>
            <Badge tone="neutral" size="md">
              {LEARNER.quizAccuracy}% accuracy • 12 quiz streak
            </Badge>
          </>
        }
      />

      <section className="grid grid-cols-2 gap-space-md lg:grid-cols-4">
        <StatCard emoji="✨" label="Accuracy" value={`${LEARNER.quizAccuracy}%`} caption="Last 30 questions" />
        <StatCard emoji="🔥" label="Quiz Streak" value="12" caption="Drills in a row" />
        <StatCard emoji="⏱️" label="Avg. Answer" value="14s" caption="Nice and steady" />
        <StatCard emoji="🎯" label="Weakest Topic" value="Subnetting" caption="57% mastery" />
      </section>

      <div className="grid grid-cols-1 gap-space-lg lg:grid-cols-12">
        <div className="lg:col-span-8">
          <QuizSetup title="Build a quick drill" ctaLabel="Start Quick Quiz" />
        </div>

        <div className="flex flex-col gap-space-lg lg:col-span-4">
          <div className="flex flex-col items-center gap-2 rounded-[28px] bg-primary-fixed p-space-lg text-center">
            <BearMascot variant="grizzly" size={96} animated />
            <h2 className="font-headline-md text-[16px] font-bold text-on-primary-fixed">
              Grizzly&apos;s drill rules
            </h2>
            <ul className="space-y-1 font-body-sm text-body-sm text-on-primary-fixed/90">
              <li>🌸 Answer before you look anything up.</li>
              <li>🧮 Wrong answers earn a revision card.</li>
              <li>☕ Five minutes counts as a full session.</li>
            </ul>
          </div>

          <div className="flex flex-col gap-space-sm rounded-[28px] bg-surface-container-low p-space-lg">
            <h3 className="font-headline-md text-[15px] font-bold text-on-surface">
              🎀 Recent drills
            </h3>
            {[
              { title: "Common Ports", score: "10/10", tone: "text-tertiary" },
              { title: "OSI Layers", score: "8/10", tone: "text-on-surface" },
              { title: "Subnetting", score: "6/10", tone: "text-on-surface" },
            ].map((drill) => (
              <div
                key={drill.title}
                className="flex items-center justify-between rounded-xl bg-surface-container-lowest px-3 py-2 font-body-sm text-body-sm shadow-sm"
              >
                <span className="text-on-surface-variant">{drill.title}</span>
                <span className={`font-bold ${drill.tone}`}>{drill.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live question preview */}
      <section className="flex flex-col gap-space-lg">
        <SectionHeading
          eyebrow="Question interface"
          title="Inside the drill"
          description="This is exactly how a question will look once the quiz engine is connected."
        />
        <QuizRunner timeLabel="04:12" />
      </section>
    </PageContainer>
  );
}

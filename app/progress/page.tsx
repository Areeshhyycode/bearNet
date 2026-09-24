import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/AppShell";
import { PageHeading, SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { Panel } from "@/components/ui/card";
import { ProgressBar, ProgressRing } from "@/components/ui/progress";
import { JourneyLadder, JourneyTrack } from "@/components/progress/JourneyTrack";
import { ActivityChart } from "@/components/progress/ActivityChart";
import { BadgeGrid, MasteryList } from "@/components/progress/BadgeGrid";
import { BearMascot } from "@/components/bears/BearMascot";
import { LEARNER } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "My Progress",
  description: "Your cozy learning journey from Sprout to VAPT Apprentice.",
};

export default function ProgressPage() {
  const levelPercent = Math.round((LEARNER.xp / LEARNER.xpToNextLevel) * 100);

  return (
    <PageContainer>
      <PageHeading
        title={
          <>
            <span aria-hidden>🌷</span> My Learning Journey
          </>
        }
        subtitle="Where you started, where you are, and the next cozy milestone waiting for you."
        badges={
          <>
            <Badge tone="blush" size="md">
              <span aria-hidden>🎀</span> {LEARNER.rank} • Level {LEARNER.level}
            </Badge>
            <Badge tone="neutral" size="md">
              {LEARNER.minutesThisWeek} minutes studied this week
            </Badge>
          </>
        }
      />

      {/* Level card */}
      <Panel className="bg-surface-container-low shadow-hero">
        <div className="flex flex-col items-center gap-space-lg lg:flex-row lg:justify-between">
          <div className="flex items-center gap-space-md">
            <BearMascot variant="grizzly" size={110} animated />
            <div className="space-y-1.5">
              <span className="font-label-badge text-label-badge font-bold uppercase tracking-wider text-tertiary">
                ✦ Current rank
              </span>
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">
                🎀 {LEARNER.rank}
              </h2>
              <p className="max-w-md font-body-md text-body-md text-on-surface-variant">
                {LEARNER.xpToNextLevel - LEARNER.xp} XP until{" "}
                <strong className="font-semibold text-on-surface">
                  Network Learner
                </strong>
                . That is roughly three quiz drills and one lab scenario.
              </p>
              <div className="max-w-sm space-y-1 pt-1">
                <ProgressBar value={levelPercent} label="Level progress" />
                <div className="flex justify-between font-label-badge text-label-badge text-on-surface-variant">
                  <span>{LEARNER.xp.toLocaleString()} XP</span>
                  <span>{LEARNER.xpToNextLevel.toLocaleString()} XP</span>
                </div>
              </div>
            </div>
          </div>

          <ProgressRing value={levelPercent} size={150} stroke={13}>
            <span className="font-headline-lg text-headline-lg font-bold leading-none text-on-surface">
              {levelPercent}%
            </span>
            <span className="font-label-badge text-label-badge uppercase tracking-wider text-on-surface-variant">
              to level {LEARNER.level + 1}
            </span>
          </ProgressRing>
        </div>
      </Panel>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-space-md lg:grid-cols-3 xl:grid-cols-6">
        <StatCard emoji="🎀" label="XP" value={LEARNER.xp.toLocaleString()} />
        <StatCard emoji="🔥" label="Streak" value={`${LEARNER.streak}d`} />
        <StatCard
          emoji="🌱"
          label="Topics"
          value={`${LEARNER.topicsCompleted}/${LEARNER.topicsTotal}`}
        />
        <StatCard emoji="✨" label="Quiz Accuracy" value={`${LEARNER.quizAccuracy}%`} />
        <StatCard emoji="🎓" label="Exams Done" value={LEARNER.examsCompleted} />
        <StatCard emoji="🏅" label="Badges" value="4" />
      </section>

      {/* Roadmap */}
      <Panel className="flex flex-col gap-space-lg">
        <SectionHeading
          eyebrow="Roadmap"
          title="From Sprout to VAPT Apprentice"
          size="md"
          description="Five ranks, each unlocking a deeper layer of the stack."
        />
        <JourneyTrack />
        <JourneyLadder />
      </Panel>

      {/* Charts */}
      <section className="grid grid-cols-1 gap-space-lg lg:grid-cols-2">
        <ActivityChart />
        <MasteryList />
      </section>

      <BadgeGrid />
    </PageContainer>
  );
}

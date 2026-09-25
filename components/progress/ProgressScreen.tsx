"use client";

import { PageHeading, SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { StatCard } from "@/components/ui/stat-card";
import { Panel } from "@/components/ui/card";
import { ProgressBar, ProgressRing } from "@/components/ui/progress";
import { BearMascot } from "@/components/bears/BearMascot";
import { JourneyLadder, JourneyTrack } from "./JourneyTrack";
import { ActivityChart } from "./ActivityChart";
import { BadgeGrid, MasteryList } from "./BadgeGrid";
import { useNotes } from "@/lib/notes-store";
import { RANKS, useProgress } from "@/lib/progress-store";

export function ProgressScreen() {
  const { notes } = useNotes();
  const {
    xp,
    level,
    rank,
    xpIntoLevel,
    xpForNextLevel,
    levelPercent,
    streak,
    quizAccuracy,
    examsCompleted,
    labsSolved,
    minutesThisWeek,
    topicMastery,
  } = useProgress();

  const nextRank = RANKS.find((r) => r.minLevel > level);
  const mastered = topicMastery.filter((t) => t.percent >= 80).length;

  return (
    <>
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
              <span aria-hidden>{rank.emoji}</span> {rank.title} • Level {level}
            </Badge>
            <Badge tone="neutral" size="md">
              {minutesThisWeek} minutes studied this week
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
                {rank.emoji} {rank.title}
              </h2>
              <p className="max-w-md font-body-md text-body-md text-on-surface-variant">
                {xp === 0 ? (
                  <>
                    You are right at the start. Write a note, take a quiz or
                    solve a lab and your first XP lands here.
                  </>
                ) : (
                  <>
                    {xpForNextLevel - xpIntoLevel} XP until level {level + 1}
                    {nextRank && (
                      <>
                        , and {nextRank.minLevel - level} level
                        {nextRank.minLevel - level === 1 ? "" : "s"} until{" "}
                        <strong className="font-semibold text-on-surface">
                          {nextRank.title}
                        </strong>
                      </>
                    )}
                    .
                  </>
                )}
              </p>
              <div className="max-w-sm space-y-1 pt-1">
                <ProgressBar value={levelPercent} label="Level progress" />
                <div className="flex justify-between font-label-badge text-label-badge text-on-surface-variant">
                  <span>{xp.toLocaleString()} XP total</span>
                  <span>
                    {xpIntoLevel}/{xpForNextLevel} this level
                  </span>
                </div>
              </div>
            </div>
          </div>

          <ProgressRing value={levelPercent} size={150} stroke={13}>
            <span className="font-headline-lg text-headline-lg font-bold leading-none text-on-surface">
              {levelPercent}%
            </span>
            <span className="font-label-badge text-label-badge uppercase tracking-wider text-on-surface-variant">
              to level {level + 1}
            </span>
          </ProgressRing>
        </div>
      </Panel>

      {/* Stats */}
      <section className="grid grid-cols-2 gap-space-md lg:grid-cols-3 xl:grid-cols-6">
        <StatCard emoji="🎀" label="XP" value={xp.toLocaleString()} />
        <StatCard emoji="🔥" label="Streak" value={`${streak}d`} />
        <StatCard emoji="📝" label="Notes" value={notes.length} />
        <StatCard
          emoji="✨"
          label="Quiz Accuracy"
          value={quizAccuracy === null ? "—" : `${quizAccuracy}%`}
        />
        <StatCard emoji="🎓" label="Exams Done" value={examsCompleted} />
        <StatCard emoji="🛡️" label="Labs Solved" value={labsSolved.length} />
      </section>

      {/* Roadmap */}
      <Panel className="flex flex-col gap-space-lg">
        <SectionHeading
          eyebrow="Roadmap"
          title="From Sprout to VAPT Apprentice"
          size="md"
          description={`Five ranks, each unlocking a deeper layer of the stack. ${mastered} topic${mastered === 1 ? "" : "s"} above 80% so far.`}
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
    </>
  );
}

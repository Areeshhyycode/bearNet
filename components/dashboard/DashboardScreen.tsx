"use client";

import { HeroBanner } from "./HeroBanner";
import { ModuleCard } from "./ModuleCard";
import { TipOfTheDay } from "./TipOfTheDay";
import { ExamCountdown } from "./ExamCountdown";
import { NotesModuleInset, RecentNotesSection } from "./NotesSummary";
import { JourneyTrack } from "@/components/progress/JourneyTrack";
import { InsetBox, Panel } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatCard } from "@/components/ui/stat-card";
import { useNotes } from "@/lib/notes-store";
import { useProgress } from "@/lib/progress-store";

export function DashboardScreen() {
  const { notes, topics } = useNotes();
  const {
    xp,
    level,
    rank,
    xpIntoLevel,
    xpForNextLevel,
    streak,
    quizAccuracy,
    quizzesCompleted,
    examsCompleted,
    labsSolved,
    topicMastery,
    runs,
  } = useProgress();

  const activeTopics = topics.filter((t) => t.noteCount > 0).length;
  const mastered = topicMastery.filter((t) => t.percent >= 80).length;
  const lastRun = runs[0];
  const weakest = [...topicMastery].sort((a, b) => a.percent - b.percent)[0];

  return (
    <>
      <HeroBanner />

      {/* Quick stats */}
      <section className="grid grid-cols-2 gap-space-md lg:grid-cols-4">
        <StatCard
          emoji="🎀"
          label="Total XP"
          value={xp.toLocaleString()}
          caption={`${xpForNextLevel - xpIntoLevel} XP to level ${level + 1}`}
        />
        <StatCard
          emoji="🔥"
          label="Learning Streak"
          value={streak === 0 ? "—" : `${streak} day${streak === 1 ? "" : "s"}`}
          caption={streak === 0 ? "Study today to start one" : "Keep it going"}
        />
        <StatCard
          emoji="🌱"
          label="Topics Mastered"
          value={`${mastered}/${topics.length}`}
          caption="Above 80% accuracy"
        />
        <StatCard
          emoji="📝"
          label="Notes Saved"
          value={notes.length}
          caption={`${activeTopics} topic${activeTopics === 1 ? "" : "s"} in use`}
        />
      </section>

      {/* Core modules */}
      <section className="flex flex-col gap-space-lg">
        <SectionHeading
          eyebrow="Daily Study Stations"
          title="Interactive Learning Modules"
          description="Crafted for calm concentration and network certification mastery."
        />

        <div className="grid grid-cols-1 gap-space-lg md:grid-cols-2 xl:grid-cols-3">
          <ModuleCard
            href="/notes"
            emoji="📝"
            bearEmoji="🐻"
            title="My Notes"
            description="Write and organize what I learn."
            cta={notes.length === 0 ? "Write my first note" : "Open Notes"}
            footnote="Everything else in BearNet is built from what you write here."
          >
            <NotesModuleInset />
          </ModuleCard>

          <ModuleCard
            href="/tutor"
            emoji="🤖"
            bearEmoji="🐼"
            title="AI Tutor"
            description="Ask questions and learn from notes."
            cta="Chat with Panda"
            tone="strong"
            online
            footnote="Answers are grounded in your own notes, and Panda says which one it used."
          >
            <InsetBox className="space-y-2">
              <p className="flex items-center gap-1.5 font-body-sm text-body-sm text-on-surface">
                <span aria-hidden>💬</span>{" "}
                {notes.length === 0
                  ? "Panda is online — ask anything about networking"
                  : `Panda can read your ${notes.length} note${notes.length === 1 ? "" : "s"}`}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {["Explain simply", "Quiz me", "Give an example"].map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full bg-surface-container-lowest px-2.5 py-1 font-label-badge text-label-badge text-on-surface-variant shadow-sm"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </InsetBox>
          </ModuleCard>

          <ModuleCard
            href="/quiz"
            emoji="🧠"
            bearEmoji="💡"
            title="Quiz Me"
            description="Test what I actually remember."
            cta={quizzesCompleted === 0 ? "Try my first quiz" : "Start Quick Quiz"}
          >
            <InsetBox className="space-y-1.5">
              <div className="flex items-center justify-between font-label-badge text-label-badge text-on-surface-variant">
                <span>Active Recall Sprint</span>
                <span className="font-bold text-tertiary">
                  {quizzesCompleted} done
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface">
                {weakest ? (
                  <>
                    Weakest topic:{" "}
                    <strong className="font-semibold">{weakest.topic}</strong> at{" "}
                    {weakest.percent}%
                  </>
                ) : (
                  "Questions are generated from your notes."
                )}
              </p>
            </InsetBox>
            <div className="flex items-center gap-3 pt-1 font-body-sm text-body-sm text-on-surface-variant">
              <span className="flex items-center gap-1">
                <span aria-hidden>✨</span>{" "}
                {quizAccuracy === null ? "No score yet" : `${quizAccuracy}% accuracy`}
              </span>
              {lastRun && (
                <span className="flex items-center gap-1">
                  <span aria-hidden>🔥</span> Last {lastRun.score}/{lastRun.total}
                </span>
              )}
            </div>
          </ModuleCard>

          <ModuleCard
            href="/exam"
            emoji="🎓"
            bearEmoji="🎀"
            title="AI Exam"
            description="Exam simulated on your knowledge."
            cta={examsCompleted === 0 ? "Enter Exam Room" : "Take another exam"}
            footnote="Answers stay hidden until the end, then you get a full breakdown."
          >
            <InsetBox className="space-y-1.5">
              <div className="flex items-center justify-between font-label-badge text-label-badge text-on-surface-variant">
                <span>Exams taken</span>
                <span className="font-bold text-on-surface">{examsCompleted}</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface">
                <strong>CompTIA Net+ style</strong>
              </p>
              <div className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant">
                <span>📜 5–20 questions</span>
                <span aria-hidden>•</span>
                <span>80% pass req</span>
              </div>
            </InsetBox>
          </ModuleCard>

          <ModuleCard
            href="/lab"
            emoji="💻"
            bearEmoji="🐻‍❄️"
            title="Pink Bear Cyber Lab"
            description="Hands-on networking challenges."
            cta="Launch Cyber Lab"
            tone="strong"
            footnote="A simulated shell that answers real commands — nothing touches a live network."
          >
            <div className="space-y-1 rounded-xl bg-inverse-surface p-3 font-label-code text-label-code text-inverse-on-surface shadow-inner">
              <div className="flex items-center justify-between text-[11px] text-tertiary-fixed-dim">
                <span>🚨 Active Scenario</span>
                <span>{labsSolved.length} solved</span>
              </div>
              <p className="truncate text-[12px] font-medium text-surface">
                Something is wrong with the network!
              </p>
              <div className="flex items-center gap-2 pt-1 text-[11px] text-primary-fixed">
                <span className="rounded bg-primary/40 px-1.5 py-0.5">ping 8.8.8.8</span>
                <span className="rounded bg-primary/40 px-1.5 py-0.5">traceroute</span>
              </div>
            </div>
          </ModuleCard>

          <ModuleCard
            href="/progress"
            emoji="🌱"
            bearEmoji="📊"
            title="My Progress"
            description="See mastery and areas to revise."
            cta="View Full Journey"
            footnote="Every number here comes from what you have actually done."
          >
            <InsetBox className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-label-badge text-label-badge uppercase text-on-surface-variant">
                  Current Rank
                </span>
                <span className="font-body-sm text-body-sm font-bold text-on-surface">
                  Level {level}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl" aria-hidden>
                  {rank.emoji}
                </span>
                <span className="font-headline-md text-[15px] font-bold text-on-surface">
                  {rank.title}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
                <span>Sprout 🌱</span>
                <span>Explorer 🎀</span>
                <span>Defender 🌸</span>
              </div>
            </InsetBox>
          </ModuleCard>
        </div>
      </section>

      {/* Roadmap */}
      <Panel className="flex flex-col gap-space-lg">
        <div className="flex flex-col items-start justify-between gap-space-sm sm:flex-row sm:items-center">
          <div>
            <span className="font-label-badge text-label-badge font-bold uppercase tracking-wider text-tertiary">
              🌷 Roadmap
            </span>
            <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
              Active Learning Journey
            </h2>
          </div>
          <Badge tone="neutral" size="md">
            {rank.emoji} {rank.title} · Level {level}
          </Badge>
        </div>
        <JourneyTrack />
      </Panel>

      <RecentNotesSection />

      {/* Tip + readiness */}
      <section className="grid grid-cols-1 gap-space-lg lg:grid-cols-12">
        <TipOfTheDay />
        <ExamCountdown />
      </section>
    </>
  );
}

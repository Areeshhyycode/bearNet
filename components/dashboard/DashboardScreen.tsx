"use client";

import { HeroBanner } from "./HeroBanner";
import { ModuleCard } from "./ModuleCard";
import { TipOfTheDay } from "./TipOfTheDay";
import { ExamCountdown } from "./ExamCountdown";
import { NotesModuleInset, RecentNotesSection } from "./NotesSummary";
import { RoadmapEditor } from "@/components/roadmap/RoadmapEditor";
import { AIAssistant } from "@/components/roadmap/AIAssistant";
import { InsetBox } from "@/components/ui/card";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatCard } from "@/components/ui/stat-card";
import { useNotes } from "@/lib/notes-store";
import { useProgress } from "@/lib/progress-store";

export function DashboardScreen() {
  const { notes, categories } = useNotes();
  const {
    xp,
    level,
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

  const activeShelves = categories.filter((c) => c.noteCount > 0).length;
  const mastered = topicMastery.filter((t) => t.percent >= 80).length;
  const lastRun = runs[0];
  const weakest = [...topicMastery].sort((a, b) => a.percent - b.percent)[0];
  const publicCount = notes.filter((n) => n.visibility === "public").length;

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
          value={`${mastered}/${Math.max(activeShelves, 1)}`}
          caption="Above 80% accuracy"
        />
        <StatCard
          emoji="📝"
          label="Notes Saved"
          value={notes.length}
          caption={`${publicCount} shared publicly`}
        />
      </section>

      {/* Roadmap + AI assistant */}
      <RoadmapEditor />
      <AIAssistant />

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
            href="/community"
            emoji="🌎"
            bearEmoji="🐼"
            title="Community Notes"
            description="Read what other learners shared."
            cta="Browse community"
            tone="strong"
            footnote="Only notes people deliberately marked public appear here."
          >
            <InsetBox className="space-y-1.5">
              <p className="font-body-sm text-body-sm text-on-surface">
                You have shared{" "}
                <strong className="font-semibold">{publicCount}</strong> note
                {publicCount === 1 ? "" : "s"} publicly.
              </p>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Switch any note to 🌎 Public to add it to the feed.
              </p>
            </InsetBox>
          </ModuleCard>

          <ModuleCard
            href="/tutor"
            emoji="🤖"
            bearEmoji="🐼"
            title="AI Tutor"
            description="Ask questions and learn from notes."
            cta="Chat with Panda"
            online
            footnote="Answers are grounded in your own notes."
          >
            <InsetBox className="space-y-2">
              <p className="flex items-center gap-1.5 font-body-sm text-body-sm text-on-surface">
                <span aria-hidden>💬</span>{" "}
                {notes.length === 0
                  ? "Panda is online — ask anything"
                  : `Panda can read your ${notes.length} note${notes.length === 1 ? "" : "s"}`}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {["Explain simply", "Quiz me"].map((chip) => (
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
                <span className="font-bold text-tertiary">{quizzesCompleted} done</span>
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
            <div className="flex flex-wrap items-center gap-3 pt-1 font-body-sm text-body-sm text-on-surface-variant">
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
            footnote="Answers stay hidden until the end, then a full breakdown."
          >
            <InsetBox className="space-y-1.5">
              <div className="flex items-center justify-between font-label-badge text-label-badge text-on-surface-variant">
                <span>Exams taken</span>
                <span className="font-bold text-on-surface">{examsCompleted}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 font-body-sm text-body-sm text-on-surface-variant">
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
            footnote="A simulated shell that answers real commands."
          >
            <div className="space-y-1 rounded-xl bg-inverse-surface p-3 font-label-code text-label-code text-inverse-on-surface shadow-inner">
              <div className="flex items-center justify-between text-[11px] text-tertiary-fixed-dim">
                <span>🚨 Active Scenario</span>
                <span>{labsSolved.length} solved</span>
              </div>
              <p className="truncate text-[12px] font-medium text-surface">
                Something is wrong with the network!
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-primary-fixed">
                <span className="rounded bg-primary/40 px-1.5 py-0.5">ping 8.8.8.8</span>
                <span className="rounded bg-primary/40 px-1.5 py-0.5">traceroute</span>
              </div>
            </div>
          </ModuleCard>
        </div>
      </section>

      <RecentNotesSection />

      <section className="grid grid-cols-1 gap-space-lg lg:grid-cols-12">
        <TipOfTheDay />
        <ExamCountdown />
      </section>
    </>
  );
}

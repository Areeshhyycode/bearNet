import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageContainer } from "@/components/layout/AppShell";
import { HeroBanner } from "@/components/dashboard/HeroBanner";
import { ModuleCard } from "@/components/dashboard/ModuleCard";
import { TipOfTheDay } from "@/components/dashboard/TipOfTheDay";
import { ExamCountdown } from "@/components/dashboard/ExamCountdown";
import { JourneyTrack } from "@/components/progress/JourneyTrack";
import { InsetBox, Panel } from "@/components/ui/card";
import { Badge, VisibilityBadge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/ui/section-heading";
import { StatCard } from "@/components/ui/stat-card";
import { LEARNER, RECENT_NOTES } from "@/lib/mock-data";
import { formatRelative } from "@/lib/utils";

export default function DashboardPage() {
  return (
    <PageContainer>
      <HeroBanner />

      {/* Quick stats */}
      <section className="grid grid-cols-2 gap-space-md lg:grid-cols-4">
        <StatCard
          emoji="🎀"
          label="Total XP"
          value={LEARNER.xp.toLocaleString()}
          caption={`${LEARNER.xpToNextLevel - LEARNER.xp} XP to level ${LEARNER.level + 1}`}
        />
        <StatCard
          emoji="🔥"
          label="Learning Streak"
          value={`${LEARNER.streak} days`}
          caption="Your longest cozy run yet"
        />
        <StatCard
          emoji="🌱"
          label="Topics Completed"
          value={`${LEARNER.topicsCompleted}/${LEARNER.topicsTotal}`}
          caption="Across 9 networking tracks"
        />
        <StatCard
          emoji="📝"
          label="Notes Saved"
          value={LEARNER.notesSaved}
          caption="4 topics active this week"
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
            cta="Open Notes"
            footnote="Synced with Grizzly's study summaries, subnet cheat-sheets and OSI layer colour codes."
          >
            <InsetBox className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between font-body-sm text-body-sm text-on-surface-variant">
                <span className="font-medium text-on-surface">
                  {LEARNER.notesSaved} Notes saved
                </span>
                <Badge tone="neutral">4 Topics active</Badge>
              </div>
              <div className="flex items-start gap-1.5 pt-1 font-body-sm text-body-sm text-on-surface">
                <span className="text-tertiary" aria-hidden>
                  📌
                </span>
                <span className="truncate">
                  Recent:{" "}
                  <strong className="font-semibold">
                    TCP 3-Way Handshake vs UDP
                  </strong>
                </span>
              </div>
            </InsetBox>
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
            footnote="Contextual study buddy grounded entirely in your own notes."
          >
            <InsetBox className="space-y-2">
              <p className="flex items-center gap-1.5 font-body-sm text-body-sm text-on-surface">
                <span aria-hidden>💬</span> Panda is online and ready for subnet
                queries!
              </p>
              <div className="flex flex-wrap gap-1.5">
                {["Summarize DNS", "Explain MAC vs IP Simply"].map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full bg-surface-container-lowest px-2.5 py-1 font-label-badge text-label-badge text-on-surface-variant shadow-sm transition-colors hover:text-primary"
                  >
                    &ldquo;{chip}&rdquo;
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
            cta="Start Quick Quiz"
          >
            <InsetBox className="space-y-1.5">
              <div className="flex items-center justify-between font-label-badge text-label-badge text-on-surface-variant">
                <span>Active Recall Sprint</span>
                <span className="font-bold text-tertiary">5 Mins</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface">
                10-question flash drill:{" "}
                <strong className="font-semibold">
                  Common Ports (80, 443, 53, 22, 21)
                </strong>
              </p>
            </InsetBox>
            <div className="flex items-center gap-3 pt-1 font-body-sm text-body-sm text-on-surface-variant">
              <span className="flex items-center gap-1">
                <span aria-hidden>✨</span> {LEARNER.quizAccuracy}% Accuracy
              </span>
              <span className="flex items-center gap-1">
                <span aria-hidden>🔥</span> 12 Streak
              </span>
            </div>
          </ModuleCard>

          <ModuleCard
            href="/exam"
            emoji="🎓"
            bearEmoji="🎀"
            title="AI Exam"
            description="Exam simulated on your knowledge."
            cta="Enter Exam Room"
            footnote="Full proctored environment simulation with a detailed breakdown on finish."
          >
            <InsetBox className="space-y-1.5">
              <div className="flex items-center justify-between font-label-badge text-label-badge text-on-surface-variant">
                <span>Next Milestone</span>
                <span className="font-bold text-on-surface">
                  CompTIA Net+ style
                </span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface">
                <strong>Network Fundamentals Midterm</strong>
              </p>
              <div className="flex items-center gap-2 font-body-sm text-body-sm text-on-surface-variant">
                <span>📜 50 questions</span>
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
            footnote="Simulated browser terminal with a cozy Wireshark-style packet inspector."
          >
            <div className="space-y-1 rounded-xl bg-inverse-surface p-3 font-label-code text-label-code text-inverse-on-surface shadow-inner">
              <div className="flex items-center justify-between text-[11px] text-tertiary-fixed-dim">
                <span>🚨 Active Scenario</span>
                <span>Polar Lab v1.8</span>
              </div>
              <p className="truncate text-[12px] font-medium text-surface">
                Web Server Unreachable: Simulated Terminal
              </p>
              <div className="flex items-center gap-2 pt-1 text-[11px] text-primary-fixed">
                <span className="rounded bg-primary/40 px-1.5 py-0.5">
                  ping 192.168.1.1
                </span>
                <span className="rounded bg-primary/40 px-1.5 py-0.5">
                  traceroute
                </span>
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
            footnote="18 subnetting drills mastered. 2 OSI review sessions recommended this weekend."
          >
            <InsetBox className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-label-badge text-label-badge uppercase text-on-surface-variant">
                  Current Rank
                </span>
                <span className="font-body-sm text-body-sm font-bold text-on-surface">
                  Level {LEARNER.level}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xl" aria-hidden>
                  🎀
                </span>
                <span className="font-headline-md text-[15px] font-bold text-on-surface">
                  {LEARNER.rank}
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
          <div className="flex items-center gap-2 rounded-full bg-surface-container-low px-3 py-1.5 font-body-sm text-body-sm text-on-surface-variant">
            <span>Overall Certificate Path:</span>
            <strong className="font-semibold text-on-surface">
              42% Completed
            </strong>
          </div>
        </div>
        <JourneyTrack />
      </Panel>

      {/* Recent notes */}
      <section className="flex flex-col gap-space-lg">
        <SectionHeading
          eyebrow="Straight from your notebook"
          title="Recent Notes"
          size="md"
          aside={
            <Link
              href="/notes"
              className="inline-flex items-center gap-1 rounded-full bg-surface-container-low px-3 py-1.5 font-body-sm text-body-sm font-semibold text-on-surface-variant transition-colors hover:text-primary"
            >
              Browse all notes <ArrowRight className="h-4 w-4" />
            </Link>
          }
        />
        <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2 xl:grid-cols-4">
          {RECENT_NOTES.map((note) => (
            <Link
              key={note.id}
              href={`/notes/${note.id}`}
              className="group flex flex-col gap-2 rounded-[22px] bg-surface-container-lowest p-space-md shadow-cozy transition-all duration-300 hover:-translate-y-1 hover:shadow-float"
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-xl" aria-hidden>
                  {note.emoji}
                </span>
                <VisibilityBadge visibility={note.visibility} />
              </div>
              <h3 className="font-headline-md text-[15px] font-bold leading-snug text-on-surface">
                {note.title}
              </h3>
              <p className="line-clamp-2 font-body-sm text-body-sm text-on-surface-variant">
                {note.preview}
              </p>
              <div className="mt-auto flex items-center justify-between pt-2 font-label-badge text-label-badge text-on-surface-variant">
                <span>{note.topic}</span>
                <span>{formatRelative(note.updatedAt)}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Tip + countdown */}
      <section className="grid grid-cols-1 gap-space-lg lg:grid-cols-12">
        <TipOfTheDay />
        <ExamCountdown />
      </section>
    </PageContainer>
  );
}

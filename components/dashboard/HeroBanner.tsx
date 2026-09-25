"use client";

import Link from "next/link";
import { BearStudyScene } from "@/components/bears/BearStudyScene";
import { ProgressBar } from "@/components/ui/progress";
import { useAuth } from "@/lib/auth-context";
import { useNotes } from "@/lib/notes-store";
import { useProgress } from "@/lib/progress-store";
import { useRoadmap } from "@/lib/roadmap-store";
import { FocusTimer } from "./FocusTimer";
import { LofiPlayer } from "./LofiPlayer";

function greeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

/** Personal greeting, today's focus, and the workspace tools. */
export function HeroBanner() {
  const { user } = useAuth();
  const { notes } = useNotes();
  const { preferences, minutesToday, topicMastery, streak, rank } = useProgress();
  const { roadmap } = useRoadmap();

  const goal = preferences.dailyGoalMinutes;
  const percent = Math.min(100, Math.round((minutesToday / goal) * 100));
  const weakest = [...topicMastery].sort((a, b) => a.percent - b.percent)[0];
  const nextStep = roadmap?.items.find((item) => !item.completed);

  const focus =
    notes.length === 0
      ? {
          emoji: "✏️",
          title: "Write your first note",
          href: "/notes/new",
          milestone: "Unlock personalised quizzes",
        }
      : weakest && weakest.percent < 80
        ? {
            emoji: "🎯",
            title: `Revise ${weakest.topic} — ${weakest.percent}% so far`,
            href: "/quiz",
            milestone: `Get ${weakest.topic} above 80%`,
          }
        : nextStep
          ? {
              emoji: "🌱",
              title: `Next on your roadmap: ${nextStep.title}`,
              href: "/notes/new",
              milestone: "Write a note on it",
            }
          : {
              emoji: "🎓",
              title: "Take a full exam run",
              href: "/exam",
              milestone: `Next rank after ${rank.title}`,
            };

  return (
    <section className="relative w-full overflow-hidden rounded-[28px] bg-surface-container-low p-space-md shadow-hero sm:p-space-xl">
      <div className="pointer-events-none absolute -right-16 -top-16 h-80 w-80 rounded-full bg-primary-container/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-12 h-72 w-72 rounded-full bg-secondary-container/30 blur-3xl" />

      <div className="relative z-10 grid grid-cols-1 items-start gap-space-lg lg:grid-cols-12">
        <div className="flex min-w-0 flex-col gap-space-md lg:col-span-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-highest px-3 py-1 font-label-badge text-label-badge uppercase tracking-wider text-on-surface">
              <span className="text-tertiary" aria-hidden>
                ✦
              </span>{" "}
              BearNet Study Hub
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-fixed px-3 py-1 font-body-sm text-body-sm font-medium text-on-primary-fixed">
              <span aria-hidden>{rank.emoji}</span> {rank.title}
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="font-headline-xl text-headline-xl-mobile font-bold tracking-tight text-on-surface sm:text-headline-xl">
              🎀 {greeting()}, {user?.name?.split(" ")[0] ?? "friend"}
            </h1>
            <p className="max-w-xl font-body-lg text-body-lg text-on-surface-variant">
              {notes.length === 0
                ? "Welcome to your cozy cyber sanctuary. Start by writing down one thing you learned."
                : `${streak > 1 ? `${streak} days running. ` : ""}Your notes, roadmap and labs are all ready.`}
            </p>
          </div>

          {/* Today's focus */}
          <div className="flex flex-col gap-space-md rounded-[22px] bg-surface-container-lowest p-space-md shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-space-sm">
              <div className="flex min-w-0 items-center gap-2">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-fixed font-body-sm text-body-sm text-on-primary-fixed">
                  {focus.emoji}
                </span>
                <div className="min-w-0">
                  <div className="font-body-sm text-body-sm font-semibold uppercase tracking-wider text-on-surface-variant">
                    Today&apos;s Focus Goal
                  </div>
                  <Link
                    href={focus.href}
                    className="block truncate font-headline-md text-[16px] font-semibold text-on-surface transition-colors hover:text-primary"
                  >
                    {focus.title}
                  </Link>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-1.5 rounded-full bg-surface-container-high px-3 py-1 font-label-code text-label-code text-on-surface">
                <span aria-hidden>⏱️</span> {minutesToday}/{goal} min
              </div>
            </div>

            <ProgressBar value={percent} label="Today's study goal" />

            <span className="flex items-center gap-1 font-body-sm text-body-sm text-on-surface-variant">
              <span aria-hidden>🌸</span> Next: {focus.milestone}
            </span>
          </div>

          {/* Workspace tools */}
          <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2">
            <FocusTimer />
            <LofiPlayer />
          </div>
        </div>

        {/* Illustration */}
        <div className="relative flex flex-col items-center justify-center lg:col-span-6">
          <div className="group w-full max-w-[560px] overflow-hidden rounded-[24px] bg-surface-container-lowest p-2 shadow-[0_16px_36px_-8px_rgba(232,165,184,0.35)]">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[20px] bg-surface-container-high">
              <BearStudyScene className="transition-transform duration-500 group-hover:scale-[1.02]" />
              <div className="absolute inset-x-3 bottom-3 flex items-center justify-between gap-2 rounded-xl bg-surface-container-lowest/90 px-3 py-2 text-on-surface shadow-sm backdrop-blur-md">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="h-2.5 w-2.5 shrink-0 animate-pulse rounded-full bg-tertiary" />
                  <span className="truncate font-body-sm text-body-sm font-medium">
                    Bears Study Lab · {rank.title}
                  </span>
                </div>
                <span className="hidden shrink-0 font-label-code text-label-code text-on-surface-variant sm:inline">
                  {notes.length} note{notes.length === 1 ? "" : "s"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

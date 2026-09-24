import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ProgressBar, ProgressRing } from "@/components/ui/progress";
import { BearMascot } from "@/components/bears/BearMascot";
import { EXAM_RESULT } from "@/lib/mock-data";

/** Result screen — score dial, strong topics, revision list. */
export function ExamResult() {
  return (
    <div className="flex flex-col gap-space-lg">
      {/* Score header */}
      <div className="relative overflow-hidden rounded-[28px] bg-surface-container-low p-space-md shadow-hero sm:p-space-xl">
        <div className="pointer-events-none absolute -right-14 -top-14 h-72 w-72 rounded-full bg-primary-container/25 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center gap-space-lg lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-space-md">
            <BearMascot variant="grizzly" size={96} animated />
            <div className="space-y-1">
              <Badge tone="blush" size="md">
                {EXAM_RESULT.passed ? "🎉 Passed" : "Keep going"} • Network
                Fundamentals Midterm
              </Badge>
              <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">
                🐻 Your Result
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant">
                Finished in {EXAM_RESULT.durationLabel}. That is your best
                midterm run so far — the bears are proud.
              </p>
            </div>
          </div>

          <ProgressRing value={EXAM_RESULT.percent} size={160} stroke={14}>
            <span className="font-headline-xl text-[34px] font-bold leading-none text-on-surface">
              {EXAM_RESULT.score} / {EXAM_RESULT.total}
            </span>
            <span className="mt-1 font-headline-md text-[20px] font-bold text-tertiary">
              {EXAM_RESULT.percent}%
            </span>
          </ProgressRing>
        </div>
      </div>

      {/* Breakdown */}
      <div className="grid grid-cols-1 gap-space-lg lg:grid-cols-3">
        <Card className="flex flex-col gap-space-md">
          <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden>
              🌟
            </span>
            <h3 className="font-headline-md text-[16px] font-bold text-on-surface">
              Strong Topics
            </h3>
          </div>
          {EXAM_RESULT.strongTopics.map((topic) => (
            <div key={topic.title} className="space-y-1.5">
              <div className="flex items-center justify-between font-body-sm text-body-sm">
                <span className="text-on-surface">{topic.title}</span>
                <span className="font-bold text-tertiary">{topic.percent}%</span>
              </div>
              <ProgressBar value={topic.percent} size="sm" />
            </div>
          ))}
        </Card>

        <Card className="flex flex-col gap-space-md">
          <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden>
              🌸
            </span>
            <h3 className="font-headline-md text-[16px] font-bold text-on-surface">
              Topics to Revise
            </h3>
          </div>
          {EXAM_RESULT.reviseTopics.map((topic) => (
            <div key={topic.title} className="space-y-1.5">
              <div className="flex items-center justify-between font-body-sm text-body-sm">
                <span className="text-on-surface">{topic.title}</span>
                <span className="font-bold text-on-surface-variant">
                  {topic.percent}%
                </span>
              </div>
              <ProgressBar
                value={topic.percent}
                size="sm"
                barClassName="bg-tertiary-container"
              />
            </div>
          ))}
          <p className="mt-auto font-body-sm text-body-sm text-on-surface-variant">
            Two short sessions this weekend should close the gap.
          </p>
        </Card>

        <Card className="flex flex-col gap-space-md">
          <div className="flex items-center gap-2">
            <span className="text-xl" aria-hidden>
              📚
            </span>
            <h3 className="font-headline-md text-[16px] font-bold text-on-surface">
              Recommended Notes
            </h3>
          </div>
          {EXAM_RESULT.recommendedNotes.map((note) => (
            <Link
              key={note.id}
              href={`/notes/${note.id}`}
              className="group flex items-center gap-2 rounded-xl bg-surface-container-low px-3 py-2.5 font-body-sm text-body-sm text-on-surface transition-all hover:-translate-y-0.5 hover:bg-primary-fixed"
            >
              <span aria-hidden>{note.emoji}</span>
              <span className="min-w-0 flex-1 truncate">{note.title}</span>
              <ArrowRight className="h-4 w-4 shrink-0 text-on-surface-variant transition-transform group-hover:translate-x-1" />
            </Link>
          ))}
          <div className="mt-auto flex flex-col gap-2 pt-1">
            <Button variant="secondary" block href="/tutor">
              🐼 Revise with Panda
            </Button>
            <Button variant="ghost" block>
              Download result card
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}

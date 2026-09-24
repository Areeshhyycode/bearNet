import { BearStudyScene } from "@/components/bears/BearStudyScene";
import { ProgressBar } from "@/components/ui/progress";
import { TODAY_CHALLENGE } from "@/lib/mock-data";
import { PomodoroTimer } from "./PomodoroTimer";

/** Welcome banner: greeting, today's focus goal and the bear study scene. */
export function HeroBanner() {
  return (
    <section className="relative w-full overflow-hidden rounded-[28px] bg-surface-container-low p-space-md shadow-hero sm:p-space-xl">
      {/* Ambient blush glow */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-80 w-80 rounded-full bg-primary-container/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-12 h-72 w-72 rounded-full bg-secondary-container/30 blur-3xl" />

      <div className="relative z-10 grid grid-cols-1 items-center gap-space-lg lg:grid-cols-12">
        {/* Text & status */}
        <div className="flex flex-col gap-space-md lg:col-span-6">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-highest px-3 py-1 font-label-badge text-label-badge uppercase tracking-wider text-on-surface">
              <span className="text-tertiary" aria-hidden>
                ✦
              </span>{" "}
              BearNet Study Hub
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary-fixed px-3 py-1 font-body-sm text-body-sm font-medium text-on-primary-fixed">
              <span aria-hidden>🐻</span> Learning networking, one concept at a
              time
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="flex items-center gap-2 font-headline-xl text-headline-xl-mobile font-bold tracking-tight text-on-surface sm:text-headline-xl">
              <span aria-hidden>🎀</span> My Learning Hub
            </h1>
            <p className="max-w-xl font-body-lg text-body-lg text-on-surface-variant">
              Welcome back to your cozy cyber sanctuary. Polar, Panda and
              Grizzly have prepared your notes, packet labs and daily protocol
              review.
            </p>
          </div>

          {/* Today's focus */}
          <div className="flex flex-col gap-space-md rounded-[22px] bg-surface-container-lowest p-space-md shadow-soft sm:p-space-lg">
            <div className="flex flex-wrap items-center justify-between gap-space-sm">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-fixed font-body-sm text-body-sm text-on-primary-fixed">
                  {TODAY_CHALLENGE.emoji}
                </span>
                <div>
                  <div className="font-body-sm text-body-sm font-semibold uppercase tracking-wider text-on-surface-variant">
                    Today&apos;s Focus Goal
                  </div>
                  <div className="font-headline-md text-[16px] font-semibold text-on-surface">
                    {TODAY_CHALLENGE.title}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1.5 rounded-full bg-surface-container-high px-3 py-1 font-label-code text-label-code text-on-surface">
                <span aria-hidden>⏱️</span> {TODAY_CHALLENGE.percent}% Completed
              </div>
            </div>

            <ProgressBar
              value={TODAY_CHALLENGE.percent}
              label="Today's focus goal progress"
            />

            <div className="flex flex-wrap items-center justify-between gap-space-sm pt-1">
              <PomodoroTimer />
              <span className="flex items-center gap-1 font-body-sm text-body-sm text-on-surface-variant">
                <span aria-hidden>🌸</span> Next milestone:{" "}
                {TODAY_CHALLENGE.nextMilestone}
              </span>
            </div>
          </div>
        </div>

        {/* Mascot illustration */}
        <div className="relative flex flex-col items-center justify-center lg:col-span-6">
          <div className="group w-full max-w-[560px] overflow-hidden rounded-[24px] bg-surface-container-lowest p-2 shadow-[0_16px_36px_-8px_rgba(232,165,184,0.35)]">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[20px] bg-surface-container-high">
              <BearStudyScene className="transition-transform duration-500 group-hover:scale-[1.02]" />
              <div className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-xl bg-surface-container-lowest/90 px-3 py-2 text-on-surface shadow-sm backdrop-blur-md">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-tertiary" />
                  <span className="font-body-sm text-body-sm font-medium">
                    Bears Study Lab: Active Room #04
                  </span>
                </div>
                <span className="hidden font-label-code text-label-code text-on-surface-variant sm:inline">
                  3 Peers Online
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

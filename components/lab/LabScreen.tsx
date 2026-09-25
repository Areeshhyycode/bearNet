"use client";

import { useState } from "react";
import { Check, Lock, X } from "lucide-react";
import { PageHeading, SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OptionCard } from "@/components/ui/option-card";
import { ProgressBar } from "@/components/ui/progress";
import { BearMascot } from "@/components/bears/BearMascot";
import { TerminalSim } from "./TerminalSim";
import { PacketInspector } from "./PacketInspector";
import { LAB_SCENARIOS } from "@/lib/mock-data";
import { XP, useProgress } from "@/lib/progress-store";
import { cn } from "@/lib/utils";

export function LabScreen() {
  const { labsSolved, recordLabSolved } = useProgress();
  const [activeId, setActiveId] = useState(LAB_SCENARIOS[0].id);
  const [picked, setPicked] = useState<string>();
  const [checked, setChecked] = useState(false);
  const [commandsRun, setCommandsRun] = useState<string[]>([]);

  const scenario = LAB_SCENARIOS.find((s) => s.id === activeId) ?? LAB_SCENARIOS[0];
  const solved = labsSolved.includes(scenario.id);
  const isCorrect = picked === scenario.correctId;

  function submit() {
    if (!picked) return;
    setChecked(true);
    if (picked === scenario.correctId) recordLabSolved(scenario.id);
  }

  function selectScenario(id: string) {
    setActiveId(id);
    setPicked(undefined);
    setChecked(false);
    setCommandsRun([]);
  }

  return (
    <>
      <PageHeading
        title={
          <>
            <span aria-hidden>🐻‍❄️</span> Pink Bear Cyber Lab
          </>
        }
        subtitle="Break things safely. Polar sets up the scenario, you run commands in the terminal and work out what went wrong."
        badges={
          <>
            <Badge tone="blush" size="md">
              <span aria-hidden>💻</span> Sandboxed simulator
            </Badge>
            <Badge tone="neutral" size="md">
              {labsSolved.length} of {LAB_SCENARIOS.length} scenarios solved
            </Badge>
          </>
        }
      />

      {/* Scenario + answers */}
      <div className="flex flex-col gap-space-lg rounded-[28px] bg-surface-container-lowest p-space-md shadow-cozy sm:p-space-xl">
        <div className="flex flex-col gap-space-md sm:flex-row sm:items-start">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[20px] bg-surface-container-low">
            <BearMascot variant="polar" size={60} withPlate={false} animated />
          </div>

          <div className="min-w-0 space-y-space-sm">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="berry" size="md">
                <span aria-hidden>🚨</span> {scenario.code}
              </Badge>
              <Badge tone="neutral">{scenario.difficulty}</Badge>
              <Badge tone="outline">⏱️ {scenario.estimate}</Badge>
              {solved && <Badge tone="mint">✓ Solved</Badge>}
            </div>

            <h2 className="font-headline-lg text-headline-lg font-bold leading-snug text-on-surface">
              🚨 {scenario.title}
            </h2>
            <p className="max-w-2xl font-body-md text-body-md leading-relaxed text-on-surface-variant">
              {scenario.brief}
            </p>

            <ul className="flex flex-wrap gap-1.5 pt-1">
              {scenario.hints.map((hint) => (
                <li
                  key={hint}
                  className="rounded-full bg-surface-container-low px-3 py-1 font-body-sm text-body-sm text-on-surface-variant"
                >
                  🔍 {hint}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-space-lg lg:grid-cols-2">
          {/* Terminal */}
          <div className="flex flex-col gap-2">
            <span className="font-label-badge text-label-badge font-semibold uppercase tracking-wider text-on-surface-variant">
              Investigate — {commandsRun.length} command
              {commandsRun.length === 1 ? "" : "s"} run
            </span>
            <TerminalSim
              scenario={scenario}
              onCommandRun={(command) =>
                setCommandsRun((prev) => [...prev, command])
              }
            />
          </div>

          {/* Answers */}
          <div className="flex flex-col gap-space-sm">
            <span className="font-label-badge text-label-badge font-semibold uppercase tracking-wider text-on-surface-variant">
              What do you think is happening?
            </span>

            {scenario.answers.map((answer) => {
              let state: "idle" | "correct" | "incorrect" = "idle";
              if (checked) {
                if (answer.id === scenario.correctId) state = "correct";
                else if (answer.id === picked) state = "incorrect";
              }

              return (
                <OptionCard
                  key={answer.id}
                  emoji={answer.emoji}
                  title={answer.title}
                  caption={answer.caption}
                  selected={picked === answer.id}
                  state={state}
                  onSelect={() => !checked && setPicked(answer.id)}
                />
              );
            })}

            {checked && (
              <div
                className={cn(
                  "flex items-start gap-3 rounded-[20px] p-space-md animate-fade-up",
                  isCorrect ? "bg-[#E4F5EB]" : "bg-error-container/60",
                )}
              >
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                    isCorrect ? "bg-[#8FCBAA] text-white" : "bg-error text-on-error",
                  )}
                >
                  {isCorrect ? (
                    <Check className="h-4 w-4" strokeWidth={3} />
                  ) : (
                    <X className="h-4 w-4" strokeWidth={3} />
                  )}
                </span>
                <div className="min-w-0">
                  <p className="font-body-md text-body-md font-semibold text-on-surface">
                    {isCorrect
                      ? `Solved it! 🎀 +${XP.labSolved} XP`
                      : "Not this time — here's what was happening"}
                  </p>
                  <p className="mt-0.5 font-body-sm text-body-sm leading-relaxed text-on-surface-variant">
                    {scenario.debrief}
                  </p>
                </div>
              </div>
            )}

            <div className="mt-auto flex flex-wrap items-center justify-between gap-space-sm border-t border-outline-variant/40 pt-space-md">
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                🐻‍❄️ Run a few commands before you commit.
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setPicked(undefined);
                    setChecked(false);
                  }}
                >
                  Reset
                </Button>
                <Button variant="primary" onClick={submit} disabled={!picked || checked}>
                  Submit Answer
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scenario shelf + reference */}
      <div className="grid grid-cols-1 gap-space-lg lg:grid-cols-12">
        <div className="flex flex-col gap-space-lg lg:col-span-8">
          <SectionHeading
            eyebrow="Capture"
            title="Cozy packet inspector"
            size="md"
            description="The same capture as a real analyser, minus the intimidating grey grid."
          />
          <PacketInspector />
        </div>

        <div className="flex flex-col gap-space-lg lg:col-span-4">
          <div className="flex flex-col gap-space-sm rounded-[28px] bg-surface-container-low p-space-lg">
            <h3 className="font-headline-md text-[15px] font-bold text-on-surface">
              🧪 Lab Challenges
            </h3>

            {LAB_SCENARIOS.map((item) => {
              const done = labsSolved.includes(item.id);
              const active = item.id === activeId;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => selectScenario(item.id)}
                  className={cn(
                    "flex flex-col gap-2 rounded-[20px] p-space-md text-left shadow-sm transition-all",
                    active
                      ? "bg-primary-fixed ring-2 ring-primary-container"
                      : "bg-surface-container-lowest hover:-translate-y-0.5 hover:shadow-cozy",
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex min-w-0 items-center gap-2">
                      <span className="text-lg" aria-hidden>
                        {item.emoji}
                      </span>
                      <div className="min-w-0">
                        <div className="truncate font-body-md text-body-md font-semibold text-on-surface">
                          {item.title}
                        </div>
                        <div className="truncate font-body-sm text-body-sm text-on-surface-variant">
                          {item.difficulty} · {item.estimate}
                        </div>
                      </div>
                    </div>
                    {done && <Badge tone="mint">Solved</Badge>}
                  </div>
                  <ProgressBar value={done ? 100 : active ? 40 : 0} size="sm" />
                </button>
              );
            })}

            <div className="flex items-center gap-2 rounded-[20px] bg-surface-container-lowest/60 p-space-md opacity-70">
              <Lock className="h-4 w-4 shrink-0 text-on-surface-variant" />
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                More scenarios unlock as the lab grows.
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-space-sm rounded-[28px] bg-primary-fixed p-space-lg">
            <h3 className="font-headline-md text-[15px] font-bold text-on-primary-fixed">
              🧭 Polar&apos;s troubleshooting order
            </h3>
            <ol className="space-y-1.5 font-body-sm text-body-sm text-on-primary-fixed/90">
              <li>1. Is the link up? (layer 1)</li>
              <li>2. Do you have an address and a gateway? (layer 3)</li>
              <li>3. Can you reach an IP without a name? (routing)</li>
              <li>4. Can you resolve a name? (DNS)</li>
              <li>5. Is the port actually open? (layer 4)</li>
            </ol>
            <p className="pt-1 font-body-sm text-body-sm text-on-primary-fixed/80">
              Work bottom-up and you will rarely guess.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

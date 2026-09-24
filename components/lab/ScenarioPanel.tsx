"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OptionCard } from "@/components/ui/option-card";
import { BearMascot } from "@/components/bears/BearMascot";
import { LAB_SCENARIO } from "@/lib/mock-data";

/**
 * Troubleshooting scenario with answer cards.
 * Picking one only highlights it — no grading happens yet.
 */
export function ScenarioPanel() {
  const [picked, setPicked] = useState<string>();

  return (
    <div className="flex flex-col gap-space-lg rounded-[28px] bg-surface-container-lowest p-space-md shadow-cozy sm:p-space-xl">
      {/* Brief */}
      <div className="flex flex-col gap-space-md sm:flex-row sm:items-start">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-[20px] bg-surface-container-low">
          <BearMascot variant="polar" size={60} withPlate={false} animated />
        </div>

        <div className="min-w-0 space-y-space-sm">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="berry" size="md">
              <span aria-hidden>🚨</span> Active scenario {LAB_SCENARIO.code}
            </Badge>
            <Badge tone="neutral">{LAB_SCENARIO.difficulty}</Badge>
            <Badge tone="outline">⏱️ {LAB_SCENARIO.estimate}</Badge>
          </div>

          <h2 className="font-headline-lg text-headline-lg font-bold leading-snug text-on-surface">
            🚨 {LAB_SCENARIO.title}
          </h2>
          <p className="max-w-2xl font-body-md text-body-md leading-relaxed text-on-surface-variant">
            {LAB_SCENARIO.brief}
          </p>

          <ul className="flex flex-wrap gap-1.5 pt-1">
            {LAB_SCENARIO.hints.map((hint) => (
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

      {/* Answers */}
      <div className="space-y-space-sm">
        <span className="font-label-badge text-label-badge font-semibold uppercase tracking-wider text-on-surface-variant">
          What do you think is happening?
        </span>
        <div className="grid grid-cols-1 gap-space-sm md:grid-cols-2">
          {LAB_SCENARIO.answers.map((answer) => (
            <OptionCard
              key={answer.id}
              emoji={answer.emoji}
              title={answer.title}
              caption={answer.caption}
              selected={picked === answer.id}
              onSelect={() => setPicked(answer.id)}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-space-sm border-t border-outline-variant/40 pt-space-md">
        <p className="font-body-sm text-body-sm text-on-surface-variant">
          🐻‍❄️ Polar will explain the fix step by step once the lab engine lands.
        </p>
        <div className="flex items-center gap-2">
          <Button variant="ghost" onClick={() => setPicked(undefined)}>
            Clear
          </Button>
          <Button variant="primary">Submit Answer</Button>
        </div>
      </div>
    </div>
  );
}

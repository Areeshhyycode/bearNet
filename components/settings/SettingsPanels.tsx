"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Field, Input, Toggle } from "@/components/ui/field";
import { Segmented } from "@/components/ui/segmented";
import { BearMascot, type BearVariant } from "@/components/bears/BearMascot";
import { LEARNER } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const BUDDIES: { id: BearVariant; name: string; role: string }[] = [
  { id: "grizzly", name: "Grizzly", role: "Notes & revision" },
  { id: "panda", name: "Panda", role: "AI tutoring" },
  { id: "polar", name: "Polar", role: "Cyber lab" },
];

const THEMES = [
  { value: "blush", label: "Blush", emoji: "🎀" },
  { value: "cream", label: "Cream", emoji: "🍮" },
  { value: "lavender", label: "Lavender", emoji: "💜" },
];

/** Settings surfaces — every control is local UI state only. */
export function SettingsPanels() {
  const [buddy, setBuddy] = useState<BearVariant>("panda");
  const [theme, setTheme] = useState("blush");
  const [dailyGoal, setDailyGoal] = useState("45");
  const [toggles, setToggles] = useState({
    reminders: true,
    sounds: false,
    publicProfile: false,
    weeklyDigest: true,
    reducedMotion: false,
  });

  const setToggle = (key: keyof typeof toggles) => (next: boolean) =>
    setToggles((prev) => ({ ...prev, [key]: next }));

  return (
    <div className="grid grid-cols-1 gap-space-lg lg:grid-cols-12">
      {/* Profile */}
      <div className="flex flex-col gap-space-md rounded-[28px] bg-surface-container-lowest p-space-lg shadow-cozy lg:col-span-7">
        <h2 className="font-headline-md text-[17px] font-bold text-on-surface">
          🎀 Profile
        </h2>

        <div className="flex items-center gap-space-md rounded-[20px] bg-surface-container-low p-space-md">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary font-headline-md text-headline-md font-bold text-on-primary">
            {LEARNER.name.slice(0, 1)}
          </div>
          <div className="min-w-0">
            <div className="font-headline-md text-[16px] font-bold text-on-surface">
              {LEARNER.name}
            </div>
            <div className="font-body-sm text-body-sm text-on-surface-variant">
              {LEARNER.handle} • {LEARNER.rank}
            </div>
            <div className="mt-1 flex flex-wrap gap-1.5">
              <Badge tone="blush">Level {LEARNER.level}</Badge>
              <Badge tone="lavender">{LEARNER.xp.toLocaleString()} XP</Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2">
          <Field label="Display name">
            <Input defaultValue={LEARNER.name} placeholder="Your name" />
          </Field>
          <Field label="Study handle">
            <Input defaultValue={LEARNER.handle} placeholder="@bearnet" />
          </Field>
        </div>

        <Field
          label="Daily study goal (minutes)"
          hint="Used for streaks and the weekly activity chart."
        >
          <Input
            value={dailyGoal}
            onChange={(event) => setDailyGoal(event.target.value)}
            inputMode="numeric"
          />
        </Field>

        <Field label="Certification target">
          <Input defaultValue="CompTIA Network+ N10-008" />
        </Field>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <Button variant="primary">Save changes</Button>
          <Button variant="ghost">Discard</Button>
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            Nothing is stored yet — persistence arrives with the backend.
          </span>
        </div>
      </div>

      {/* Study buddy + theme */}
      <div className="flex flex-col gap-space-lg lg:col-span-5">
        <div className="flex flex-col gap-space-md rounded-[28px] bg-surface-container-lowest p-space-lg shadow-cozy">
          <h2 className="font-headline-md text-[17px] font-bold text-on-surface">
            🐻 Favourite study buddy
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {BUDDIES.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setBuddy(item.id)}
                aria-pressed={buddy === item.id}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-[20px] p-3 transition-all active:scale-[0.98]",
                  buddy === item.id
                    ? "bg-primary-fixed shadow-soft ring-2 ring-primary-container"
                    : "bg-surface-container-low hover:bg-surface-container-high",
                )}
              >
                <BearMascot
                  variant={item.id}
                  size={54}
                  withPlate={false}
                  animated={buddy === item.id}
                />
                <span className="font-body-sm text-body-sm font-semibold text-on-surface">
                  {item.name}
                </span>
                <span className="text-center font-label-badge text-label-badge text-on-surface-variant">
                  {item.role}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-space-md rounded-[28px] bg-surface-container-lowest p-space-lg shadow-cozy">
          <h2 className="font-headline-md text-[17px] font-bold text-on-surface">
            🎨 Appearance
          </h2>
          <Field label="Accent wash">
            <Segmented
              options={THEMES}
              value={theme}
              onChange={setTheme}
              label="Accent wash"
              className="w-full"
            />
          </Field>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            BearNet stays light and cozy by design — no harsh dark terminal
            themes here.
          </p>
        </div>

        <div className="flex flex-col gap-space-sm rounded-[28px] bg-surface-container-lowest p-space-lg shadow-cozy">
          <h2 className="font-headline-md text-[17px] font-bold text-on-surface">
            🔔 Preferences
          </h2>

          {(
            [
              {
                key: "reminders",
                title: "Daily study reminder",
                caption: "A gentle nudge at 7pm",
              },
              {
                key: "sounds",
                title: "Soft UI sounds",
                caption: "Paper rustles and tiny chimes",
              },
              {
                key: "weeklyDigest",
                title: "Weekly progress digest",
                caption: "Sunday recap from the bears",
              },
              {
                key: "publicProfile",
                title: "Public study profile",
                caption: "Share your rank and badges",
              },
              {
                key: "reducedMotion",
                title: "Reduced motion",
                caption: "Calm the floating bears",
              },
            ] as const
          ).map((row) => (
            <div
              key={row.key}
              className="flex items-center justify-between gap-space-md rounded-[18px] bg-surface-container-low px-space-md py-3"
            >
              <div className="min-w-0">
                <div className="font-body-md text-body-md font-semibold text-on-surface">
                  {row.title}
                </div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">
                  {row.caption}
                </div>
              </div>
              <Toggle
                checked={toggles[row.key]}
                onChange={setToggle(row.key)}
                label={row.title}
              />
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-space-sm rounded-[28px] bg-error-container/50 p-space-lg">
          <h2 className="font-headline-md text-[17px] font-bold text-on-error-container">
            Danger zone
          </h2>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Clearing notes will be permanent once storage exists. For now this
            button does nothing at all.
          </p>
          <Button variant="danger" className="w-fit">
            Clear all notes
          </Button>
        </div>
      </div>
    </div>
  );
}

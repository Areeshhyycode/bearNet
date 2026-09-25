"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Field, Input, Toggle } from "@/components/ui/field";
import { Segmented } from "@/components/ui/segmented";
import { Toast } from "@/components/ui/toast";
import { BearMascot, type BearVariant } from "@/components/bears/BearMascot";
import { useNotes } from "@/lib/notes-store";
import { useProgress } from "@/lib/progress-store";
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

const PREF_ROWS = [
  { key: "reminders", title: "Daily study reminder", caption: "A gentle nudge at 7pm" },
  { key: "sounds", title: "Soft UI sounds", caption: "Paper rustles and tiny chimes" },
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
  { key: "reducedMotion", title: "Reduced motion", caption: "Calm the floating bears" },
] as const;

/** Every control writes straight through to the persisted profile. */
export function SettingsPanels() {
  const { notes, resetToSeed } = useNotes();
  const { profile, updateProfile, xp, level, rank, resetProgress } = useProgress();

  const [name, setName] = useState(profile.name);
  const [handle, setHandle] = useState(profile.handle);
  const [goal, setGoal] = useState(String(profile.dailyGoalMinutes));
  const [cert, setCert] = useState(profile.certTarget);
  const [toast, setToast] = useState<string | null>(null);
  const [confirmWipe, setConfirmWipe] = useState(false);

  function saveProfile() {
    const parsedGoal = Number.parseInt(goal, 10);
    updateProfile({
      name: name.trim() || "Bear Learner",
      handle: handle.trim() || "@bearnet",
      dailyGoalMinutes:
        Number.isFinite(parsedGoal) && parsedGoal > 0 ? parsedGoal : 45,
      certTarget: cert.trim() || "CompTIA Network+ N10-008",
    });
    setToast("🎀 Settings saved");
  }

  function discard() {
    setName(profile.name);
    setHandle(profile.handle);
    setGoal(String(profile.dailyGoalMinutes));
    setCert(profile.certTarget);
    setToast("Changes discarded");
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-space-lg lg:grid-cols-12">
        {/* Profile */}
        <div className="flex flex-col gap-space-md rounded-[28px] bg-surface-container-lowest p-space-lg shadow-cozy lg:col-span-7">
          <h2 className="font-headline-md text-[17px] font-bold text-on-surface">
            🎀 Profile
          </h2>

          <div className="flex items-center gap-space-md rounded-[20px] bg-surface-container-low p-space-md">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary font-headline-md text-headline-md font-bold text-on-primary">
              {profile.name.slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="font-headline-md text-[16px] font-bold text-on-surface">
                {profile.name}
              </div>
              <div className="font-body-sm text-body-sm text-on-surface-variant">
                {profile.handle} • {rank.title}
              </div>
              <div className="mt-1 flex flex-wrap gap-1.5">
                <Badge tone="blush">Level {level}</Badge>
                <Badge tone="lavender">{xp.toLocaleString()} XP</Badge>
                <Badge tone="outline">
                  {notes.length} note{notes.length === 1 ? "" : "s"}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-space-md sm:grid-cols-2">
            <Field label="Display name">
              <Input
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Your name"
              />
            </Field>
            <Field label="Study handle">
              <Input
                value={handle}
                onChange={(event) => setHandle(event.target.value)}
                placeholder="@bearnet"
              />
            </Field>
          </div>

          <Field
            label="Daily study goal (minutes)"
            hint="Used for the streak target and the weekly activity chart."
          >
            <Input
              value={goal}
              onChange={(event) => setGoal(event.target.value)}
              inputMode="numeric"
            />
          </Field>

          <Field label="Certification target">
            <Input value={cert} onChange={(event) => setCert(event.target.value)} />
          </Field>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button variant="primary" onClick={saveProfile}>
              Save changes
            </Button>
            <Button variant="ghost" onClick={discard}>
              Discard
            </Button>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Saved in this browser.
            </span>
          </div>
        </div>

        {/* Right column */}
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
                  onClick={() => updateProfile({ buddy: item.id })}
                  aria-pressed={profile.buddy === item.id}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-[20px] p-3 transition-all active:scale-[0.98]",
                    profile.buddy === item.id
                      ? "bg-primary-fixed shadow-soft ring-2 ring-primary-container"
                      : "bg-surface-container-low hover:bg-surface-container-high",
                  )}
                >
                  <BearMascot
                    variant={item.id}
                    size={54}
                    withPlate={false}
                    animated={profile.buddy === item.id}
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
                value={profile.accent}
                onChange={(accent) => updateProfile({ accent })}
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

            {PREF_ROWS.map((row) => (
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
                  checked={profile.prefs[row.key]}
                  onChange={(next) =>
                    updateProfile({ prefs: { ...profile.prefs, [row.key]: next } })
                  }
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
              This clears every note, all XP, streaks and scores from this
              browser. It cannot be undone.
            </p>

            {confirmWipe ? (
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-body-sm text-body-sm font-semibold text-on-error-container">
                  Really erase everything?
                </span>
                <Button variant="secondary" onClick={() => setConfirmWipe(false)}>
                  Keep my data
                </Button>
                <Button
                  variant="danger"
                  onClick={() => {
                    resetToSeed();
                    resetProgress();
                    setConfirmWipe(false);
                    setToast("Everything cleared — fresh start 🌱");
                  }}
                >
                  Erase everything
                </Button>
              </div>
            ) : (
              <Button
                variant="danger"
                className="w-fit"
                onClick={() => setConfirmWipe(true)}
              >
                Clear all my data
              </Button>
            )}
          </div>
        </div>
      </div>

      <Toast message={toast} />
    </>
  );
}

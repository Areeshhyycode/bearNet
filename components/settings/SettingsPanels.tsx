"use client";

import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Field, Input, Toggle } from "@/components/ui/field";
import { Segmented } from "@/components/ui/segmented";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { BearMascot, type BearVariant } from "@/components/bears/BearMascot";
import { useAuth } from "@/lib/auth-context";
import { useNotes } from "@/lib/notes-store";
import { useProgress } from "@/lib/progress-store";
import { useToast } from "@/lib/toast";
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
    title: "Show my name on public notes",
    caption: "Authors are shown on the community feed",
  },
  { key: "reducedMotion", title: "Reduced motion", caption: "Calm the floating bears" },
] as const;

export function SettingsPanels() {
  const { user, logout } = useAuth();
  const { notes } = useNotes();
  const { preferences, updatePreferences, xp, level, resetProgress } =
    useProgress();
  const toast = useToast();

  const [handle, setHandle] = useState(preferences.handle);
  const [goal, setGoal] = useState(String(preferences.dailyGoalMinutes));
  const [cert, setCert] = useState(preferences.certTarget);
  const [confirmWipe, setConfirmWipe] = useState(false);

  // Adopt server values once they load.
  useEffect(() => {
    setHandle(preferences.handle);
    setGoal(String(preferences.dailyGoalMinutes));
    setCert(preferences.certTarget);
  }, [preferences.handle, preferences.dailyGoalMinutes, preferences.certTarget]);

  function saveProfile() {
    const parsed = Number.parseInt(goal, 10);
    updatePreferences({
      handle: handle.trim() || "@bearnet",
      dailyGoalMinutes: Number.isFinite(parsed) && parsed > 0 ? parsed : 45,
      certTarget: cert.trim() || "CompTIA Network+ N10-008",
    });
    toast.success("🎀 Settings saved");
  }

  const publicCount = notes.filter((n) => n.visibility === "public").length;

  return (
    <>
      <div className="grid grid-cols-1 gap-space-lg lg:grid-cols-12">
        {/* Profile */}
        <div className="flex flex-col gap-space-md rounded-[28px] bg-surface-container-lowest p-space-lg shadow-cozy lg:col-span-7">
          <h2 className="font-headline-md text-[17px] font-bold text-on-surface">
            🎀 Profile
          </h2>

          <div className="flex flex-wrap items-center gap-space-md rounded-[20px] bg-surface-container-low p-space-md">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary font-headline-md text-headline-md font-bold text-on-primary">
              {(user?.name ?? "B").slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
              <div className="truncate font-headline-md text-[16px] font-bold text-on-surface">
                {user?.name}
              </div>
              <div className="truncate font-body-sm text-body-sm text-on-surface-variant">
                {user?.email}
              </div>
              <div className="mt-1 flex flex-wrap gap-1.5">
                <Badge tone="blush">Level {level}</Badge>
                <Badge tone="lavender">{xp.toLocaleString()} XP</Badge>
                <Badge tone="outline">
                  {notes.length} note{notes.length === 1 ? "" : "s"} · {publicCount}{" "}
                  public
                </Badge>
              </div>
            </div>
          </div>

          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Your name and email come from your account and appear on notes you
            choose to publish.
          </p>

          <Field label="Study handle">
            <Input value={handle} onChange={(e) => setHandle(e.target.value)} />
          </Field>

          <Field
            label="Daily study goal (minutes)"
            hint="Used for the streak target and the weekly activity chart."
          >
            <Input
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
              inputMode="numeric"
            />
          </Field>

          <Field label="Certification target">
            <Input value={cert} onChange={(e) => setCert(e.target.value)} />
          </Field>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Button variant="primary" onClick={saveProfile}>
              Save changes
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setHandle(preferences.handle);
                setGoal(String(preferences.dailyGoalMinutes));
                setCert(preferences.certTarget);
                toast.toast("Changes discarded", "info");
              }}
            >
              Discard
            </Button>
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
                  onClick={() => updatePreferences({ buddy: item.id })}
                  aria-pressed={preferences.buddy === item.id}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-[20px] p-2 transition-all active:scale-[0.98] sm:p-3",
                    preferences.buddy === item.id
                      ? "bg-primary-fixed shadow-soft ring-2 ring-primary-container"
                      : "bg-surface-container-low hover:bg-surface-container-high",
                  )}
                >
                  <BearMascot
                    variant={item.id}
                    size={48}
                    withPlate={false}
                    animated={preferences.buddy === item.id}
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
                value={preferences.accent}
                onChange={(accent) => updatePreferences({ accent })}
                label="Accent wash"
                className="w-full"
              />
            </Field>
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
                  checked={preferences.prefs[row.key]}
                  onChange={(next) =>
                    updatePreferences({
                      prefs: { ...preferences.prefs, [row.key]: next },
                    })
                  }
                  label={row.title}
                />
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-space-sm rounded-[28px] bg-surface-container-lowest p-space-lg shadow-cozy">
            <h2 className="font-headline-md text-[17px] font-bold text-on-surface">
              Account
            </h2>
            <Button variant="secondary" onClick={() => void logout()}>
              <LogOut className="h-4 w-4" /> Sign out
            </Button>
          </div>

          <div className="flex flex-col gap-space-sm rounded-[28px] bg-error-container/50 p-space-lg">
            <h2 className="font-headline-md text-[17px] font-bold text-on-error-container">
              Danger zone
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Resets XP, streaks and quiz history for this account. Your notes
              are not touched.
            </p>
            <Button
              variant="danger"
              className="w-fit"
              onClick={() => setConfirmWipe(true)}
            >
              Reset my progress
            </Button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmWipe}
        title="Reset all progress?"
        description="XP, streaks, quiz and exam history will be cleared. Notes are kept."
        confirmLabel="Reset"
        onConfirm={() => {
          resetProgress();
          setConfirmWipe(false);
          toast.success("Progress reset — fresh start 🌱");
        }}
        onCancel={() => setConfirmWipe(false)}
      />
    </>
  );
}

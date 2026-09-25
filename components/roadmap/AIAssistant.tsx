"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Loader2, RefreshCw, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BearMascot } from "@/components/bears/BearMascot";
import { useRoadmap } from "@/lib/roadmap-store";

type Suggestion = {
  nextTopic: string;
  why: string;
  resources: string[];
  practiceTask: string;
  progressSuggestion: string;
};

/** Reads the roadmap and quiz history, then suggests what to study next. */
export function AIAssistant() {
  const { roadmap } = useRoadmap();
  const [suggestion, setSuggestion] = useState<Suggestion | null>(null);
  const [source, setSource] = useState<"ai" | "offline">("ai");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/ai/journey", { method: "POST" });
      const data = await response.json();

      if (!response.ok) throw new Error(data?.error ?? "Could not get a suggestion.");
      setSuggestion(data.suggestion);
      setSource(data.source === "offline" ? "offline" : "ai");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not get a suggestion.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Refresh when the roadmap changes, so advice follows the plan.
  useEffect(() => {
    if (!roadmap) return;
    void load();
  }, [roadmap, load]);

  return (
    <section className="relative overflow-hidden rounded-[28px] bg-surface-container-low p-space-md shadow-cozy sm:p-space-xl">
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-secondary-container/30 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-space-md">
        <div className="flex flex-wrap items-center justify-between gap-space-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-container-lowest shadow-sm">
              <BearMascot variant="panda" size={46} withPlate={false} animated />
            </div>
            <div className="min-w-0">
              <span className="flex items-center gap-1.5 font-label-badge text-label-badge font-bold uppercase tracking-wider text-tertiary">
                <Sparkles className="h-3 w-3" /> AI Learning Assistant
              </span>
              <h2 className="font-headline-md text-headline-md font-bold text-on-surface">
                What to study next
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {source === "offline" && !loading && (
              <Badge tone="outline">offline suggestion</Badge>
            )}
            <button
              type="button"
              onClick={load}
              disabled={loading}
              className="inline-flex items-center gap-1.5 rounded-full bg-surface-container-lowest px-3 py-2 font-body-sm text-body-sm font-semibold text-on-surface-variant shadow-sm transition-all hover:text-primary disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3">
            <Skeleton className="h-6 w-1/2 rounded-full" />
            <Skeleton className="h-4 w-full rounded-full" />
            <Skeleton className="h-4 w-5/6 rounded-full" />
            <div className="grid gap-2 sm:grid-cols-2">
              <Skeleton className="h-24 rounded-[20px]" />
              <Skeleton className="h-24 rounded-[20px]" />
            </div>
          </div>
        ) : error ? (
          <div
            role="alert"
            className="rounded-[20px] bg-error-container px-space-md py-3 font-body-sm text-body-sm text-on-error-container"
          >
            🥺 {error}
          </div>
        ) : suggestion ? (
          <>
            {/* Headline recommendation */}
            <div className="rounded-2xl rounded-tl-sm bg-surface-container-lowest p-space-md shadow-sm">
              <p className="font-body-lg text-body-lg leading-relaxed text-on-surface">
                Based on your roadmap, your next recommended topic is{" "}
                <strong className="font-semibold text-tertiary">
                  {suggestion.nextTopic}
                </strong>
                .
              </p>
              <p className="mt-1.5 font-body-md text-body-md text-on-surface-variant">
                {suggestion.why}
              </p>
            </div>

            <div className="grid gap-space-md sm:grid-cols-2">
              <div className="rounded-[20px] bg-surface-container-lowest p-space-md">
                <h3 className="font-headline-md text-[15px] font-bold text-on-surface">
                  📚 Suggested next steps
                </h3>
                <ul className="mt-2 space-y-1.5">
                  {suggestion.resources.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 font-body-sm text-body-sm text-on-surface-variant"
                    >
                      <span className="text-tertiary" aria-hidden>
                        ✦
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-col rounded-[20px] bg-primary-fixed p-space-md">
                <h3 className="font-headline-md text-[15px] font-bold text-on-primary-fixed">
                  🎯 Practice task
                </h3>
                <p className="mt-2 font-body-sm text-body-sm leading-relaxed text-on-primary-fixed/90">
                  {suggestion.practiceTask}
                </p>
                <div className="mt-auto flex flex-wrap gap-2 pt-space-md">
                  <Link
                    href="/notes/new"
                    className="rounded-full bg-surface-container-lowest px-3 py-1.5 font-body-sm text-body-sm font-semibold text-on-surface transition-transform hover:-translate-y-0.5"
                  >
                    ✏️ Write it up
                  </Link>
                  <Link
                    href="/quiz"
                    className="rounded-full bg-surface-container-lowest px-3 py-1.5 font-body-sm text-body-sm font-semibold text-on-surface transition-transform hover:-translate-y-0.5"
                  >
                    🧠 Quiz me
                  </Link>
                </div>
              </div>
            </div>

            <p className="flex items-start gap-2 font-body-sm text-body-sm text-on-surface-variant">
              <span aria-hidden>🌸</span> {suggestion.progressSuggestion}
            </p>
          </>
        ) : null}
      </div>
    </section>
  );
}

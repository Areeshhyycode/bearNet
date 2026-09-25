import { NextResponse } from "next/server";
import { requireUser, Unauthorised } from "@/lib/auth/guard";
import { getRoadmap } from "@/lib/db/roadmap";
import { getProgress } from "@/lib/db/progress";
import { listNotes } from "@/lib/db/notes";
import { GroqError, chat, isConfigured, parseJson } from "@/lib/groq";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Suggestion = {
  nextTopic: string;
  why: string;
  resources: string[];
  practiceTask: string;
  progressSuggestion: string;
};

/** A useful answer even when the model is unavailable. */
function fallback(nextTitle: string | null): Suggestion {
  const topic = nextTitle ?? "Networking fundamentals";
  return {
    nextTopic: topic,
    why: `It is the next unfinished step on your roadmap, so it builds directly on what you have already covered.`,
    resources: [
      `Write a note summarising the core ideas of ${topic}`,
      `Take a 10-question quiz on ${topic} once the note exists`,
      "Solve a lab scenario that touches this topic",
    ],
    practiceTask: `Explain ${topic} in your own words in under 150 words, without looking anything up.`,
    progressSuggestion:
      "Aim for one note and one quiz on this topic before moving to the next step.",
  };
}

export async function POST() {
  try {
    const session = await requireUser();

    const [roadmap, progress, notes] = await Promise.all([
      getRoadmap(session.userId),
      getProgress(session.userId),
      listNotes(session.userId),
    ]);

    const nextItem = roadmap.items.find((item) => !item.completed) ?? null;

    if (!isConfigured()) {
      return NextResponse.json({
        suggestion: fallback(nextItem?.title ?? null),
        source: "offline",
      });
    }

    // Accuracy per topic, so the model can spot weak spots.
    const topicScores = new Map<string, { correct: number; total: number }>();
    for (const run of progress.runs.slice(0, 20)) {
      for (const entry of run.byTopic) {
        const current = topicScores.get(entry.topic) ?? { correct: 0, total: 0 };
        current.correct += entry.correct;
        current.total += entry.total;
        topicScores.set(entry.topic, current);
      }
    }

    const mastery = [...topicScores.entries()]
      .map(([topic, v]) => `${topic}: ${Math.round((v.correct / v.total) * 100)}%`)
      .join(", ");

    const context = `Roadmap "${roadmap.title}":
${roadmap.items
  .map((item, i) => `${i + 1}. ${item.title} — ${item.completed ? "completed" : "not started"}`)
  .join("\n")}

Next unfinished step: ${nextItem?.title ?? "none — the roadmap is complete"}
Notes written: ${notes.length}${notes.length ? ` (topics: ${[...new Set(notes.map((n) => n.category))].join(", ")})` : ""}
Quiz accuracy by topic: ${mastery || "no quizzes taken yet"}
XP: ${progress.xp}, labs solved: ${progress.labsSolved.length}`;

    const raw = await chat({
      messages: [
        {
          role: "system",
          content:
            "You are a warm, practical study planner for a networking and cybersecurity learner. You reply with JSON only. Be specific and encouraging, never generic.",
        },
        {
          role: "user",
          content: `Here is the learner's situation:

${context}

Recommend what they should study next. Prefer the next unfinished roadmap step, unless a quiz score shows a clear weak spot that should be revisited first.

Return JSON shaped exactly like:
{"nextTopic":"...","why":"one or two sentences","resources":["three short study suggestions"],"practiceTask":"one concrete task they can do in 15 minutes","progressSuggestion":"one sentence on pacing"}`,
        },
      ],
      temperature: 0.6,
      maxTokens: 900,
      json: true,
    });

    const parsed = parseJson<Partial<Suggestion>>(raw);
    const base = fallback(nextItem?.title ?? null);

    return NextResponse.json({
      suggestion: {
        nextTopic: parsed.nextTopic || base.nextTopic,
        why: parsed.why || base.why,
        resources:
          Array.isArray(parsed.resources) && parsed.resources.length > 0
            ? parsed.resources.slice(0, 4)
            : base.resources,
        practiceTask: parsed.practiceTask || base.practiceTask,
        progressSuggestion: parsed.progressSuggestion || base.progressSuggestion,
      },
      source: "ai",
    });
  } catch (error) {
    if (error instanceof Unauthorised) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    if (error instanceof GroqError) {
      // Still give the learner something actionable.
      return NextResponse.json({
        suggestion: fallback(null),
        source: "offline",
        notice: error.message,
      });
    }
    console.error("[api/ai/journey]", error);
    return NextResponse.json({ error: "Could not build a suggestion." }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { GroqError, chat, isConfigured, parseJson } from "@/lib/groq";
import type { QuizQuestion } from "@/lib/quiz-types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  topic?: string;
  difficulty?: "easy" | "medium" | "hard";
  count?: number;
  notes?: { title: string; topic: string; body: string }[];
};

/** Shape we ask the model for — flatter than our app type, so it slips up less. */
type RawQuestion = {
  topic?: string;
  prompt?: string;
  options?: string[];
  correctIndex?: number;
  explanation?: string;
};

const DIFFICULTY_BRIEF = {
  easy: "Recall level: definitions, port numbers, what a device does.",
  medium: "Application level: compare two concepts, read a symptom and name the cause.",
  hard: "Analysis level: multi-step subnetting, layered troubleshooting, edge cases.",
} as const;

export async function POST(request: Request) {
  if (!isConfigured()) {
    return NextResponse.json(
      { error: "Quiz generation is not configured. Add GROQ_API_KEY to .env.local." },
      { status: 503 },
    );
  }

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const count = Math.min(Math.max(body.count ?? 5, 1), 20);
  const difficulty = body.difficulty ?? "medium";
  const topic = body.topic && body.topic !== "mixed" ? body.topic : null;
  const notes = body.notes ?? [];

  const noteContext =
    notes.length > 0
      ? `Base the questions on these notes written by the learner. Prefer their wording and examples:\n\n${notes
          .slice(0, 12)
          .map(
            (n) =>
              `### ${n.title} (${n.topic})\n${n.body.length > 900 ? `${n.body.slice(0, 900)}…` : n.body}`,
          )
          .join("\n\n")}`
      : "The learner has no notes yet, so use standard CompTIA Network+ foundation material.";

  const prompt = `Write ${count} multiple-choice questions about ${topic ?? "a mix of core networking topics"} for someone studying for CompTIA Network+.

${DIFFICULTY_BRIEF[difficulty]}

${noteContext}

Rules:
- Exactly 4 options per question, only one correct.
- Wrong options must be plausible, not silly.
- Keep each question to one sentence where possible.
- The explanation is one or two sentences saying why the answer is right.
- Do not repeat a question.

Return JSON shaped exactly like:
{"questions":[{"topic":"Ports","prompt":"...","options":["a","b","c","d"],"correctIndex":0,"explanation":"..."}]}`;

  try {
    const raw = await chat({
      messages: [
        {
          role: "system",
          content:
            "You write precise, exam-accurate networking quiz questions. You reply with JSON only.",
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      maxTokens: 3600,
      json: true,
    });

    const parsed = parseJson<{ questions?: RawQuestion[] }>(raw);

    const questions: QuizQuestion[] = (parsed.questions ?? [])
      .filter(
        (q): q is Required<RawQuestion> =>
          typeof q.prompt === "string" &&
          Array.isArray(q.options) &&
          q.options.length === 4 &&
          typeof q.correctIndex === "number" &&
          q.correctIndex >= 0 &&
          q.correctIndex < 4,
      )
      .map((q, index) => ({
        id: `ai-${index}`,
        topic: q.topic || topic || "Networking",
        prompt: q.prompt,
        options: q.options.map((text, i) => ({
          id: String.fromCharCode(97 + i),
          text,
        })),
        correctId: String.fromCharCode(97 + q.correctIndex),
        explanation: q.explanation || "",
      }));

    if (questions.length === 0) {
      console.error("[quiz] no usable questions. Raw reply was:", raw.slice(0, 600));
      return NextResponse.json(
        { error: "The model did not return any usable questions. Try again." },
        { status: 502 },
      );
    }

    return NextResponse.json({ questions });
  } catch (error) {
    const status = error instanceof GroqError ? error.status : 500;
    const message =
      error instanceof Error ? error.message : "Could not generate questions.";
    return NextResponse.json({ error: message }, { status });
  }
}

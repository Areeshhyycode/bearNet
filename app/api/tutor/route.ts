import { NextResponse } from "next/server";
import { GroqError, chat, isConfigured, type ChatMessage } from "@/lib/groq";

export const runtime = "nodejs";
/** Never cache a conversation. */
export const dynamic = "force-dynamic";

type NoteContext = { title: string; topic: string; body: string };

type Body = {
  messages?: { role: "user" | "assistant"; content: string }[];
  notes?: NoteContext[];
};

const SYSTEM = `You are Panda, a warm and patient study buddy inside BearNet — a cozy app for learning networking and cybersecurity.

How you answer:
- Ground every answer in the learner's own notes when they cover the question. Say which note you used.
- If the notes do not cover it, answer anyway from general networking knowledge, but say plainly that it is not in their notes yet and suggest they write one.
- Be concise: a short paragraph, or a few bullets. No walls of text.
- Explain with everyday analogies before jargon, then name the correct term.
- Stay encouraging and kind. A single emoji is welcome; more is clutter.
- Never invent details about their notes that are not there.`;

/** Keeps the prompt small enough to stay fast and cheap. */
function buildNoteContext(notes: NoteContext[]) {
  if (notes.length === 0) {
    return "The learner has not written any notes yet. Encourage them to write their first one, and answer from general networking knowledge in the meantime.";
  }

  const trimmed = notes.slice(0, 12).map((note) => {
    const body = note.body.length > 1200 ? `${note.body.slice(0, 1200)}…` : note.body;
    return `### ${note.title} (topic: ${note.topic})\n${body}`;
  });

  return `Here are the learner's notes:\n\n${trimmed.join("\n\n")}`;
}

export async function POST(request: Request) {
  if (!isConfigured()) {
    return NextResponse.json(
      {
        error:
          "The AI tutor is not configured. Copy .env.example to .env.local, add GROQ_API_KEY, then restart the dev server.",
      },
      { status: 503 },
    );
  }

  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const history = (body.messages ?? []).slice(-10);
  if (history.length === 0) {
    return NextResponse.json({ error: "No message to answer." }, { status: 400 });
  }

  const messages: ChatMessage[] = [
    { role: "system", content: SYSTEM },
    { role: "system", content: buildNoteContext(body.notes ?? []) },
    ...history.map((m) => ({ role: m.role as ChatMessage["role"], content: m.content })),
  ];

  try {
    const reply = await chat({ messages, temperature: 0.5, maxTokens: 900 });
    return NextResponse.json({ reply });
  } catch (error) {
    const status = error instanceof GroqError ? error.status : 500;
    const message =
      error instanceof Error ? error.message : "Panda could not reach the model.";
    return NextResponse.json({ error: message }, { status });
  }
}

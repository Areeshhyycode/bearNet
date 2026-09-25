import { NextResponse } from "next/server";
import { requireUser, Unauthorised } from "@/lib/auth/guard";
import { createNote, listNotes } from "@/lib/db/notes";
import type { NoteInput } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** The signed-in user's own notes — private ones included. */
export async function GET() {
  try {
    const session = await requireUser();
    const notes = await listNotes(session.userId);
    return NextResponse.json({ notes });
  } catch (error) {
    return fail(error);
  }
}

export async function POST(request: Request) {
  try {
    const session = await requireUser();
    const input = (await request.json()) as NoteInput;

    if (!input?.title?.trim() && !input?.content?.trim()) {
      return NextResponse.json(
        { error: "A note needs a title or some content." },
        { status: 400 },
      );
    }

    const note = await createNote(session.userId, session.name, input);
    return NextResponse.json({ note }, { status: 201 });
  } catch (error) {
    return fail(error);
  }
}

function fail(error: unknown) {
  if (error instanceof Unauthorised) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
  console.error("[api/notes]", error);
  return NextResponse.json({ error: "Could not load your notes." }, { status: 500 });
}

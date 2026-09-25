import { NextResponse } from "next/server";
import { requireUser, Unauthorised } from "@/lib/auth/guard";
import {
  deleteNote,
  getOwnedNote,
  setNoteVisibility,
  updateNote,
} from "@/lib/db/notes";
import type { NoteInput } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

/**
 * All three handlers pass the session userId into the repository, which
 * uses it in the query filter. A note belonging to someone else simply
 * does not match, so it reads as "not found" rather than leaking that it
 * exists.
 */

export async function GET(_request: Request, { params }: Params) {
  try {
    const session = await requireUser();
    const { id } = await params;
    const note = await getOwnedNote(session.userId, id);

    if (!note) return NextResponse.json({ error: "Note not found." }, { status: 404 });
    return NextResponse.json({ note });
  } catch (error) {
    return fail(error);
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const session = await requireUser();
    const { id } = await params;
    const body = await request.json();

    // A visibility-only flip (the badge toggle) skips the full update.
    if (
      body &&
      typeof body.visibility === "string" &&
      body.title === undefined &&
      body.content === undefined
    ) {
      const note = await setNoteVisibility(
        session.userId,
        id,
        body.visibility === "public" ? "public" : "private",
      );
      if (!note) {
        return NextResponse.json({ error: "Note not found." }, { status: 404 });
      }
      return NextResponse.json({ note });
    }

    const note = await updateNote(
      session.userId,
      id,
      body as NoteInput,
      session.name,
    );
    if (!note) return NextResponse.json({ error: "Note not found." }, { status: 404 });
    return NextResponse.json({ note });
  } catch (error) {
    return fail(error);
  }
}

export async function DELETE(_request: Request, { params }: Params) {
  try {
    const session = await requireUser();
    const { id } = await params;
    const removed = await deleteNote(session.userId, id);

    if (!removed) {
      return NextResponse.json({ error: "Note not found." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    return fail(error);
  }
}

function fail(error: unknown) {
  if (error instanceof Unauthorised) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
  console.error("[api/notes/:id]", error);
  return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
}

import { NextResponse } from "next/server";
import { requireUser, Unauthorised } from "@/lib/auth/guard";
import { getPublicNote } from "@/lib/db/notes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await requireUser();
    const { id } = await params;

    // Only matches notes explicitly marked public.
    const note = await getPublicNote(id);
    if (!note) {
      return NextResponse.json(
        { error: "That note is not public, or does not exist." },
        { status: 404 },
      );
    }

    return NextResponse.json({ note });
  } catch (error) {
    if (error instanceof Unauthorised) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("[api/notes/public/:id]", error);
    return NextResponse.json({ error: "Something went wrong." }, { status: 500 });
  }
}

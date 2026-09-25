import { NextResponse } from "next/server";
import { requireUser, Unauthorised } from "@/lib/auth/guard";
import { getProgress, saveProgress } from "@/lib/db/progress";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await requireUser();
    return NextResponse.json({ progress: await getProgress(session.userId) });
  } catch (error) {
    return fail(error);
  }
}

export async function PUT(request: Request) {
  try {
    const session = await requireUser();
    const body = await request.json();

    // userId is never taken from the body — only from the session.
    const { userId: _ignored, ...patch } = body ?? {};
    const progress = await saveProgress(session.userId, patch);

    return NextResponse.json({ progress });
  } catch (error) {
    return fail(error);
  }
}

function fail(error: unknown) {
  if (error instanceof Unauthorised) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
  console.error("[api/progress]", error);
  return NextResponse.json({ error: "Could not save progress." }, { status: 500 });
}

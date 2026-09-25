import { NextResponse } from "next/server";
import { requireUser, Unauthorised } from "@/lib/auth/guard";
import { listPublicNotes, publicCategories } from "@/lib/db/notes";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Community feed. Sign-in is required to browse it, and the repository
 * pins `visibility: "public"`, so a private note can never appear here.
 */
export async function GET(request: Request) {
  try {
    await requireUser();

    const url = new URL(request.url);
    const [notes, categories] = await Promise.all([
      listPublicNotes({
        search: url.searchParams.get("q") ?? undefined,
        category: url.searchParams.get("category") ?? undefined,
      }),
      publicCategories(),
    ]);

    return NextResponse.json({ notes, categories });
  } catch (error) {
    if (error instanceof Unauthorised) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }
    console.error("[api/notes/public]", error);
    return NextResponse.json(
      { error: "Could not load community notes." },
      { status: 500 },
    );
  }
}

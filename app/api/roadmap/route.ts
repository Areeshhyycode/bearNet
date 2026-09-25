import { NextResponse } from "next/server";
import { requireUser, Unauthorised } from "@/lib/auth/guard";
import {
  addItem,
  deleteItem,
  getRoadmap,
  renameRoadmap,
  reorderItem,
  updateItem,
} from "@/lib/db/roadmap";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await requireUser();
    return NextResponse.json({ roadmap: await getRoadmap(session.userId) });
  } catch (error) {
    return fail(error);
  }
}

/** One endpoint, one `action` field — keeps the client simple. */
export async function POST(request: Request) {
  try {
    const session = await requireUser();
    const body = await request.json();
    const userId = session.userId;

    switch (body.action) {
      case "add":
        return NextResponse.json({
          roadmap: await addItem(userId, {
            title: body.title,
            description: body.description,
          }),
        });

      case "update":
        return NextResponse.json({
          roadmap: await updateItem(userId, body.itemId, {
            title: body.title,
            description: body.description,
            completed: body.completed,
          }),
        });

      case "delete":
        return NextResponse.json({ roadmap: await deleteItem(userId, body.itemId) });

      case "reorder":
        return NextResponse.json({
          roadmap: await reorderItem(userId, body.itemId, body.direction),
        });

      case "rename":
        return NextResponse.json({ roadmap: await renameRoadmap(userId, body.title) });

      default:
        return NextResponse.json({ error: "Unknown action." }, { status: 400 });
    }
  } catch (error) {
    return fail(error);
  }
}

function fail(error: unknown) {
  if (error instanceof Unauthorised) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
  console.error("[api/roadmap]", error);
  return NextResponse.json({ error: "Could not update the roadmap." }, { status: 500 });
}

import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/guard";
import { findUserById } from "@/lib/db/users";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ user: null });

  // Re-read from the database so a deleted or renamed account is reflected.
  const user = await findUserById(session.userId);
  return NextResponse.json({ user });
}

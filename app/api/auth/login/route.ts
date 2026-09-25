import { NextResponse } from "next/server";
import { authenticate } from "@/lib/db/users";
import { createSessionToken, SESSION_COOKIE, sessionCookieOptions } from "@/lib/auth/session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let body: { email?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const email = body.email?.trim();
  const password = body.password ?? "";

  if (!email || !password) {
    return NextResponse.json(
      { error: "Enter your email and password." },
      { status: 400 },
    );
  }

  const user = await authenticate(email, password);

  // Deliberately vague: never reveal whether the email exists.
  if (!user) {
    return NextResponse.json(
      { error: "That email and password do not match." },
      { status: 401 },
    );
  }

  const token = await createSessionToken({
    userId: user.id,
    name: user.name,
    email: user.email,
  });

  const response = NextResponse.json({ user });
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
  return response;
}

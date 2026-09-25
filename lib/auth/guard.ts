import "server-only";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { SESSION_COOKIE, readSessionToken, type SessionPayload } from "./session";

/**
 * Reads the session from the request cookie.
 *
 * Every API route that touches user data calls `requireUser` first. The
 * userId it returns is the ONLY identity the repositories trust — a userId
 * sent in a request body is never used, so one account cannot read or write
 * another account's rows.
 */
export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  return readSessionToken(store.get(SESSION_COOKIE)?.value);
}

export class Unauthorised extends Error {
  constructor() {
    super("You need to be signed in to do that.");
    this.name = "Unauthorised";
  }
}

export async function requireUser(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) throw new Unauthorised();
  return session;
}

/** Wraps a route handler so unauthenticated calls become a clean 401. */
export function withUser<T>(
  handler: (session: SessionPayload) => Promise<T>,
): Promise<T | NextResponse> {
  return (async () => {
    try {
      const session = await requireUser();
      return await handler(session);
    } catch (error) {
      if (error instanceof Unauthorised) {
        return NextResponse.json({ error: error.message }, { status: 401 });
      }
      const message =
        error instanceof Error ? error.message : "Something went wrong.";
      console.error("[api]", message);
      return NextResponse.json({ error: message }, { status: 500 });
    }
  })();
}

// Subpath imports keep the JWE/decompression code out of the edge bundle.
import { SignJWT } from "jose/jwt/sign";
import { jwtVerify } from "jose/jwt/verify";

/**
 * Session handling.
 *
 * The session is a signed JWT in an httpOnly cookie, so client-side
 * JavaScript can never read it and a stolen value cannot be forged without
 * AUTH_SECRET. `jose` is used because it runs in the edge runtime, which is
 * where the middleware checks the cookie.
 */

export const SESSION_COOKIE = "bearnet_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

export type SessionPayload = {
  userId: string;
  name: string;
  email: string;
};

function secretKey() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error(
      "AUTH_SECRET must be set to a string of at least 32 characters.",
    );
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(payload: SessionPayload) {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE_SECONDS}s`)
    .sign(secretKey());
}

export async function readSessionToken(
  token: string | undefined,
): Promise<SessionPayload | null> {
  if (!token) return null;

  try {
    const { payload } = await jwtVerify(token, secretKey());
    if (
      typeof payload.userId === "string" &&
      typeof payload.name === "string" &&
      typeof payload.email === "string"
    ) {
      return {
        userId: payload.userId,
        name: payload.name,
        email: payload.email,
      };
    }
    return null;
  } catch {
    // Expired, tampered with, or signed by a different secret.
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  path: "/",
  maxAge: MAX_AGE_SECONDS,
  secure: process.env.NODE_ENV === "production",
};

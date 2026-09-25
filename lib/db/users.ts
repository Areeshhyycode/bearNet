import "server-only";
import { ObjectId, type WithId } from "mongodb";
import { getDb, ensureIndexes } from "./mongo";
import { hashPassword, verifyPassword } from "../auth/password";
import type { PublicUser } from "../types";

type UserDoc = {
  _id: ObjectId;
  name: string;
  /** Always stored lowercase so lookups are case-insensitive. */
  email: string;
  passwordHash: string;
  createdAt: Date;
};

async function users() {
  await ensureIndexes();
  const db = await getDb();
  return db.collection<UserDoc>("users");
}

/** Strips the password hash — nothing else should ever leave this module. */
function toPublic(doc: WithId<UserDoc>): PublicUser {
  return {
    id: doc._id.toString(),
    name: doc.name,
    email: doc.email,
    createdAt: doc.createdAt.toISOString(),
  };
}

export function normaliseEmail(email: string) {
  return email.trim().toLowerCase();
}

export async function createUser({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}): Promise<{ user: PublicUser } | { error: string }> {
  const collection = await users();
  const cleanEmail = normaliseEmail(email);

  const existing = await collection.findOne({ email: cleanEmail });
  if (existing) {
    return { error: "An account with that email already exists." };
  }

  const doc: UserDoc = {
    _id: new ObjectId(),
    name: name.trim(),
    email: cleanEmail,
    passwordHash: await hashPassword(password),
    createdAt: new Date(),
  };

  try {
    await collection.insertOne(doc);
  } catch (error) {
    // The unique index is the real guard against a race between the
    // findOne above and this insert.
    if (typeof error === "object" && error && "code" in error && error.code === 11000) {
      return { error: "An account with that email already exists." };
    }
    throw error;
  }

  return { user: toPublic(doc) };
}

export async function authenticate(
  email: string,
  password: string,
): Promise<PublicUser | null> {
  const collection = await users();
  const doc = await collection.findOne({ email: normaliseEmail(email) });
  if (!doc) return null;

  const ok = await verifyPassword(password, doc.passwordHash);
  return ok ? toPublic(doc) : null;
}

export async function findUserById(id: string): Promise<PublicUser | null> {
  if (!ObjectId.isValid(id)) return null;
  const collection = await users();
  const doc = await collection.findOne({ _id: new ObjectId(id) });
  return doc ? toPublic(doc) : null;
}

export async function updateUserName(id: string, name: string) {
  if (!ObjectId.isValid(id)) return;
  const collection = await users();
  await collection.updateOne(
    { _id: new ObjectId(id) },
    { $set: { name: name.trim() } },
  );
}

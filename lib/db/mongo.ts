import "server-only";
import { MongoClient, type Db } from "mongodb";

/**
 * Single shared MongoClient.
 *
 * Next.js reloads modules constantly in development, so the client is cached
 * on `globalThis` — otherwise every hot reload opens a new connection pool
 * and Atlas eventually refuses them.
 */

const globalForMongo = globalThis as unknown as {
  _mongoClientPromise?: Promise<MongoClient>;
};

function createClient() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "MONGODB_URI is not set. Copy .env.example to .env.local and add your connection string.",
    );
  }

  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 15000,
    maxPoolSize: 10,
  });

  return client.connect();
}

export function getClient(): Promise<MongoClient> {
  if (!globalForMongo._mongoClientPromise) {
    globalForMongo._mongoClientPromise = createClient();
  }
  return globalForMongo._mongoClientPromise;
}

export async function getDb(): Promise<Db> {
  const client = await getClient();
  return client.db(process.env.MONGODB_DB || "bearnet");
}

let indexesReady: Promise<void> | null = null;

/**
 * Creates the indexes the app relies on. Safe to call repeatedly —
 * `createIndex` is idempotent, and the promise is cached per process.
 */
export function ensureIndexes(): Promise<void> {
  if (!indexesReady) {
    indexesReady = (async () => {
      const db = await getDb();
      await Promise.all([
        db.collection("users").createIndex({ email: 1 }, { unique: true }),
        db.collection("notes").createIndex({ userId: 1, updatedAt: -1 }),
        // Drives the community feed.
        db.collection("notes").createIndex({ visibility: 1, updatedAt: -1 }),
        db.collection("roadmaps").createIndex({ userId: 1 }, { unique: true }),
        db.collection("progress").createIndex({ userId: 1 }, { unique: true }),
      ]);
    })().catch((error) => {
      // Let the next call retry rather than caching a failure forever.
      indexesReady = null;
      throw error;
    });
  }
  return indexesReady;
}

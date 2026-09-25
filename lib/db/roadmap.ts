import "server-only";
import { randomUUID } from "node:crypto";
import { getDb, ensureIndexes } from "./mongo";
import type { Roadmap, RoadmapItem } from "../types";

/** One roadmap per user, stored as an ordered list of items. */

type RoadmapDoc = {
  userId: string;
  title: string;
  items: RoadmapItem[];
  updatedAt: Date;
};

const STARTER_ITEMS: Omit<RoadmapItem, "id">[] = [
  {
    title: "Networking",
    description: "OSI layers, addressing, ports and everyday troubleshooting.",
    completed: false,
    order: 0,
  },
  {
    title: "Linux",
    description: "The shell, permissions, services and log files.",
    completed: false,
    order: 1,
  },
  {
    title: "Web Security",
    description: "How the common web vulnerabilities actually work.",
    completed: false,
    order: 2,
  },
  {
    title: "VAPT",
    description: "Structured vulnerability assessment and ethical testing.",
    completed: false,
    order: 3,
  },
];

async function roadmaps() {
  await ensureIndexes();
  const db = await getDb();
  return db.collection<RoadmapDoc>("roadmaps");
}

function toRoadmap(doc: RoadmapDoc): Roadmap {
  return {
    userId: doc.userId,
    title: doc.title,
    items: [...doc.items].sort((a, b) => a.order - b.order),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

/** Returns the user's roadmap, seeding a starter one on first visit. */
export async function getRoadmap(userId: string): Promise<Roadmap> {
  const collection = await roadmaps();
  const existing = await collection.findOne({ userId });
  if (existing) return toRoadmap(existing);

  const doc: RoadmapDoc = {
    userId,
    title: "My Learning Journey",
    items: STARTER_ITEMS.map((item) => ({ ...item, id: randomUUID() })),
    updatedAt: new Date(),
  };

  await collection.insertOne(doc);
  return toRoadmap(doc);
}

async function save(userId: string, items: RoadmapItem[], title?: string) {
  const collection = await roadmaps();
  const normalised = items.map((item, index) => ({ ...item, order: index }));

  const result = await collection.findOneAndUpdate(
    { userId },
    {
      $set: {
        items: normalised,
        updatedAt: new Date(),
        ...(title ? { title } : {}),
      },
      $setOnInsert: { userId, ...(title ? {} : { title: "My Learning Journey" }) },
    },
    { returnDocument: "after", upsert: true },
  );

  return toRoadmap(result as RoadmapDoc);
}

export async function addItem(
  userId: string,
  input: { title: string; description?: string },
): Promise<Roadmap> {
  const roadmap = await getRoadmap(userId);
  const item: RoadmapItem = {
    id: randomUUID(),
    title: input.title.trim() || "New step",
    description: input.description?.trim() ?? "",
    completed: false,
    order: roadmap.items.length,
  };
  return save(userId, [...roadmap.items, item]);
}

export async function updateItem(
  userId: string,
  itemId: string,
  patch: Partial<Pick<RoadmapItem, "title" | "description" | "completed">>,
): Promise<Roadmap> {
  const roadmap = await getRoadmap(userId);
  const items = roadmap.items.map((item) =>
    item.id === itemId
      ? {
          ...item,
          ...(patch.title !== undefined ? { title: patch.title.trim() } : {}),
          ...(patch.description !== undefined
            ? { description: patch.description.trim() }
            : {}),
          ...(patch.completed !== undefined ? { completed: patch.completed } : {}),
        }
      : item,
  );
  return save(userId, items);
}

export async function deleteItem(userId: string, itemId: string): Promise<Roadmap> {
  const roadmap = await getRoadmap(userId);
  return save(
    userId,
    roadmap.items.filter((item) => item.id !== itemId),
  );
}

/** Moves one item up or down; order is rewritten from the array index. */
export async function reorderItem(
  userId: string,
  itemId: string,
  direction: "up" | "down",
): Promise<Roadmap> {
  const roadmap = await getRoadmap(userId);
  const index = roadmap.items.findIndex((item) => item.id === itemId);
  if (index === -1) return roadmap;

  const target = direction === "up" ? index - 1 : index + 1;
  if (target < 0 || target >= roadmap.items.length) return roadmap;

  const items = [...roadmap.items];
  [items[index], items[target]] = [items[target], items[index]];
  return save(userId, items);
}

export async function renameRoadmap(userId: string, title: string): Promise<Roadmap> {
  const roadmap = await getRoadmap(userId);
  return save(userId, roadmap.items, title.trim() || "My Learning Journey");
}

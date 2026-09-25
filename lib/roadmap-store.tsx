"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAuth } from "./auth-context";
import type { Roadmap } from "./types";

/** The learner's own roadmap, served by /api/roadmap. */

type RoadmapContextValue = {
  roadmap: Roadmap | null;
  loading: boolean;
  busy: boolean;
  error: string | null;
  addItem: (title: string, description?: string) => Promise<void>;
  updateItem: (
    itemId: string,
    patch: { title?: string; description?: string; completed?: boolean },
  ) => Promise<void>;
  deleteItem: (itemId: string) => Promise<void>;
  moveItem: (itemId: string, direction: "up" | "down") => Promise<void>;
  rename: (title: string) => Promise<void>;
};

const RoadmapContext = createContext<RoadmapContextValue | null>(null);

export function RoadmapProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!user) {
        setRoadmap(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch("/api/roadmap", { cache: "no-store" });
        const data = await response.json();
        if (!cancelled && response.ok) setRoadmap(data.roadmap);
      } catch {
        if (!cancelled) setError("Could not load your roadmap.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [user]);

  /** Every mutation goes through the same endpoint and swaps in the result. */
  const act = useCallback(async (payload: Record<string, unknown>) => {
    setBusy(true);
    try {
      const response = await fetch("/api/roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data?.error ?? "Could not update the roadmap.");
        return;
      }

      setRoadmap(data.roadmap);
      setError(null);
    } catch {
      setError("Could not reach the server.");
    } finally {
      setBusy(false);
    }
  }, []);

  const value = useMemo<RoadmapContextValue>(
    () => ({
      roadmap,
      loading,
      busy,
      error,
      addItem: (title, description) => act({ action: "add", title, description }),
      updateItem: (itemId, patch) => act({ action: "update", itemId, ...patch }),
      deleteItem: (itemId) => act({ action: "delete", itemId }),
      moveItem: (itemId, direction) => act({ action: "reorder", itemId, direction }),
      rename: (title) => act({ action: "rename", title }),
    }),
    [roadmap, loading, busy, error, act],
  );

  return (
    <RoadmapContext.Provider value={value}>{children}</RoadmapContext.Provider>
  );
}

export function useRoadmap() {
  const context = useContext(RoadmapContext);
  if (!context) throw new Error("useRoadmap must be used inside <RoadmapProvider>");
  return context;
}

/**
 * Tiny localStorage wrapper.
 *
 * Every access is guarded: private windows, blocked site data and
 * server-side rendering all make `localStorage` throw or vanish, and none
 * of those should take the app down.
 */

export function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function writeStorage<T>(key: string, value: T): boolean {
  if (typeof window === "undefined") return false;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    // Quota exceeded or storage disabled — the UI keeps working in memory.
    return false;
  }
}

export function clearStorage(key: string) {
  if (typeof window === "undefined") return;

  try {
    window.localStorage.removeItem(key);
  } catch {
    // Nothing to do — the key is unreachable anyway.
  }
}

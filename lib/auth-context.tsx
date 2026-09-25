"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import type { PublicUser } from "./types";

type AuthContextValue = {
  user: PublicUser | null;
  /** False until the first /api/auth/me call settles. */
  ready: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  signup: (input: {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }) => Promise<string | null>;
  logout: () => Promise<void>;
  refresh: () => Promise<void>;
  setUser: (user: PublicUser) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({
  children,
  initialUser = null,
}: {
  children: React.ReactNode;
  /** Passed from the server layout so the first paint already knows. */
  initialUser?: PublicUser | null;
}) {
  const router = useRouter();
  const [user, setUser] = useState<PublicUser | null>(initialUser);
  const [ready, setReady] = useState(initialUser !== null);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/me", { cache: "no-store" });
      const data = await response.json();
      setUser(data.user ?? null);
    } catch {
      setUser(null);
    } finally {
      setReady(true);
    }
  }, []);

  useEffect(() => {
    if (initialUser) {
      setReady(true);
      return;
    }
    void refresh();
  }, [initialUser, refresh]);

  /** Returns an error message, or null when it worked. */
  const login = useCallback(
    async (email: string, password: string) => {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (!response.ok) return data?.error ?? "Could not sign you in.";

      setUser(data.user);
      setReady(true);
      return null;
    },
    [],
  );

  const signup = useCallback(
    async (input: {
      name: string;
      email: string;
      password: string;
      confirmPassword: string;
    }) => {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = await response.json();

      if (!response.ok) return data?.error ?? "Could not create your account.";

      setUser(data.user);
      setReady(true);
      return null;
    },
    [],
  );

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    router.push("/login");
    router.refresh();
  }, [router]);

  const value = useMemo<AuthContextValue>(
    () => ({ user, ready, login, signup, logout, refresh, setUser }),
    [user, ready, login, signup, logout, refresh],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside <AuthProvider>");
  return context;
}

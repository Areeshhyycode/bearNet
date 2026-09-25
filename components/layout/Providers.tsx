"use client";

import { usePathname } from "next/navigation";
import { AuthProvider } from "@/lib/auth-context";
import { NotesProvider } from "@/lib/notes-store";
import { ProgressProvider } from "@/lib/progress-store";
import { RoadmapProvider } from "@/lib/roadmap-store";
import { ToastProvider } from "@/lib/toast";
import { AppShell } from "./AppShell";
import type { PublicUser } from "@/lib/types";

const BARE_ROUTES = ["/login", "/signup"];

/**
 * All client providers in one place.
 *
 * The login and signup screens render without the app chrome, but still sit
 * inside the providers so they can call `useAuth` and `useToast`.
 */
export function Providers({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: PublicUser | null;
}) {
  const pathname = usePathname();
  const bare = BARE_ROUTES.some((route) => pathname.startsWith(route));

  return (
    <ToastProvider>
      <AuthProvider initialUser={initialUser}>
        <ProgressProvider>
          <NotesProvider>
            <RoadmapProvider>
              {bare ? children : <AppShell>{children}</AppShell>}
            </RoadmapProvider>
          </NotesProvider>
        </ProgressProvider>
      </AuthProvider>
    </ToastProvider>
  );
}

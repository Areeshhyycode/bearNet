import { Footer } from "./Footer";
import { Topbar } from "./Topbar";
import { cn } from "@/lib/utils";

/** App chrome shared by every route. */
export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <Topbar />
      <main className="w-full flex-1 pt-16">{children}</main>
      <Footer />
    </div>
  );
}

/** Centered 1440px content column with the standard page rhythm. */
export function PageContainer({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-[1440px] flex-col gap-space-xl px-margin-mobile py-space-lg sm:px-margin",
        className,
      )}
    >
      {children}
    </div>
  );
}

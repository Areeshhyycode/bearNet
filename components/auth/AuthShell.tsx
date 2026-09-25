import Link from "next/link";
import { BearLogo } from "@/components/bears/BearLogo";
import { BearMascot } from "@/components/bears/BearMascot";

/** Shared cozy frame for the login and signup screens. */
export function AuthShell({
  title,
  subtitle,
  children,
  footer,
}: {
  title: React.ReactNode;
  subtitle: string;
  children: React.ReactNode;
  footer: React.ReactNode;
}) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-surface">
      {/* Ambient blush glow, same language as the dashboard hero. */}
      <div className="pointer-events-none absolute -right-24 -top-24 h-[28rem] w-[28rem] rounded-full bg-primary-container/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-secondary-container/30 blur-3xl" />

      <header className="relative z-10 px-margin-mobile py-space-md sm:px-margin">
        <Link href="/login" className="inline-flex items-center gap-space-sm">
          <BearLogo size={32} />
          <span className="font-headline-md text-headline-md font-bold tracking-tight text-on-surface">
            BearNet
          </span>
        </Link>
      </header>

      <main className="relative z-10 flex flex-1 items-center justify-center px-margin-mobile pb-space-xl sm:px-margin">
        <div className="grid w-full max-w-5xl items-center gap-space-xl lg:grid-cols-2">
          {/* Welcome column — hidden on small screens to keep the form first. */}
          <div className="hidden flex-col items-center gap-space-md text-center lg:flex">
            <div className="flex items-end gap-2">
              <BearMascot variant="grizzly" size={96} animated />
              <BearMascot variant="panda" size={116} animated />
              <BearMascot variant="polar" size={96} animated />
            </div>
            <h2 className="font-headline-lg text-headline-lg font-bold text-on-surface">
              🎀 Your cozy cyber sanctuary
            </h2>
            <p className="max-w-sm font-body-md text-body-md text-on-surface-variant">
              Write notes, ask Panda anything, build your own roadmap, and keep
              every bit of progress in one soft pink place.
            </p>
          </div>

          {/* Form card */}
          <div className="w-full rounded-[28px] bg-surface-container-lowest p-space-lg shadow-hero sm:p-space-xl">
            <div className="mb-space-lg space-y-1">
              <h1 className="font-headline-lg text-headline-lg font-bold text-on-surface">
                {title}
              </h1>
              <p className="font-body-md text-body-md text-on-surface-variant">
                {subtitle}
              </p>
            </div>

            {children}

            <div className="mt-space-lg border-t border-outline-variant/40 pt-space-md text-center font-body-sm text-body-sm text-on-surface-variant">
              {footer}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

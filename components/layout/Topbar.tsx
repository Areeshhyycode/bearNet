"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { LogOut, Menu, Settings, User, X } from "lucide-react";
import { BearLogo } from "@/components/bears/BearLogo";
import { NAV_ITEMS, isActivePath } from "@/lib/nav";
import { useAuth } from "@/lib/auth-context";
import { useProgress } from "@/lib/progress-store";
import { cn } from "@/lib/utils";

/**
 * Fixed navbar shared by every signed-in page.
 *
 * Desktop shows route pills; tablet and mobile collapse into a drawer so
 * nothing ever overflows horizontally.
 */
export function Topbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { streak, xp } = useProgress();

  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  // Close the drawer on navigation.
  useEffect(() => {
    setMenuOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  // Close the account popover on an outside click.
  useEffect(() => {
    if (!accountOpen) return;
    function onClick(event: MouseEvent) {
      if (!accountRef.current?.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [accountOpen]);

  const primaryItems = NAV_ITEMS.filter((item) => item.href !== "/settings");
  const initial = (user?.name ?? "B").slice(0, 1).toUpperCase();

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 w-full bg-surface/85 shadow-faint backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-space-sm px-margin-mobile sm:gap-space-md sm:px-margin">
          {/* Brand */}
          <Link href="/" className="flex shrink-0 items-center gap-2 rounded-full">
            <BearLogo size={30} />
            <span className="font-headline-md text-[19px] font-bold tracking-tight text-on-surface sm:text-headline-md">
              BearNet
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-space-xs rounded-full bg-surface-container-low p-1 xl:flex">
            {primaryItems.map((item) => {
              const active = isActivePath(pathname, item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-full px-3 py-1.5 font-body-sm text-body-sm transition-all duration-200 2xl:px-space-md",
                    active
                      ? "bg-primary-container font-semibold text-on-primary-container shadow-sm"
                      : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Status + account */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-space-sm">
            <div className="hidden items-center gap-1.5 rounded-full bg-surface-container-low px-3 py-1 font-body-sm text-body-sm text-on-surface shadow-[0_1px_4px_rgba(61,39,42,0.04)] sm:flex">
              <span className="text-tertiary" aria-hidden>
                🔥
              </span>
              <span className="font-medium">{streak}</span>
              <span className="hidden md:inline">Day Streak</span>
            </div>

            <div className="hidden items-center gap-1.5 rounded-full bg-secondary-fixed px-3 py-1 font-body-sm text-body-sm text-on-secondary-fixed md:flex">
              <span className="text-secondary" aria-hidden>
                🎀
              </span>
              <span className="font-medium">{xp.toLocaleString()} XP</span>
            </div>

            {/* Account popover */}
            <div className="relative" ref={accountRef}>
              <button
                type="button"
                onClick={() => setAccountOpen((v) => !v)}
                aria-expanded={accountOpen}
                aria-haspopup="menu"
                aria-label="Account menu"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-body-sm text-body-sm font-bold text-on-primary transition-transform active:scale-95"
              >
                {initial}
              </button>

              {accountOpen && (
                <div
                  role="menu"
                  className="animate-fade-up absolute right-0 top-11 w-56 overflow-hidden rounded-[20px] bg-surface-container-lowest p-1.5 shadow-float ring-1 ring-outline-variant/40"
                >
                  <div className="px-3 py-2">
                    <p className="truncate font-body-md text-body-md font-semibold text-on-surface">
                      {user?.name ?? "Bear Learner"}
                    </p>
                    <p className="truncate font-body-sm text-body-sm text-on-surface-variant">
                      {user?.email}
                    </p>
                  </div>

                  <div className="my-1 h-px bg-outline-variant/40" />

                  <Link
                    href="/settings"
                    role="menuitem"
                    className="flex items-center gap-2 rounded-xl px-3 py-2 font-body-sm text-body-sm text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface"
                  >
                    <Settings className="h-4 w-4" /> Settings
                  </Link>
                  <Link
                    href="/community"
                    role="menuitem"
                    className="flex items-center gap-2 rounded-xl px-3 py-2 font-body-sm text-body-sm text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface"
                  >
                    <User className="h-4 w-4" /> Community notes
                  </Link>

                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => void logout()}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 font-body-sm text-body-sm text-on-surface-variant transition-colors hover:bg-error-container hover:text-on-error-container"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </div>
              )}
            </div>

            {/* Drawer toggle */}
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-container-high text-on-surface transition-transform active:scale-95 xl:hidden"
            >
              {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Mobile / tablet drawer */}
        <div
          className={cn(
            "overflow-hidden border-t border-outline-variant/40 bg-surface/95 backdrop-blur-xl transition-[max-height,opacity] duration-300 xl:hidden",
            menuOpen ? "max-h-[560px] opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <nav className="mx-auto grid max-w-[1440px] grid-cols-2 gap-2 px-margin-mobile py-space-md sm:grid-cols-3 sm:px-margin">
            {NAV_ITEMS.map((item) => {
              const active = isActivePath(pathname, item);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 rounded-2xl px-3 py-2.5 font-body-sm text-body-sm transition-all",
                    active
                      ? "bg-primary-container font-semibold text-on-primary-container shadow-sm"
                      : "bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Stats repeated here since they are hidden in the bar on mobile. */}
          <div className="mx-auto flex max-w-[1440px] items-center gap-2 px-margin-mobile pb-space-md sm:px-margin">
            <span className="rounded-full bg-surface-container-low px-3 py-1 font-body-sm text-body-sm">
              🔥 {streak} day streak
            </span>
            <span className="rounded-full bg-secondary-fixed px-3 py-1 font-body-sm text-body-sm text-on-secondary-fixed">
              🎀 {xp.toLocaleString()} XP
            </span>
          </div>
        </div>
      </header>

      {menuOpen && (
        <button
          type="button"
          aria-hidden
          tabIndex={-1}
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-40 bg-inverse-surface/10 backdrop-blur-[2px] xl:hidden"
        />
      )}
    </>
  );
}

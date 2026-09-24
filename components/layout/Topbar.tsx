"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Settings, X } from "lucide-react";
import { BearLogo } from "@/components/bears/BearLogo";
import { NAV_ITEMS, isActivePath } from "@/lib/nav";
import { LEARNER } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

/**
 * Fixed cozy navbar shared by every page: brand, route pills,
 * streak + XP chips and the profile shortcut.
 */
export function Topbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const primaryItems = NAV_ITEMS.filter((item) => item.href !== "/settings");

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 w-full bg-surface/85 shadow-faint backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-space-md px-margin-mobile sm:px-margin">
          {/* Brand */}
          <Link
            href="/"
            className="flex shrink-0 items-center gap-space-sm rounded-full"
          >
            <BearLogo size={32} />
            <span className="font-headline-md text-headline-md font-bold tracking-tight text-on-surface">
              BearNet
            </span>
            <span className="hidden items-center rounded-full bg-primary-fixed px-2 py-0.5 font-label-badge text-label-badge text-on-primary-fixed sm:inline-flex">
              v2.4 cozy
            </span>
          </Link>

          {/* Desktop nav pills */}
          <nav className="hidden items-center gap-space-xs rounded-full bg-surface-container-low p-1 xl:flex">
            {primaryItems.map((item) => {
              const active = isActivePath(pathname, item);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "rounded-full px-space-md py-1.5 font-body-sm text-body-sm transition-all duration-200",
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

          {/* Status chips */}
          <div className="flex items-center gap-space-sm">
            <div className="flex items-center gap-1.5 rounded-full bg-surface-container-low px-3 py-1 font-body-sm text-body-sm text-on-surface shadow-[0_1px_4px_rgba(61,39,42,0.04)]">
              <span className="text-tertiary" aria-hidden>
                🔥
              </span>
              <span className="font-medium">{LEARNER.streak} Day Streak</span>
            </div>
            <div className="hidden items-center gap-1.5 rounded-full bg-secondary-fixed px-3 py-1 font-body-sm text-body-sm text-on-secondary-fixed sm:flex">
              <span className="text-secondary" aria-hidden>
                🎀
              </span>
              <span className="font-medium">
                {LEARNER.xp.toLocaleString()} XP
              </span>
            </div>

            <Link
              href="/settings"
              aria-label="Settings"
              className={cn(
                "hidden h-8 w-8 items-center justify-center rounded-full transition-colors sm:flex",
                pathname === "/settings"
                  ? "bg-primary text-on-primary"
                  : "bg-surface-container-high text-on-surface-variant hover:text-on-surface",
              )}
            >
              <Settings className="h-4 w-4" />
            </Link>

            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-on-primary transition-transform active:scale-95 xl:hidden"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>

            <div className="hidden h-8 w-8 items-center justify-center rounded-full bg-primary font-label-badge text-label-badge text-on-primary xl:flex">
              {LEARNER.name.slice(0, 1)}
            </div>
          </div>
        </div>

        {/* Mobile / tablet drawer */}
        <div
          className={cn(
            "overflow-hidden border-t border-outline-variant/40 bg-surface/95 backdrop-blur-xl transition-[max-height,opacity] duration-300 xl:hidden",
            open ? "max-h-[520px] opacity-100" : "max-h-0 opacity-0",
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
                  onClick={() => setOpen(false)}
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
        </div>
      </header>

      {/* Backdrop for the open drawer */}
      {open && (
        <button
          type="button"
          aria-hidden
          tabIndex={-1}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-inverse-surface/10 backdrop-blur-[2px] xl:hidden"
        />
      )}
    </>
  );
}

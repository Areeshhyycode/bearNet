import * as React from "react";
import { cn } from "@/lib/utils";

/** Level-1 pastel study card: 24px radius, blush ambient shadow. */
export function Card({
  className,
  hoverable = false,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { hoverable?: boolean }) {
  return (
    <div
      className={cn(
        "rounded-[24px] bg-surface-container-lowest p-space-lg shadow-cozy",
        hoverable &&
          "transition-all duration-300 hover:-translate-y-1 hover:shadow-float",
        className,
      )}
      {...props}
    />
  );
}

/** Larger surface for full-width page sections. */
export function Panel({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <section
      className={cn(
        "rounded-[28px] bg-surface-container-lowest p-space-md shadow-cozy sm:p-space-xl",
        className,
      )}
      {...props}
    />
  );
}

/** Inset tinted block used inside cards for stats and snippets. */
export function InsetBox({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl bg-surface-container-low p-space-sm",
        className,
      )}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "font-headline-md text-headline-md font-bold text-on-surface",
        className,
      )}
      {...props}
    />
  );
}

export function CardDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "font-body-sm text-body-sm text-on-surface-variant",
        className,
      )}
      {...props}
    />
  );
}

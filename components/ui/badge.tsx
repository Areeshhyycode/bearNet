import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full font-label-badge text-label-badge",
  {
    variants: {
      tone: {
        blush: "bg-primary-fixed text-on-primary-fixed",
        lavender: "bg-secondary-fixed text-on-secondary-fixed",
        rose: "bg-primary-container text-on-primary-container",
        berry: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
        neutral: "bg-surface-container-high text-on-surface",
        outline:
          "bg-surface-container-lowest text-on-surface-variant ring-1 ring-inset ring-outline-variant",
        mint: "bg-[#DDF2E5] text-[#2F6B4A]",
      },
      size: {
        sm: "px-2 py-0.5",
        md: "px-3 py-1",
      },
      uppercase: {
        true: "uppercase tracking-wider",
        false: "",
      },
    },
    defaultVariants: { tone: "neutral", size: "sm", uppercase: false },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({
  className,
  tone,
  size,
  uppercase,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ tone, size, uppercase }), className)}
      {...props}
    />
  );
}

/** Private 🔒 / Public 🌍 pill used across notes. */
export function VisibilityBadge({
  visibility,
  className,
}: {
  visibility: "private" | "public";
  className?: string;
}) {
  return visibility === "private" ? (
    <Badge tone="neutral" className={className}>
      <span aria-hidden>🔒</span> Private
    </Badge>
  ) : (
    <Badge tone="lavender" className={className}>
      <span aria-hidden>🌍</span> Public
    </Badge>
  );
}

export { badgeVariants };

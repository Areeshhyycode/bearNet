"use client";

import * as React from "react";
import Link from "next/link";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-full font-body-sm text-body-sm font-semibold transition-all duration-200 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-50 whitespace-nowrap",
  {
    variants: {
      variant: {
        primary:
          "bg-primary-container text-on-primary-container shadow-sm hover:bg-primary-fixed-dim hover:shadow-md",
        secondary:
          "bg-surface-container-high text-on-surface hover:bg-primary-container hover:text-on-primary-container hover:shadow-sm",
        outline:
          "bg-surface-container-lowest text-on-surface ring-[1.5px] ring-inset ring-primary-container hover:bg-surface-container-low",
        ghost:
          "bg-transparent text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface",
        solid:
          "bg-primary text-on-primary shadow-sm hover:bg-tertiary hover:shadow-md",
        danger:
          "bg-error-container text-on-error-container hover:bg-error hover:text-on-error",
      },
      size: {
        sm: "px-3 py-1.5 text-label-badge",
        md: "px-4 py-2.5",
        lg: "px-6 py-3 text-body-md",
        icon: "h-10 w-10 p-0",
      },
      block: {
        true: "w-full",
        false: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      block: false,
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  href?: string;
}

/** Pill-shaped action control, per the BearNet design system. */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, block, href, children, ...props }, ref) => {
    const classes = cn(buttonVariants({ variant, size, block }), className);

    if (href) {
      return (
        <Link href={href} className={classes}>
          {children}
        </Link>
      );
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  },
);
Button.displayName = "Button";

export { buttonVariants };

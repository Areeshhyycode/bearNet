"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Small confirmation that slides up from the bottom.
 * `message` changing re-triggers it; it hides itself after `duration`.
 */
export function Toast({
  message,
  duration = 2600,
}: {
  message: string | null;
  duration?: number;
}) {
  const [visible, setVisible] = useState(false);
  const [shown, setShown] = useState<string | null>(null);

  useEffect(() => {
    if (!message) return;

    setShown(message);
    setVisible(true);
    const timeout = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timeout);
  }, [message, duration]);

  if (!shown) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-inverse-surface px-5 py-3 font-body-md text-body-md font-medium text-inverse-on-surface shadow-float transition-all duration-300",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      {shown}
    </div>
  );
}

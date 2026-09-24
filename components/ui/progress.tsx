import { cn } from "@/lib/utils";

/** Soft pill progress track with an eased fill. */
export function ProgressBar({
  value,
  className,
  barClassName,
  size = "md",
  label,
}: {
  value: number;
  className?: string;
  barClassName?: string;
  size?: "sm" | "md" | "lg";
  label?: string;
}) {
  const height = { sm: "h-2", md: "h-3", lg: "h-4" }[size];
  const clamped = Math.max(0, Math.min(100, value));

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-full bg-surface-container p-0.5",
        height,
        className,
      )}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label}
    >
      <div
        className={cn(
          "h-full rounded-full bg-primary transition-all duration-700 ease-out",
          barClassName,
        )}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}

/** Circular percentage dial for scores and mastery. */
export function ProgressRing({
  value,
  size = 132,
  stroke = 12,
  children,
  className,
  trackClassName = "stroke-surface-container-high",
  barClassName = "stroke-primary",
}: {
  value: number;
  size?: number;
  stroke?: number;
  children?: React.ReactNode;
  className?: string;
  trackClassName?: string;
  barClassName?: string;
}) {
  const clamped = Math.max(0, Math.min(100, value));
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          className={trackClassName}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn("transition-all duration-1000 ease-out", barClassName)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {children}
      </div>
    </div>
  );
}

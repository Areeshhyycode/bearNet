import { cn } from "@/lib/utils";

/**
 * BearNet brand mark — an original bear paw whose toes double as network
 * nodes, wrapped in soft wifi waves. Drawn from scratch.
 */
export function BearLogo({
  size = 32,
  className,
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 64 64"
      width={size}
      height={size}
      fill="none"
      role="img"
      aria-label="BearNet logo"
      className={cn("shrink-0", className)}
    >
      <rect width="64" height="64" rx="18" fill="#FFD9E2" />

      {/* wifi waves */}
      <path
        d="M14 22 C21 13, 43 13, 50 22"
        stroke="#E8A5B8"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M20 28 C25 21, 39 21, 44 28"
        stroke="#F8B4C7"
        strokeWidth="2.6"
        strokeLinecap="round"
        fill="none"
      />

      {/* paw pad */}
      <ellipse cx="32" cy="44" rx="13" ry="11" fill="#8B5A2B" />
      <ellipse cx="32" cy="45" rx="8" ry="6.5" fill="#FFC0CB" />

      {/* toes / nodes */}
      <circle cx="18" cy="35" r="5" fill="#8B5A2B" />
      <circle cx="18" cy="35" r="2.2" fill="#FF85A2" />
      <circle cx="27" cy="29" r="5" fill="#8B5A2B" />
      <circle cx="27" cy="29" r="2.2" fill="#FF85A2" />
      <circle cx="37" cy="29" r="5" fill="#8B5A2B" />
      <circle cx="37" cy="29" r="2.2" fill="#FF85A2" />
      <circle cx="46" cy="35" r="5" fill="#8B5A2B" />
      <circle cx="46" cy="35" r="2.2" fill="#FF85A2" />

      {/* node links */}
      <path
        d="M18 35 L27 29 M27 29 L37 29 M37 29 L46 35"
        stroke="#9d3c5f"
        strokeWidth="1.6"
        strokeDasharray="1 3"
        strokeLinecap="round"
      />
    </svg>
  );
}

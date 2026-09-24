import { cn } from "@/lib/utils";

export type BearVariant = "grizzly" | "panda" | "polar";

type Palette = {
  fur: string;
  furDark: string;
  ear: string;
  earInner: string;
  snout: string;
  ink: string;
  accessory: string;
  accessoryDark: string;
};

/** Original mascot palettes — brown, panda and polar study buddies. */
const PALETTES: Record<BearVariant, Palette> = {
  grizzly: {
    fur: "#A06535",
    furDark: "#8B5A2B",
    ear: "#8B5A2B",
    earInner: "#FFC0CB",
    snout: "#FFF5EE",
    ink: "#3F2416",
    accessory: "#E8A5B8",
    accessoryDark: "#9d3c5f",
  },
  panda: {
    fur: "#FFFFFF",
    furDark: "#F1E6E8",
    ear: "#3A2C2E",
    earInner: "#FFC0CB",
    snout: "#FFF8F7",
    ink: "#2A1619",
    accessory: "#DFBAE9",
    accessoryDark: "#71547c",
  },
  polar: {
    fur: "#FFFDFC",
    furDark: "#F4E7E9",
    ear: "#F4D9DE",
    earInner: "#FFC0CB",
    snout: "#FFF8F7",
    ink: "#2A1619",
    accessory: "#B7DCF2",
    accessoryDark: "#5E93B5",
  },
};

export type BearMascotProps = {
  variant?: BearVariant;
  /** Pixel size of the square canvas. */
  size?: number;
  /** Rounded blush plate behind the bear. */
  withPlate?: boolean;
  /** Gentle floating animation. */
  animated?: boolean;
  className?: string;
  title?: string;
};

/**
 * Original BearNet mascot — drawn from scratch as plain SVG.
 * No third-party character art is used anywhere in this project.
 */
export function BearMascot({
  variant = "grizzly",
  size = 72,
  withPlate = true,
  animated = false,
  className,
  title,
}: BearMascotProps) {
  const p = PALETTES[variant];
  const label =
    title ??
    {
      grizzly: "Grizzly, the note-taking brown bear",
      panda: "Panda, the AI study buddy",
      polar: "Polar, the cyber lab bear",
    }[variant];

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      fill="none"
      role="img"
      aria-label={label}
      className={cn(animated && "animate-bear-bob", className)}
    >
      <title>{label}</title>

      {withPlate && (
        <>
          <rect width="200" height="200" rx="52" fill="#FFF0F5" />
          <circle cx="100" cy="118" r="46" fill="#FFB6C1" opacity="0.28" />
        </>
      )}

      {/* Ears */}
      <circle cx="66" cy="60" r="21" fill={p.ear} />
      <circle cx="66" cy="60" r="11" fill={p.earInner} />
      <circle cx="134" cy="60" r="21" fill={p.ear} />
      <circle cx="134" cy="60" r="11" fill={p.earInner} />

      {/* Head */}
      <ellipse cx="100" cy="98" rx="49" ry="43" fill={p.fur} />
      <ellipse cx="100" cy="112" rx="45" ry="29" fill={p.furDark} opacity="0.35" />

      {/* Panda eye patches */}
      {variant === "panda" && (
        <>
          <ellipse
            cx="80"
            cy="94"
            rx="13"
            ry="15"
            fill="#3A2C2E"
            transform="rotate(-12 80 94)"
          />
          <ellipse
            cx="120"
            cy="94"
            rx="13"
            ry="15"
            fill="#3A2C2E"
            transform="rotate(12 120 94)"
          />
        </>
      )}

      {/* Snout */}
      <ellipse cx="100" cy="110" rx="23" ry="16" fill={p.snout} />
      <path
        d="M93 104 C95.5 100.5, 104.5 100.5, 107 104 C104.5 109.5, 95.5 109.5, 93 104 Z"
        fill={p.ink}
      />
      <path
        d="M100 108 L100 114 M95.5 114 C97.6 117.4, 102.4 117.4, 104.5 114"
        stroke={p.ink}
        strokeWidth="2.6"
        strokeLinecap="round"
      />

      {/* Eyes + kawaii twinkle */}
      <ellipse cx="80" cy="93" rx="4.6" ry="6.2" fill={p.ink} />
      <circle cx="78.3" cy="91" r="1.9" fill="#FFFFFF" />
      <ellipse cx="120" cy="93" rx="4.6" ry="6.2" fill={p.ink} />
      <circle cx="118.3" cy="91" r="1.9" fill="#FFFFFF" />

      {/* Blush */}
      <ellipse cx="71" cy="107" rx="7.5" ry="4.8" fill="#FF8DA1" opacity="0.65" />
      <ellipse cx="129" cy="107" rx="7.5" ry="4.8" fill="#FF8DA1" opacity="0.65" />

      {/* Per-bear accessory */}
      {variant === "grizzly" && (
        // Round study glasses
        <g
          stroke={p.accessoryDark}
          strokeWidth="3"
          fill="none"
          opacity="0.9"
        >
          <circle cx="80" cy="93" r="14" />
          <circle cx="120" cy="93" r="14" />
          <path d="M94 93 H106" strokeLinecap="round" />
          <path d="M66 89 L57 84" strokeLinecap="round" />
          <path d="M134 89 L143 84" strokeLinecap="round" />
        </g>
      )}

      {variant === "panda" && (
        // Pastel headphones
        <g>
          <path
            d="M52 96 C52 62, 148 62, 148 96"
            stroke={p.accessory}
            strokeWidth="8"
            strokeLinecap="round"
            fill="none"
          />
          <rect x="41" y="88" width="20" height="30" rx="10" fill={p.accessory} />
          <rect x="139" y="88" width="20" height="30" rx="10" fill={p.accessory} />
          <rect x="45" y="94" width="12" height="18" rx="6" fill="#F8D8FF" />
          <rect x="143" y="94" width="12" height="18" rx="6" fill="#F8D8FF" />
        </g>
      )}

      {variant === "polar" && (
        // Tiny cyber visor badge
        <g>
          <rect
            x="58"
            y="76"
            width="84"
            height="18"
            rx="9"
            fill={p.accessory}
            opacity="0.55"
          />
          <rect
            x="58"
            y="76"
            width="84"
            height="18"
            rx="9"
            stroke={p.accessoryDark}
            strokeWidth="2"
            fill="none"
          />
          <circle cx="146" cy="85" r="4" fill="#9d3c5f" />
        </g>
      )}

      {/* Cute network halo */}
      <path
        d="M50 152 C70 136, 130 136, 150 152"
        stroke="#E06287"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeDasharray="1 6"
      />
      <circle cx="58" cy="147" r="5" fill="#FF85A2" />
      <circle cx="100" cy="139" r="6.5" fill="#D85A80" />
      <circle cx="142" cy="147" r="5" fill="#FF85A2" />
      <path
        d="M100 139 L100 156"
        stroke="#D85A80"
        strokeWidth="3"
        strokeLinecap="round"
      />
      <circle cx="100" cy="159" r="4" fill="#FF85A2" />
    </svg>
  );
}

import { cn } from "@/lib/utils";

/**
 * Original cozy study-room illustration, drawn as plain SVG.
 * Three BearNet mascots around a laptop with mini routers and warm mugs.
 * Used as the hero artwork — no external or licensed assets.
 */
export function BearStudyScene({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 360"
      className={cn("h-full w-full", className)}
      role="img"
      aria-label="Three original bear mascots — a brown bear with glasses, a panda with headphones and a polar bear with a cyber visor — studying networking together in a cozy pink study room."
    >
      <defs>
        <linearGradient id="roomBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#FFF0F5" />
          <stop offset="100%" stopColor="#FFE1E4" />
        </linearGradient>
        <linearGradient id="deskGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F8D3DC" />
          <stop offset="100%" stopColor="#E8A5B8" />
        </linearGradient>
        <radialGradient id="lampGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFD9E2" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#FFD9E2" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="screenGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FFF8F7" />
          <stop offset="100%" stopColor="#FFE9EA" />
        </linearGradient>
      </defs>

      {/* Room */}
      <rect width="640" height="360" fill="url(#roomBg)" />
      <rect y="250" width="640" height="110" fill="#FBDDE3" />

      {/* Window with soft evening light */}
      <rect x="40" y="42" width="120" height="104" rx="16" fill="#FFF8F7" />
      <rect
        x="40"
        y="42"
        width="120"
        height="104"
        rx="16"
        fill="none"
        stroke="#F0BDC8"
        strokeWidth="4"
      />
      <path d="M100 42 V146 M40 94 H160" stroke="#F0BDC8" strokeWidth="4" />
      <circle cx="132" cy="68" r="10" fill="#FFD9E2" />

      {/* Shelf with books + mini router */}
      <rect x="452" y="70" width="150" height="8" rx="4" fill="#E8C3CB" />
      <rect x="466" y="40" width="12" height="30" rx="3" fill="#E8A5B8" />
      <rect x="481" y="46" width="12" height="24" rx="3" fill="#DFBAE9" />
      <rect x="496" y="36" width="12" height="34" rx="3" fill="#F8B4C7" />
      <rect x="511" y="48" width="12" height="22" rx="3" fill="#C9A6D8" />
      {/* mini router */}
      <rect x="540" y="48" width="52" height="22" rx="8" fill="#FFFFFF" />
      <rect
        x="540"
        y="48"
        width="52"
        height="22"
        rx="8"
        fill="none"
        stroke="#F0BDC8"
        strokeWidth="2"
      />
      <path d="M552 48 V32 M580 48 V32" stroke="#C99AA8" strokeWidth="3" strokeLinecap="round" />
      <circle cx="552" cy="30" r="3.5" fill="#9d3c5f" className="animate-twinkle" />
      <circle cx="580" cy="30" r="3.5" fill="#FF85A2" className="animate-twinkle" />
      <circle cx="552" cy="60" r="2.5" fill="#E8A5B8" />
      <circle cx="562" cy="60" r="2.5" fill="#DFBAE9" />
      <circle cx="572" cy="60" r="2.5" fill="#F8B4C7" />

      {/* Hanging bunting */}
      <path
        d="M180 30 Q260 62 340 30"
        stroke="#E8A5B8"
        strokeWidth="2.5"
        fill="none"
      />
      <path d="M212 42 l10 0 -5 12 z" fill="#F8B4C7" />
      <path d="M246 50 l10 0 -5 12 z" fill="#DFBAE9" />
      <path d="M280 50 l10 0 -5 12 z" fill="#FFD9E2" />
      <path d="M312 42 l10 0 -5 12 z" fill="#F8B4C7" />

      {/* Desk lamp */}
      <circle cx="96" cy="196" r="66" fill="url(#lampGlow)" />
      <rect x="86" y="196" width="8" height="54" rx="4" fill="#C99AA8" />
      <rect x="66" y="246" width="48" height="8" rx="4" fill="#C99AA8" />
      <path d="M62 196 q28 -34 56 0 z" fill="#E8A5B8" />

      {/* Potted plant */}
      <path
        d="M596 250 q-6 -34 8 -50 M596 250 q10 -28 -8 -44"
        stroke="#9CC5A1"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M576 248 h40 l-6 30 h-28 z" fill="#E8A5B8" />

      {/* ---- Bears ---- */}

      {/* Brown bear (left) — glasses + notebook */}
      <g>
        <ellipse cx="176" cy="268" rx="52" ry="42" fill="#A06535" />
        <circle cx="150" cy="188" r="15" fill="#8B5A2B" />
        <circle cx="150" cy="188" r="7.5" fill="#FFC0CB" />
        <circle cx="202" cy="188" r="15" fill="#8B5A2B" />
        <circle cx="202" cy="188" r="7.5" fill="#FFC0CB" />
        <ellipse cx="176" cy="212" rx="38" ry="34" fill="#A06535" />
        <ellipse cx="176" cy="222" rx="17" ry="12" fill="#FFF5EE" />
        <path
          d="M171 217 q5 -4 10 0 q-5 5 -10 0z"
          fill="#3F2416"
        />
        <circle cx="163" cy="206" r="3.4" fill="#3F2416" />
        <circle cx="189" cy="206" r="3.4" fill="#3F2416" />
        <circle cx="161.8" cy="204.6" r="1.3" fill="#fff" />
        <circle cx="187.8" cy="204.6" r="1.3" fill="#fff" />
        <g stroke="#9d3c5f" strokeWidth="2.4" fill="none">
          <circle cx="163" cy="206" r="10" />
          <circle cx="189" cy="206" r="10" />
          <path d="M173 206 h6" strokeLinecap="round" />
        </g>
        <ellipse cx="152" cy="217" rx="5.5" ry="3.4" fill="#FF8DA1" opacity="0.55" />
        <ellipse cx="200" cy="217" rx="5.5" ry="3.4" fill="#FF8DA1" opacity="0.55" />
        {/* notebook */}
        <rect
          x="146"
          y="262"
          width="58"
          height="40"
          rx="6"
          fill="#FFF8F7"
          transform="rotate(-8 175 282)"
        />
        <path
          d="M156 274 h36 M156 284 h30 M156 294 h22"
          stroke="#F0BDC8"
          strokeWidth="3"
          strokeLinecap="round"
          transform="rotate(-8 175 282)"
        />
      </g>

      {/* Panda (center) — headphones + laptop */}
      <g>
        <ellipse cx="320" cy="272" rx="56" ry="44" fill="#FFFFFF" />
        <ellipse cx="320" cy="272" rx="56" ry="44" fill="#F1E6E8" opacity="0.4" />
        <circle cx="292" cy="176" r="16" fill="#3A2C2E" />
        <circle cx="348" cy="176" r="16" fill="#3A2C2E" />
        <ellipse cx="320" cy="202" rx="40" ry="35" fill="#FFFFFF" />
        <ellipse
          cx="306"
          cy="196"
          rx="11"
          ry="13"
          fill="#3A2C2E"
          transform="rotate(-12 306 196)"
        />
        <ellipse
          cx="334"
          cy="196"
          rx="11"
          ry="13"
          fill="#3A2C2E"
          transform="rotate(12 334 196)"
        />
        <circle cx="306" cy="196" r="3.6" fill="#FFFFFF" />
        <circle cx="334" cy="196" r="3.6" fill="#FFFFFF" />
        <ellipse cx="320" cy="214" rx="15" ry="11" fill="#FFF8F7" />
        <path d="M315 210 q5 -4 10 0 q-5 5 -10 0z" fill="#2A1619" />
        <path
          d="M320 214 v5 M316 219 q4 4 8 0"
          stroke="#2A1619"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <ellipse cx="292" cy="210" rx="5.5" ry="3.4" fill="#FF8DA1" opacity="0.5" />
        <ellipse cx="348" cy="210" rx="5.5" ry="3.4" fill="#FF8DA1" opacity="0.5" />
        {/* headphones */}
        <path
          d="M282 196 C282 158, 358 158, 358 196"
          stroke="#DFBAE9"
          strokeWidth="7"
          fill="none"
          strokeLinecap="round"
        />
        <rect x="274" y="188" width="16" height="26" rx="8" fill="#DFBAE9" />
        <rect x="350" y="188" width="16" height="26" rx="8" fill="#DFBAE9" />
      </g>

      {/* Polar bear (right) — cyber visor */}
      <g>
        <ellipse cx="462" cy="270" rx="52" ry="42" fill="#FFFDFC" />
        <circle cx="438" cy="190" r="15" fill="#F4D9DE" />
        <circle cx="438" cy="190" r="7.5" fill="#FFC0CB" />
        <circle cx="488" cy="190" r="15" fill="#F4D9DE" />
        <circle cx="488" cy="190" r="7.5" fill="#FFC0CB" />
        <ellipse cx="463" cy="214" rx="38" ry="33" fill="#FFFDFC" />
        <ellipse cx="463" cy="226" rx="16" ry="11" fill="#FFF0F1" />
        <path d="M458 222 q5 -4 10 0 q-5 5 -10 0z" fill="#2A1619" />
        <circle cx="450" cy="210" r="3.2" fill="#2A1619" />
        <circle cx="476" cy="210" r="3.2" fill="#2A1619" />
        <circle cx="448.8" cy="208.6" r="1.2" fill="#fff" />
        <circle cx="474.8" cy="208.6" r="1.2" fill="#fff" />
        <ellipse cx="440" cy="221" rx="5.5" ry="3.4" fill="#FF8DA1" opacity="0.5" />
        <ellipse cx="486" cy="221" rx="5.5" ry="3.4" fill="#FF8DA1" opacity="0.5" />
        {/* visor */}
        <rect
          x="434"
          y="200"
          width="58"
          height="13"
          rx="6.5"
          fill="#B7DCF2"
          opacity="0.5"
        />
        <rect
          x="434"
          y="200"
          width="58"
          height="13"
          rx="6.5"
          fill="none"
          stroke="#5E93B5"
          strokeWidth="2"
        />
        <circle cx="495" cy="206" r="3" fill="#9d3c5f" className="animate-twinkle" />
      </g>

      {/* Desk */}
      <rect x="40" y="290" width="560" height="18" rx="9" fill="url(#deskGrad)" />
      <rect x="40" y="308" width="560" height="10" rx="5" fill="#D98FA5" opacity="0.5" />

      {/* Laptop */}
      <g>
        <rect x="264" y="228" width="112" height="66" rx="8" fill="#FFFFFF" />
        <rect
          x="264"
          y="228"
          width="112"
          height="66"
          rx="8"
          fill="none"
          stroke="#F0BDC8"
          strokeWidth="3"
        />
        <rect x="272" y="236" width="96" height="50" rx="5" fill="url(#screenGrad)" />
        {/* tiny network topology on screen */}
        <circle cx="300" cy="252" r="5" fill="#E8A5B8" />
        <circle cx="340" cy="252" r="5" fill="#DFBAE9" />
        <circle cx="320" cy="274" r="5" fill="#9d3c5f" />
        <path
          d="M300 252 H340 M300 252 L320 274 M340 252 L320 274"
          stroke="#F0BDC8"
          strokeWidth="2"
        />
        <rect x="256" y="292" width="128" height="8" rx="4" fill="#E8C3CB" />
      </g>

      {/* Mug with steam heart */}
      <g>
        <rect x="200" y="266" width="28" height="26" rx="6" fill="#FFF8F7" />
        <rect
          x="200"
          y="266"
          width="28"
          height="26"
          rx="6"
          fill="none"
          stroke="#F0BDC8"
          strokeWidth="2.5"
        />
        <path
          d="M228 272 q10 6 0 14"
          stroke="#F0BDC8"
          strokeWidth="3"
          fill="none"
        />
        <path
          d="M210 258 c-3 -4 3 -8 4 -3 c1 -5 7 -1 4 3 l-4 5 z"
          fill="#F8B4C7"
          className="animate-twinkle"
        />
      </g>

      {/* Stacked books on desk */}
      <rect x="500" y="278" width="66" height="8" rx="3" fill="#DFBAE9" />
      <rect x="504" y="270" width="58" height="8" rx="3" fill="#F8B4C7" />
      <rect x="508" y="262" width="50" height="8" rx="3" fill="#E8A5B8" />

      {/* Sparkles */}
      <path
        d="M420 64 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 z"
        fill="#F8B4C7"
        className="animate-twinkle"
      />
      <path
        d="M212 96 l2.4 6.4 6.4 2.4 -6.4 2.4 -2.4 6.4 -2.4 -6.4 -6.4 -2.4 6.4 -2.4 z"
        fill="#DFBAE9"
        className="animate-twinkle"
      />
    </svg>
  );
}

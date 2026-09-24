import { BearMascot } from "@/components/bears/BearMascot";
import { Badge } from "@/components/ui/badge";
import { TIP_OF_THE_DAY } from "@/lib/mock-data";

/** Panda's daily speech bubble. */
export function TipOfTheDay() {
  return (
    <div className="flex items-start gap-space-md rounded-[28px] bg-surface-container-low p-space-md shadow-[0_4px_16px_rgba(61,39,42,0.03)] sm:p-space-lg lg:col-span-8">
      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full bg-surface-container-lowest shadow-sm">
        <BearMascot variant="panda" size={54} withPlate={false} animated />
      </div>

      <div className="flex min-w-0 flex-col gap-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-headline-md text-[16px] font-bold text-on-surface">
            🐻 Study Buddies Tip of the Day
          </span>
          <Badge tone="blush">From Panda AI</Badge>
        </div>

        <div className="rounded-2xl rounded-tl-sm bg-surface-container-lowest p-space-md font-body-md text-body-md leading-relaxed text-on-surface shadow-sm">
          &ldquo;Remember! A{" "}
          <strong className="font-semibold text-tertiary">MAC address</strong>{" "}
          is physical and burned into the Network Interface Card (NIC), while an{" "}
          <strong className="font-semibold text-primary">IP address</strong> is
          logical and can change depending on your connected network. Keep those
          packet headers tidy! ✨&rdquo;
        </div>

        <div className="flex items-center gap-3 pt-1 font-body-sm text-body-sm text-on-surface-variant">
          <button
            type="button"
            className="flex items-center gap-1 transition-colors hover:text-primary"
          >
            <span aria-hidden>💖</span> Helpful ({TIP_OF_THE_DAY.helpfulCount})
          </button>
          <span aria-hidden>•</span>
          <button
            type="button"
            className="flex items-center gap-1 transition-colors hover:text-primary"
          >
            <span aria-hidden>📌</span> Save to Notes
          </button>
        </div>
      </div>
    </div>
  );
}

import { Badge } from "@/components/ui/badge";
import { PACKET_ROWS } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const PROTO_TONE: Record<string, string> = {
  DNS: "bg-secondary-fixed text-on-secondary-fixed",
  ICMP: "bg-primary-fixed text-on-primary-fixed",
  ARP: "bg-tertiary-fixed text-on-tertiary-fixed-variant",
};

/** Pastel Wireshark-style capture table. Static rows only. */
export function PacketInspector() {
  return (
    <div className="flex flex-col gap-space-md rounded-[28px] bg-surface-container-lowest p-space-md shadow-cozy sm:p-space-lg">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h3 className="font-headline-md text-[16px] font-bold text-on-surface">
            📦 Cozy Packet Inspector
          </h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            The same capture, minus the intimidating grey grid.
          </p>
        </div>
        <Badge tone="mint">● Capturing</Badge>
      </div>

      <div className="overflow-x-auto rounded-[20px] bg-surface-container-low">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <thead>
            <tr className="font-label-badge text-label-badge uppercase tracking-wider text-on-surface-variant">
              <th className="px-3 py-2.5 font-semibold">#</th>
              <th className="px-3 py-2.5 font-semibold">Time</th>
              <th className="px-3 py-2.5 font-semibold">Source</th>
              <th className="px-3 py-2.5 font-semibold">Destination</th>
              <th className="px-3 py-2.5 font-semibold">Proto</th>
              <th className="px-3 py-2.5 font-semibold">Info</th>
            </tr>
          </thead>
          <tbody>
            {PACKET_ROWS.map((row) => (
              <tr
                key={row.no}
                className="border-t border-outline-variant/40 transition-colors hover:bg-surface-container-high/60"
              >
                <td className="px-3 py-2.5 font-label-code text-label-code text-on-surface-variant">
                  {row.no}
                </td>
                <td className="px-3 py-2.5 font-label-code text-label-code text-on-surface-variant">
                  {row.time}
                </td>
                <td className="px-3 py-2.5 font-label-code text-label-code text-on-surface">
                  {row.source}
                </td>
                <td className="px-3 py-2.5 font-label-code text-label-code text-on-surface">
                  {row.dest}
                </td>
                <td className="px-3 py-2.5">
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 font-label-badge text-label-badge",
                      PROTO_TONE[row.proto] ?? "bg-surface-container-high",
                    )}
                  >
                    {row.proto}
                  </span>
                </td>
                <td className="px-3 py-2.5 font-body-sm text-body-sm text-on-surface-variant">
                  {row.info}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

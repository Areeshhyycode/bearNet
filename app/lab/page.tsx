import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/AppShell";
import { PageHeading, SectionHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { ScenarioPanel } from "@/components/lab/ScenarioPanel";
import { TerminalSim } from "@/components/lab/TerminalSim";
import { ChallengeList } from "@/components/lab/ChallengeList";
import { PacketInspector } from "@/components/lab/PacketInspector";
import { LAB_TERMINAL_LINES } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "Pink Bear Cyber Lab",
  description:
    "Hands-on networking troubleshooting scenarios in a cozy simulated terminal.",
};

export default function LabPage() {
  return (
    <PageContainer>
      <PageHeading
        title={
          <>
            <span aria-hidden>🐻‍❄️</span> Pink Bear Cyber Lab
          </>
        }
        subtitle="Break things safely. Polar sets up the scenario, you read the output and work out what went wrong."
        badges={
          <>
            <Badge tone="blush" size="md">
              <span aria-hidden>💻</span> Sandboxed simulator
            </Badge>
            <Badge tone="neutral" size="md">
              Polar Lab v1.8 • nothing here touches a real network
            </Badge>
          </>
        }
      />

      <ScenarioPanel />

      <div className="grid grid-cols-1 gap-space-lg lg:grid-cols-12">
        <div className="flex flex-col gap-space-lg lg:col-span-8">
          <SectionHeading
            eyebrow="Simulated terminal"
            title="Read the output"
            size="md"
            description="Every command and response here is scripted for practice."
          />
          <TerminalSim lines={LAB_TERMINAL_LINES} />
          <PacketInspector />
        </div>

        <div className="flex flex-col gap-space-lg lg:col-span-4">
          <ChallengeList />

          <div className="flex flex-col gap-space-sm rounded-[28px] bg-primary-fixed p-space-lg">
            <h3 className="font-headline-md text-[15px] font-bold text-on-primary-fixed">
              🧭 Polar&apos;s troubleshooting order
            </h3>
            <ol className="space-y-1.5 font-body-sm text-body-sm text-on-primary-fixed/90">
              <li>1. Is the link up? (layer 1)</li>
              <li>2. Do you have an address and a gateway? (layer 3)</li>
              <li>3. Can you reach an IP without a name? (routing)</li>
              <li>4. Can you resolve a name? (DNS)</li>
              <li>5. Is the port actually open? (layer 4)</li>
            </ol>
            <p className="pt-1 font-body-sm text-body-sm text-on-primary-fixed/80">
              Work bottom-up and you will rarely guess.
            </p>
          </div>

          <div className="flex flex-col gap-2 rounded-[28px] bg-surface-container-low p-space-lg">
            <h3 className="font-headline-md text-[15px] font-bold text-on-surface">
              🔧 Command reference
            </h3>
            {[
              { cmd: "ping 8.8.8.8", note: "Is anything out there?" },
              { cmd: "traceroute google.com", note: "Where does it stop?" },
              { cmd: "ipconfig /all", note: "What address do I have?" },
              { cmd: "nslookup bearnet.dev", note: "Can I resolve names?" },
            ].map((item) => (
              <div
                key={item.cmd}
                className="flex flex-col gap-0.5 rounded-xl bg-surface-container-lowest px-3 py-2 shadow-sm"
              >
                <code className="font-label-code text-label-code text-tertiary">
                  $ {item.cmd}
                </code>
                <span className="font-body-sm text-body-sm text-on-surface-variant">
                  {item.note}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

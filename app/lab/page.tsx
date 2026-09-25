import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/AppShell";
import { LabScreen } from "@/components/lab/LabScreen";

export const metadata: Metadata = {
  title: "Pink Bear Cyber Lab",
  description:
    "Hands-on networking troubleshooting scenarios in a cozy simulated terminal.",
};

export default function LabPage() {
  return (
    <PageContainer>
      <LabScreen />
    </PageContainer>
  );
}

import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/AppShell";
import { PageHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { SettingsPanels } from "@/components/settings/SettingsPanels";

export const metadata: Metadata = {
  title: "Settings",
  description: "Tune your cozy study space, buddies and reminders.",
};

export default function SettingsPage() {
  return (
    <PageContainer>
      <PageHeading
        title={
          <>
            <span aria-hidden>⚙️</span> Settings
          </>
        }
        subtitle="Make the sanctuary yours — pick a buddy, set a pace, and decide how often the bears check in."
        badges={
          <>
            <Badge tone="blush" size="md">
              <span aria-hidden>🎀</span> Preferences
            </Badge>
            <Badge tone="outline" size="md">
              Frontend preview — nothing saves yet
            </Badge>
          </>
        }
      />

      <SettingsPanels />
    </PageContainer>
  );
}

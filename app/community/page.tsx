import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/AppShell";
import { CommunityFeed } from "@/components/community/CommunityFeed";

export const metadata: Metadata = {
  title: "Community Notes",
  description: "Notes other learners have chosen to share publicly.",
};

export default function CommunityPage() {
  return (
    <PageContainer>
      <CommunityFeed />
    </PageContainer>
  );
}

import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/AppShell";
import { PublicNoteView } from "@/components/community/PublicNoteView";

export const metadata: Metadata = { title: "Public note" };

export default async function PublicNotePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <PageContainer>
      <PublicNoteView id={id} />
    </PageContainer>
  );
}

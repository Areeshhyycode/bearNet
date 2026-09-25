import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/AppShell";
import { NoteScreen } from "@/components/notes/NoteScreen";

export const metadata: Metadata = { title: "Note Editor" };

export default async function NoteEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <PageContainer>
      <NoteScreen id={id} />
    </PageContainer>
  );
}

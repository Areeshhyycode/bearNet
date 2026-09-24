import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/AppShell";
import { NoteScreen } from "@/components/notes/NoteScreen";
import { NOTES } from "@/lib/mock-data";

type Params = { params: Promise<{ id: string }> };

/** Seeded notes prerender; notes written by the user render on demand. */
export function generateStaticParams() {
  return NOTES.map((note) => ({ id: note.id }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const note = NOTES.find((n) => n.id === id);
  return { title: note ? note.title : "Note Editor" };
}

export default async function NoteEditorPage({ params }: Params) {
  const { id } = await params;

  return (
    <PageContainer>
      <NoteScreen id={id} />
    </PageContainer>
  );
}

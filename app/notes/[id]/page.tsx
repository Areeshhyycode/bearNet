import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageContainer } from "@/components/layout/AppShell";
import { PageHeading } from "@/components/ui/section-heading";
import { Badge, VisibilityBadge } from "@/components/ui/badge";
import { NoteEditor } from "@/components/notes/NoteEditor";
import { NOTES } from "@/lib/mock-data";
import { formatRelative } from "@/lib/utils";

type Params = { params: Promise<{ id: string }> };

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
  const note = NOTES.find((n) => n.id === id);

  if (!note) notFound();

  return (
    <PageContainer>
      <div className="flex flex-col gap-space-md">
        <Link
          href="/notes"
          className="inline-flex w-fit items-center gap-1.5 rounded-full bg-surface-container-low px-3 py-1.5 font-body-sm text-body-sm font-semibold text-on-surface-variant transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Back to all notes
        </Link>

        <PageHeading
          title={
            <>
              <span aria-hidden>✏️</span> What did I learn today?
            </>
          }
          subtitle="Write it in your own words — Panda will use these notes to tutor and quiz you later."
          badges={
            <>
              <Badge tone="blush" size="md">
                <span aria-hidden>{note.emoji}</span> {note.topic}
              </Badge>
              <VisibilityBadge visibility={note.visibility} />
              <Badge tone="outline" size="md">
                Updated {formatRelative(note.updatedAt)}
              </Badge>
            </>
          }
        />
      </div>

      <NoteEditor note={note} />
    </PageContainer>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PageContainer } from "@/components/layout/AppShell";
import { PageHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { NoteEditor } from "@/components/notes/NoteEditor";

export const metadata: Metadata = {
  title: "New Note",
  description: "A blank cozy page for today's networking lesson.",
};

export default async function NewNotePage({
  searchParams,
}: {
  searchParams: Promise<{ topic?: string }>;
}) {
  const { topic } = await searchParams;

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
          subtitle="A fresh page. Dump everything you remember, then tidy it up afterwards."
          badges={
            <>
              <Badge tone="blush" size="md">
                <span aria-hidden>🎀</span> New note
              </Badge>
              <Badge tone="outline" size="md">
                Saves to this browser
              </Badge>
            </>
          }
        />
      </div>

      <NoteEditor initialTopicId={topic} />
    </PageContainer>
  );
}

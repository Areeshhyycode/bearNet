import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/AppShell";
import { PageHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TopicSidebar } from "@/components/notes/TopicSidebar";
import { NewNoteCard, NoteCard } from "@/components/notes/NoteCard";
import { NOTES, NOTE_TOPICS } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "My Notes",
  description: "Every networking note, sorted into cozy topic shelves.",
};

export default function NotesPage() {
  const publicCount = NOTES.filter((n) => n.visibility === "public").length;

  return (
    <PageContainer>
      <PageHeading
        title={
          <>
            <span aria-hidden>📖</span> My Networking Notes
          </>
        }
        subtitle="Everything you have written down, shelved by topic and ready for revision."
        badges={
          <>
            <Badge tone="blush" size="md">
              <span aria-hidden>🐻</span> Grizzly keeps these tidy
            </Badge>
            <Badge tone="neutral" size="md">
              24 notes • {NOTE_TOPICS.length} topics • {publicCount} public
            </Badge>
          </>
        }
        actions={
          <>
            <Button variant="outline" href="/tutor">
              🐼 Ask Panda about a note
            </Button>
            <Button variant="primary" href="/notes/new">
              + Create New Topic
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-space-lg lg:grid-cols-12">
        <TopicSidebar className="lg:col-span-3 lg:sticky lg:top-[88px] lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto" />

        <div className="flex flex-col gap-space-lg lg:col-span-9">
          {/* Filter row */}
          <div className="flex flex-wrap items-center justify-between gap-space-sm rounded-full bg-surface-container-low px-space-md py-2">
            <div className="flex flex-wrap items-center gap-1.5">
              {["All", "🔒 Private", "🌍 Public", "⭐ Starred"].map(
                (filter, index) => (
                  <span
                    key={filter}
                    className={
                      index === 0
                        ? "rounded-full bg-primary-container px-3 py-1 font-body-sm text-body-sm font-semibold text-on-primary-container shadow-sm"
                        : "cursor-pointer rounded-full px-3 py-1 font-body-sm text-body-sm text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
                    }
                  >
                    {filter}
                  </span>
                ),
              )}
            </div>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              Sorted by ✨ recently updated
            </span>
          </div>

          <div className="grid grid-cols-1 gap-space-lg md:grid-cols-2 2xl:grid-cols-3">
            <NewNoteCard />
            {NOTES.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

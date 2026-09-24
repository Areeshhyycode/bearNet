import type { Metadata } from "next";
import { PageContainer } from "@/components/layout/AppShell";
import { NotesWorkspace } from "@/components/notes/NotesWorkspace";

export const metadata: Metadata = {
  title: "My Notes",
  description: "Every networking note, sorted into cozy topic shelves.",
};

export default function NotesPage() {
  return (
    <PageContainer>
      <NotesWorkspace />
    </PageContainer>
  );
}

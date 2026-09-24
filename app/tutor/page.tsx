import type { Metadata } from "next";
import Link from "next/link";
import { PageContainer } from "@/components/layout/AppShell";
import { PageHeading } from "@/components/ui/section-heading";
import { Badge } from "@/components/ui/badge";
import { BearMascot } from "@/components/bears/BearMascot";
import { ChatPanel } from "@/components/tutor/ChatPanel";
import { NOTE_TOPICS, RECENT_NOTES } from "@/lib/mock-data";

export const metadata: Metadata = {
  title: "AI Tutor",
  description: "Panda, your cozy study buddy, grounded in your own notes.",
};

export default function TutorPage() {
  return (
    <PageContainer>
      <PageHeading
        title={
          <>
            <span aria-hidden>🐼</span> My AI Study Buddy
          </>
        }
        subtitle="Ask me anything from your notes."
        badges={
          <>
            <Badge tone="blush" size="md">
              <span className="h-2 w-2 animate-pulse rounded-full bg-tertiary" />
              Panda is online
            </Badge>
            <Badge tone="neutral" size="md">
              24 notes • {NOTE_TOPICS.length} topics in context
            </Badge>
          </>
        }
      />

      <div className="grid grid-cols-1 gap-space-lg lg:grid-cols-12">
        <div className="lg:col-span-8">
          <ChatPanel />
        </div>

        {/* Side rail */}
        <div className="flex flex-col gap-space-lg lg:col-span-4">
          {/* Panda card */}
          <div className="flex flex-col items-center gap-2 rounded-[28px] bg-surface-container-lowest p-space-lg text-center shadow-cozy">
            <BearMascot variant="panda" size={104} animated />
            <h2 className="font-headline-md text-[17px] font-bold text-on-surface">
              Panda
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Patient, a little sleepy, and very good at explaining subnet masks
              twice without sighing.
            </p>
            <div className="mt-1 flex flex-wrap justify-center gap-1.5">
              <Badge tone="lavender">Notes-grounded</Badge>
              <Badge tone="blush">No hallucinations</Badge>
            </div>
          </div>

          {/* Context list */}
          <div className="flex flex-col gap-space-sm rounded-[28px] bg-surface-container-low p-space-lg">
            <h3 className="font-headline-md text-[15px] font-bold text-on-surface">
              📚 Notes in this session
            </h3>
            <ul className="flex flex-col gap-1.5">
              {RECENT_NOTES.map((note) => (
                <li key={note.id}>
                  <Link
                    href={`/notes/${note.id}`}
                    className="flex items-center gap-2 rounded-xl bg-surface-container-lowest px-3 py-2 font-body-sm text-body-sm text-on-surface-variant shadow-sm transition-all hover:-translate-y-0.5 hover:text-primary"
                  >
                    <span aria-hidden>{note.emoji}</span>
                    <span className="truncate">{note.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/notes"
              className="mt-1 rounded-full bg-surface-container-high px-3 py-2 text-center font-body-sm text-body-sm font-semibold text-on-surface transition-all hover:bg-primary-container hover:text-on-primary-container"
            >
              Manage note context
            </Link>
          </div>

          {/* Suggested prompts */}
          <div className="flex flex-col gap-2 rounded-[28px] bg-primary-fixed p-space-lg">
            <h3 className="font-headline-md text-[15px] font-bold text-on-primary-fixed">
              ✨ Try asking
            </h3>
            {[
              "Summarize my OSI note in 5 bullet points",
              "Quiz me on ports until I get 5 right",
              "Give me a real-world example of DHCP failing",
            ].map((prompt) => (
              <button
                key={prompt}
                type="button"
                className="rounded-2xl bg-surface-container-lowest/80 px-3 py-2 text-left font-body-sm text-body-sm text-on-surface transition-all hover:-translate-y-0.5 hover:bg-surface-container-lowest"
              >
                &ldquo;{prompt}&rdquo;
              </button>
            ))}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

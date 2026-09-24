import type { Metadata, Viewport } from "next";
import { AppShell } from "@/components/layout/AppShell";
import { NotesProvider } from "@/lib/notes-store";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "BearNet — Cozy Networking & Cybersecurity Study Hub",
    template: "%s · BearNet",
  },
  description:
    "A cozy, baby-pink study sanctuary for learning networking and cybersecurity — notes, an AI study buddy, quizzes, exams and a hands-on cyber lab.",
};

export const viewport: Viewport = {
  themeColor: "#fff8f7",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        {/* App Router loads this once for the whole app, so the
            pages/_document warning this rule targets does not apply.
            A plain <link> also degrades gracefully when offline,
            unlike next/font which fetches at build time. */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-surface font-body-md text-body-md text-on-surface antialiased">
        <NotesProvider>
          <AppShell>{children}</AppShell>
        </NotesProvider>
      </body>
    </html>
  );
}

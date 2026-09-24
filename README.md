# 🎀 BearNet

A cozy, baby-pink study sanctuary for learning **networking & cybersecurity**, guarded by three original bear mascots.

> **Frontend only.** No backend, database, auth, AI, or API routes. Notes are real and persist in the browser via `localStorage`; everything else still runs on static mock data.

## Getting started

```bash
npm install
npm run dev     # http://localhost:3000
```

Other scripts: `npm run build`, `npm run start`, `npm run lint`.

## Stack

- **Next.js 15** (App Router) + **React 19**
- **TypeScript** (strict)
- **Tailwind CSS 3** with the BearNet design tokens baked into `tailwind.config.ts`
- **lucide-react** icons
- **class-variance-authority**, **clsx**, **tailwind-merge** for component variants

## Routes

| Route | Screen |
| --- | --- |
| `/` | Dashboard — My Learning Hub |
| `/notes` | Notes dashboard with topic sidebar |
| `/notes/new` | Blank note editor |
| `/notes/[id]` | Note editor, prefilled |
| `/tutor` | AI Tutor chat (Panda) |
| `/quiz` | Quiz Me — setup + question interface |
| `/exam` | AI Exam — setup / exam room / result screens |
| `/lab` | Pink Bear Cyber Lab — scenario + simulated terminal |
| `/progress` | My Learning Journey |
| `/settings` | Preferences |

## Structure

```
app/            route segments (App Router)
components/
  layout/       AppShell, Topbar, Footer
  ui/           button, card, badge, progress, segmented, option-card, field…
  bears/        original mascot + scene SVGs
  dashboard/    hero, module cards, tip, countdown, pomodoro
  notes/        topic sidebar, note card, note editor
  tutor/        chat bubbles, chat panel
  quiz/         question card, quiz runner, quiz setup
  exam/         exam workspace, result screen
  lab/          terminal simulator, scenario panel, packet inspector
  progress/     journey track, activity chart, badges
  settings/     settings panels
lib/
  mock-data.ts  all static content
  nav.ts        navigation config
  utils.ts      cn() + relative time
```

## Design system

Tokens live in `tailwind.config.ts` and mirror `DESIGN.md`:

- **Surfaces** — warm cream `#fff8f7`, milk white cards, blush containers
- **Primary** `#844e5f`, **primary-container** `#e8a5b8`, **tertiary** `#9d3c5f`
- **Type** — Plus Jakarta Sans for everything, JetBrains Mono for IPs, ports and terminal output
- **Shape** — 20–28px card radii, fully pill buttons and chips
- **Elevation** — `shadow-cozy`, `shadow-hero`, `shadow-float`, `shadow-soft`

### Mascots

Grizzly (brown, notes), Panda (AI tutor) and Polar (cyber lab) are **original SVG characters** drawn in `components/bears/`. No third-party character art is used anywhere in this project.

## Notes: what actually works

Notes are a real feature, stored under the `bearnet:notes:v1` key in `localStorage`:

- **Create, edit and delete** notes, with a confirmation step before deleting
- **Create and delete topics** (deleting a topic removes its notes)
- **Markdown toolbar** that wraps the current selection — heading, bold, italic, lists, code, link, image
- **Search, topic filter and private/public filter**, combined and live
- **Derived on save** — slug id, preview, paragraph split, read time, updated timestamp
- Topic counts, dashboard stats and the recent-notes strip all read the same store

The data never leaves the browser, so it is per-device and cleared with site data. `lib/storage.ts` guards every access, so private windows and blocked storage degrade to in-memory instead of crashing.

## What is intentionally not built yet

Chatting with a real model, grading quizzes and exams, running lab commands, auth, and a server-side database. Those buttons render the correct states but do not act.

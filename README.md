# 🎀 BearNet

A cozy, baby-pink study sanctuary for learning **networking & cybersecurity**, guarded by three original bear mascots.

> **Stage 1 — frontend only.** No backend, database, auth, AI, or API routes. Every screen runs on static mock data so the design, components, routes and responsive layout can be locked in before any feature logic is added.

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

## What is intentionally not built yet

Saving notes, chatting with a real model, grading quizzes and exams, running lab commands, auth and persistence. Buttons render the correct states, but no data leaves the browser.

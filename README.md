# 🎀 BearNet

A cozy, baby-pink study platform for learning **networking & cybersecurity**, guarded by three original bear mascots.

Write private notes, publish the ones you want to share, ask an AI tutor grounded in your own words, build your own roadmap, and keep every bit of progress in one soft pink place.

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in your own values
npm run dev                  # http://localhost:3000
```

Create an account at `/signup` — everything else lives behind sign-in.

Other scripts: `npm run build`, `npm run start`, `npm run lint`.

> **Windows + OneDrive note:** `next build` and `next dev` can fight over `.next`. If `npm run dev` exits with an `EINVAL … readlink` error, delete the `.next` folder and start it again.

## Environment

| Variable | What it is |
| --- | --- |
| `MONGODB_URI` | Atlas connection string |
| `MONGODB_DB` | Database name (default `bearnet`) |
| `AUTH_SECRET` | 32+ random characters, signs the session cookie |
| `GROQ_API_KEY` | Powers the AI tutor, quiz generation and learning assistant |
| `GROQ_MODEL` | Chat model (default `openai/gpt-oss-120b`) |

`.env.local` is gitignored. **Never commit real credentials**, and rotate any key that has been shared in chat or email.

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript** (strict)
- **MongoDB Atlas** via the official driver
- **Auth**: bcrypt password hashing + a signed JWT session in an httpOnly cookie (`jose`)
- **Tailwind CSS 3** with the BearNet design tokens
- **Groq** for AI features, with offline fallbacks throughout

## Routes

| Route | Screen |
| --- | --- |
| `/login`, `/signup` | Authentication |
| `/` | Dashboard — greeting, roadmap, AI assistant, timer, lo-fi, modules |
| `/notes` | Your notes, with search and private/public filters |
| `/notes/new`, `/notes/[id]` | Note editor |
| `/community`, `/community/[id]` | Public notes from other learners |
| `/tutor` | AI tutor (Panda) |
| `/quiz`, `/exam` | Generated quizzes and exams, really graded |
| `/lab` | Simulated terminal troubleshooting scenarios |
| `/progress` | XP, ranks, streak, mastery, badges |
| `/settings` | Profile, buddy, preferences |

## Security model

Privacy is enforced in the **database query**, not in the UI:

- Every API route resolves the user from the signed session cookie. A `userId` in a request body is ignored.
- Owner-scoped reads and writes filter by `{ _id, userId }`, so another user's note simply does not match — it returns `404` rather than revealing that it exists.
- The community feed pins `visibility: "public"` in the query, and strips `userId` from every result.
- `middleware.ts` redirects signed-out visitors, and each API route re-checks the session independently.

Verified by an automated suite covering cross-user reads, edits, deletes, spoofed ids and the public endpoint.

## Data model

```
users     { _id, name, email (unique), passwordHash, createdAt }
notes     { _id, userId, authorName, title, content, category,
            emoji, tags, visibility: "private"|"public",
            createdAt, updatedAt }
roadmaps  { userId, title, items: [{ id, title, description,
            completed, order }], updatedAt }
progress  { userId, xp, runs[], labsSolved[], studyDays[],
            minutesByDay{}, notesWritten, preferences }
```

Indexes: unique `users.email`, `notes.{userId, updatedAt}`, `notes.{visibility, updatedAt}`, unique `roadmaps.userId` and `progress.userId`.

## Structure

```
app/
  (auth)/login, (auth)/signup   auth screens, no app chrome
  api/auth/*                    signup, login, logout, me
  api/notes, api/notes/[id]     owner-scoped CRUD
  api/notes/public/*            community feed
  api/roadmap, api/progress     per-user documents
  api/tutor, api/quiz, api/ai/journey
components/
  auth/ layout/ ui/ bears/ notes/ community/
  roadmap/ tutor/ quiz/ exam/ lab/ progress/ settings/
lib/
  auth/      session (JWT), password hashing, route guard
  db/        mongo connection + one repository per collection
  *-store.tsx  client state backed by the API
  types.ts   shapes shared across the network boundary
middleware.ts
```

## Design system

Tokens live in `tailwind.config.ts`: warm cream `#fff8f7` surfaces, primary `#844e5f`, container `#e8a5b8`, tertiary `#9d3c5f`, Plus Jakarta Sans with JetBrains Mono for anything technical, 20–28px radii, fully pill buttons.

The three mascots — Grizzly (notes), Panda (AI tutor) and Polar (cyber lab) — are **original SVGs** in `components/bears/`. No third-party character art is used anywhere.

## Notes on the AI

The tutor, quiz generator and learning assistant all call Groq from the server, so the API key never reaches the browser. Each has a fallback: quizzes drop to a built-in question bank, and the learning assistant returns a roadmap-based suggestion if the model is unreachable.

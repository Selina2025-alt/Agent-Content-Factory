# Content Creation and Auto Distribution Agent

This is a Next.js + SQLite application for multi-platform content workflows.

## Features (Current Snapshot)

- Unified task creation entry.
- Multi-platform generation structure:
  - WeChat article
  - Xiaohongshu note
  - Twitter
  - Video script
- Local history and draft persistence.
- Skills upload and parsing (`ZIP` / GitHub install flow in API layer).
- Workspace editing, copy, and export actions.

## Tech Stack

- Next.js 15
- React 19
- SQLite (local file)
- Vitest + Testing Library

## Prerequisites

- Node.js 20+
- npm 10+

## Setup

```powershell
npm install
Copy-Item .env.example .env.local
```

Edit `.env.local`:

```env
CONTENT_CREATION_AGENT_DATA_ROOT=.codex-data
```

## Run

```powershell
npm run dev
```

Open:

```text
http://localhost:3000
```

## Test and Quality

```powershell
npm run test
npm run lint
npm run build
```

## Data Storage

By default, runtime data is stored under:

```text
.codex-data/
```

Contains:

- `content-creation-agent.sqlite`
- uploaded/unpacked skill files

## Important Notes

- Do not commit `.env.local`.
- Do not commit local runtime DB snapshots unless you explicitly want fixture data in git.
- For shared team onboarding, prefer `.env.example` + README instructions only.


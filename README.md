# Agent Content Factory

Agent Content Factory is a workspace for content teams.  
It contains two project tracks:

- `内容创作与自动分发agent`: Next.js + SQLite multi-platform content creation app.
- `数据采集与选题分析agent`: content monitoring and topic analysis docs/prototype assets.

This repository is prepared so a new user can clone, configure, and run locally.

## 1) Clone Repository

```powershell
git clone https://github.com/Selina2025-alt/Agent-Content-Factory.git
cd Agent-Content-Factory
```

## 2) Run Content Creation Agent (Recommended)

Project path:

```text
内容创作与自动分发agent
```

Install and start:

```powershell
cd 内容创作与自动分发agent
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open:

```text
http://localhost:3000
```

## 3) Environment Configuration

Edit `内容创作与自动分发agent/.env.local`.

Required for local persistence:

- `CONTENT_CREATION_AGENT_DATA_ROOT`

Example:

```env
CONTENT_CREATION_AGENT_DATA_ROOT=.codex-data
```

Security notes:

- Never commit real API keys or tokens.
- Keep secrets only in `.env.local` or system environment variables.

## 4) Useful Commands

Under `内容创作与自动分发agent`:

```powershell
npm run dev
npm run test
npm run lint
npm run build
npm run start
```

## 5) Data Monitoring Prototype (Optional)

Path:

```text
数据采集与选题分析agent/prototype
```

Quick preview:

- Open `content-monitoring-replica.html` directly, or
- Serve locally:

```powershell
cd 数据采集与选题分析agent/prototype
python -m http.server 4173
```

Then open:

```text
http://127.0.0.1:4173/content-monitoring-replica.html
```

## 6) Repository Structure

```text
Agent-Content-Factory/
├─ 内容创作与自动分发agent/
│  ├─ src/                        # Next.js app source
│  ├─ docs/                       # design/spec/status/acceptance docs
│  ├─ package.json
│  └─ .env.example
├─ 数据采集与选题分析agent/
│  ├─ prototype/                  # static prototype
│  └─ docs/
├─ tools/
│  └─ sync-to-github.ps1
└─ README.md
```

## 7) Troubleshooting

- If `npm install` fails, make sure Node.js 20+ is installed.
- If app boot fails on data paths, set `CONTENT_CREATION_AGENT_DATA_ROOT` to a writable directory.
- If pages look stale, clear `.next` and restart:

```powershell
Remove-Item -Recurse -Force .next
npm run dev
```


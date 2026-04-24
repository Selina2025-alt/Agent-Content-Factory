# Agent Content Factory

Agent Content Factory is a multi-project workspace for AI-assisted content workflows.

It currently includes two tracks:

- `内容创作与自动分发agent`: Next.js + SQLite app for cross-platform generation, editing, export, and publish flows.
- `数据采集与选题分析agent`: monitoring and topic-analysis prototype/docs.

## 1) Clone

```powershell
git clone https://github.com/Selina2025-alt/Agent-Content-Factory.git
cd Agent-Content-Factory
```

## 2) Run Content Creation Agent (Main App)

```powershell
cd 内容创作与自动分发agent
npm install
Copy-Item .env.example .env.local
```

Edit `内容创作与自动分发agent/.env.local` and fill your keys.

Start dev server:

```powershell
npm run dev
```

Open:

```text
http://localhost:3000
```

## 3) Environment Variables

The app reads runtime config from `.env.local`. A ready template is provided at:

`内容创作与自动分发agent/.env.example`

At minimum, set:

- `CONTENT_CREATION_AGENT_DATA_ROOT`
- `SILICONFLOW_API_KEY`

For publish features, also set:

- `WECHAT_OPENAPI_KEY`
- `XIAOHONGSHU_OPENAPI_KEY`

## 4) Useful Commands

Inside `内容创作与自动分发agent`:

```powershell
npm run dev
npm run test
npm run lint
npm run build
npm run start
```

## 5) Data Monitoring Prototype (Optional)

```powershell
cd 数据采集与选题分析agent/prototype
python -m http.server 4173
```

Open:

```text
http://127.0.0.1:4173/content-monitoring-replica.html
```

## 6) Repository Structure

```text
Agent-Content-Factory/
├─ 内容创作与自动分发agent/
│  ├─ src/
│  ├─ docs/
│  ├─ package.json
│  └─ .env.example
├─ 数据采集与选题分析agent/
│  ├─ prototype/
│  └─ docs/
├─ tools/
└─ README.md
```

## 7) Notes

- Do not commit real secrets in `.env.local`.
- Runtime DB/files are stored under `CONTENT_CREATION_AGENT_DATA_ROOT` (default `.codex-data`).
- If you hit stale build artifacts, remove `.next` and restart dev server.

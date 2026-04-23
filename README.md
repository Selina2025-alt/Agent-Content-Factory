# Agent Content Factory

一个面向内容团队的 Agent 工作区仓库，包含「数据采集与选题分析」与「内容创作与自动分发」两套子项目，以及完整的项目文档、原型与管理资产。

## 你能直接获得什么

- 数据采集与选题分析 Agent：
  - 内容监控前端静态原型（可直接本地打开）
  - Obsidian 项目管理与设计文档
- 内容创作与自动分发 Agent：
  - 产品设计文档、阶段计划、验收清单、素材文档
- GitHub 同步脚本：
  - `tools/sync-to-github.ps1`

## 快速开始（5 分钟）

### 1) 克隆仓库

```powershell
git clone https://github.com/Selina2025-alt/Agent-Content-Factory.git
cd Agent-Content-Factory
```

### 2) 打开项目文档（推荐）

1. 安装 [Obsidian](https://obsidian.md/)。
2. 打开以下任一目录作为 vault：
   - `数据采集与选题分析agent`
   - `内容创作与自动分发agent`

说明：
- 推荐分别打开子目录作为独立 vault，不建议直接把仓库根目录当作 vault。
- 这样可以避免不相关资料混入同一个工作区。

### 3) 运行「数据采集与选题分析」前端原型

原型目录：
- `数据采集与选题分析agent/prototype`

可选方式 A（最快）：
- 直接双击打开 `content-monitoring-replica.html`

可选方式 B（本地服务，推荐）：

```powershell
cd 数据采集与选题分析agent/prototype
python -m http.server 4173
```

浏览器访问：
- `http://127.0.0.1:4173/content-monitoring-replica.html`

## 配置指南（接入真实服务前必看）

### 1) 本地密钥配置

- 真实 API Key / Token 只放在本地环境文件（例如 `.env.local`）。
- 不要把密钥提交到 Git。

如果你的分支里有 `.env.example`，可用以下方式初始化：

```powershell
Copy-Item .env.example .env.local
```

### 2) 本地数据库与运行数据

- 运行期数据（例如 SQLite 文件）默认不建议提交到仓库。
- 换电脑时如需保留历史数据，请手动复制对应数据库文件。

### 3) Obsidian 布局同步

- 已包含 `.obsidian` 配置，便于跨设备复用。
- 如果你不想复用布局，只删除本地 `.obsidian/workspace.json` 即可，不影响文档内容。

## 仓库结构

```text
Agent-Content-Factory/
├─ 数据采集与选题分析agent/
│  ├─ prototype/                    # 内容监控前端静态原型
│  ├─ docs/superpowers/             # specs/plans 设计与计划
│  ├─ 项目管理/ContentPulse/         # 项目管理文档
│  ├─ README.md
│  └─ OBSIDIAN_SETUP.md
├─ 内容创作与自动分发agent/
│  ├─ docs/                         # 验收、阶段状态、测试素材
│  └─ picture.md
└─ tools/
   └─ sync-to-github.ps1
```

## 推荐阅读顺序

1. `数据采集与选题分析agent/OBSIDIAN_SETUP.md`
2. `数据采集与选题分析agent/README.md`
3. `内容创作与自动分发agent/docs/PROJECT_STATUS.md`
4. `内容创作与自动分发agent/docs/ACCEPTANCE_CHECKLIST.md`

## 常见问题

### 为什么我看不到“完整服务端”？

当前仓库以「可交接文档 + 可运行原型 + 项目管理资产」为主。你可以直接使用原型和文档体系；若后续接入完整服务端代码，可在此仓库继续扩展。

### 我要如何把本地改动同步回 GitHub？

你可以使用常规 Git 流程，也可以使用仓库自带脚本：

```powershell
pwsh ./tools/sync-to-github.ps1 -Owner Selina2025-alt -Repo Agent-Content-Factory -Branch main -CommitMessage "Sync snapshot"
```

运行脚本前请先设置 `GITHUB_TOKEN` 环境变量。

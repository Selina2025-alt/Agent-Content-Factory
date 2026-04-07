# 数据采集与选题分析agent

这个项目包含 `ContentPulse` 的前端原型、抓取链路、SQLite 持久化、搜索历史与选题分析能力。

## 运行

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

默认预览地址：

- `http://127.0.0.1:3000`

## Obsidian

仓库中已包含这套项目的 Obsidian 工作文件：

- `.obsidian/`
- `项目管理/ContentPulse/`
- `docs/superpowers/specs/`
- `docs/superpowers/plans/`

这些文件不会影响项目代码运行，但会影响你在另一台电脑上的 Obsidian 使用体验：

- 是否能直接看到相同的项目管理文档
- 是否保留当前的 Obsidian 侧栏/工作区布局
- 是否保留当前启用的核心插件与图谱设置

如果另一台电脑不想复用当前的 Obsidian 布局，可以保留文档，但删除本地的 `.obsidian/workspace.json`。

## 说明

- `.obsidian` 已上传，便于跨电脑继续项目管理
- 运行时 SQLite 数据库默认不进 git，需要单独拷贝本地数据库文件

# Agent 内容工厂

这个仓库当前主要承载 `数据采集与选题分析agent` 项目，也就是 `ContentPulse` 内容监控与选题决策工作台。

## 快速开始

1. 克隆仓库
2. 进入项目目录 `数据采集与选题分析agent`
3. 安装依赖
4. 复制 `.env.example` 为 `.env.local`
5. 填入你自己的服务端密钥
6. 运行开发环境

```powershell
git clone https://github.com/Selina2025-alt/Agent-Content-Factory.git
cd Agent-Content-Factory
cd 数据采集与选题分析agent
npm install
Copy-Item .env.example .env.local
npm run dev
```

浏览器访问：

- `http://127.0.0.1:3000`

## 目录说明

- `数据采集与选题分析agent/`
  - ContentPulse 主项目
- `tools/`
  - 本仓库辅助工具目录

项目详细说明见：

- [`数据采集与选题分析agent/README.md`](./数据采集与选题分析agent/README.md)

"use client";

import { useState, useTransition } from "react";

import type { SkillLearningResultRecord, SkillRecord } from "@/lib/types";

type InstalledSkillPayload = {
  skill: SkillRecord;
  learningResult: SkillLearningResultRecord;
};

export function GithubSkillInstallPanel(props: {
  onInstalled?: (payload: InstalledSkillPayload) => void;
}) {
  const [command, setCommand] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  async function handleInstall() {
    if (!command.trim()) {
      setMessage("请输入一句 GitHub 安装指令。");
      return;
    }

    const response = await fetch("/api/skills/install", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ command })
    });
    const payload = (await response.json()) as
      | InstalledSkillPayload
      | { message?: string };
    const errorMessage = "message" in payload ? payload.message : undefined;

    if (!response.ok || !("skill" in payload) || !payload.learningResult) {
      setMessage(errorMessage ?? "安装失败，请检查仓库和技能路径。");
      return;
    }

    startTransition(() => {
      props.onInstalled?.(payload);
    });
    setCommand("");
    setMessage("GitHub skill 已安装并完成学习。");
  }

  return (
    <section className="settings-card">
      <p className="settings-card__eyebrow">GitHub Install</p>
      <h2 className="settings-card__title">从 GitHub 安装 skill</h2>
      <p className="settings-card__description">
        支持直接输入一句话，例如「请帮我安装 owner/repo 仓库的 skills/writer 技能」。
      </p>

      <div className="editor-field">
        <label htmlFor="github-skill-command">安装指令</label>
        <textarea
          className="settings-command"
          id="github-skill-command"
          onChange={(event) => setCommand(event.target.value)}
          placeholder="请帮我安装 owner/repo 仓库的 skills/writer 技能"
          value={command}
        />
      </div>

      <div className="settings-actions">
        <button disabled={isPending} onClick={handleInstall} type="button">
          {isPending ? "安装中..." : "安装并学习"}
        </button>
      </div>

      {message ? (
        <p className="settings-upload__meta" role="status">
          {message}
        </p>
      ) : null}
    </section>
  );
}

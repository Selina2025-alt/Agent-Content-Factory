import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { SettingsShell } from "@/components/settings/settings-shell";
import type { SkillLearningResultRecord, SkillRecord } from "@/lib/types";

const sampleSkill: SkillRecord = {
  id: "skill-1",
  name: "效率写作规则包",
  sourceType: "zip",
  sourceRef: ".codex-data/skills/uploads/skill-1-demo.zip",
  summary: "帮助生成结构化的效率内容",
  status: "ready",
  createdAt: "2026-04-08T00:00:00.000Z",
  updatedAt: "2026-04-08T00:00:00.000Z"
};

const sampleLearningResult: SkillLearningResultRecord = {
  skillId: "skill-1",
  summary: "帮助生成结构化的效率内容",
  rules: ["Read SKILL.md", "Apply workflow before generation"],
  platformHints: ["wechat"],
  keywords: ["efficiency", "writer"],
  examplesSummary: ["examples/example-1.md"],
  updatedAt: "2026-04-08T00:00:00.000Z"
};

describe("SettingsShell", () => {
  it("renders upload panel, skills library, and selected skill detail", () => {
    render(
      <SettingsShell
        initialSkillDetails={{ [sampleSkill.id]: sampleLearningResult }}
        initialSkills={[sampleSkill]}
      />
    );

    expect(
      screen.getByRole("button", { name: "Skills Library" })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Skills Library" })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "上传 zip 技能包" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "从 GitHub 安装 skill" })
    ).toBeInTheDocument();
    expect(screen.getAllByText("效率写作规则包")[0]).toBeInTheDocument();
    expect(screen.getByText("efficiency")).toBeInTheDocument();
    expect(screen.getByText("examples/example-1.md")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "公众号文章" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Twitter" })).toBeInTheDocument();
  });
});

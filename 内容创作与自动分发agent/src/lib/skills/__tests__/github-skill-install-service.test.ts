// @vitest-environment node

import { afterEach, describe, expect, it, vi } from "vitest";

import { installSkillFromGithub } from "@/lib/skills/github-skill-install-service";

describe("installSkillFromGithub", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("rejects when the remote SKILL.md cannot be downloaded", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 404
      })
    );

    await expect(
      installSkillFromGithub({
        command: "请帮我安装 openai/demo 仓库的 skills/writer 技能"
      })
    ).rejects.toThrow("SKILL.md");
  });

  it("downloads and learns a github skill from a natural language command", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      text: async () =>
        [
          "name: Github Writer",
          "description: Helps adapt longform content into multiple platforms"
        ].join("\n")
    });

    vi.stubGlobal("fetch", fetchMock);

    const result = await installSkillFromGithub({
      command: "请帮我安装 openai/demo 仓库的 skills/writer 技能"
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://raw.githubusercontent.com/openai/demo/main/skills/writer/SKILL.md"
    );
    expect(result.name).toBe("Github Writer");
    expect(result.sourceRef).toBe(
      "https://github.com/openai/demo/tree/main/skills/writer"
    );
    expect(result.learningResult.summary).toBe(
      "Helps adapt longform content into multiple platforms"
    );
  });
});

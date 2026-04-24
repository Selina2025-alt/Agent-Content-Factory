import { randomUUID } from "node:crypto";

import { learnSkill } from "@/lib/skills/skill-learning-service";
import { parseSkillMarkdown } from "@/lib/skills/skill-parser";

type GithubInstallCommand = {
  command: string;
  ref?: string;
};

type GithubInstallTarget = {
  repo: string;
  path: string;
  ref?: string;
};

function normalizePath(path: string) {
  return path.replace(/^\/+/, "").replace(/\/+$/, "");
}

function resolveGithubInstallTarget(
  input: GithubInstallCommand | GithubInstallTarget
) {
  if ("repo" in input && "path" in input) {
    return {
      repo: input.repo,
      path: normalizePath(input.path),
      ref: input.ref ?? "main"
    };
  }

  const repoMatch = input.command.match(/([A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+)/);
  const pathMatch =
    input.command.match(/(?:仓库的|的)\s*([A-Za-z0-9_./-]+)\s*技能/) ??
    input.command.match(/\b(skills\/[A-Za-z0-9_./-]+)\b/);

  if (!repoMatch) {
    throw new Error("Could not parse GitHub repo from install command");
  }

  if (!pathMatch) {
    throw new Error("Could not parse skill path from install command");
  }

  return {
    repo: repoMatch[1],
    path: normalizePath(pathMatch[1]),
    ref: input.ref ?? "main"
  };
}

export async function installSkillFromGithub(
  input: GithubInstallCommand | GithubInstallTarget
) {
  const target = resolveGithubInstallTarget(input);
  const rawUrl = `https://raw.githubusercontent.com/${target.repo}/${target.ref}/${target.path}/SKILL.md`;
  const response = await fetch(rawUrl);

  if (!response.ok) {
    throw new Error("Failed to download SKILL.md from GitHub");
  }

  const markdown = await response.text();

  if (!markdown.includes("name:")) {
    throw new Error("Downloaded skill is missing SKILL.md metadata");
  }

  const parsed = parseSkillMarkdown(markdown);

  return {
    id: randomUUID(),
    name: parsed.title,
    markdown,
    sourceRef: `https://github.com/${target.repo}/tree/${target.ref}/${target.path}`,
    learningResult: learnSkill({
      markdown,
      references: [`${target.path}/SKILL.md`]
    })
  };
}

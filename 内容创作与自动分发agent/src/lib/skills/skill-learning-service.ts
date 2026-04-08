import { parseSkillMarkdown } from "@/lib/skills/skill-parser";

export function learnSkill(input: { markdown: string; references: string[] }) {
  const parsed = parseSkillMarkdown(input.markdown);

  return {
    summary: parsed.description,
    rules: ["Read SKILL.md", "Apply workflow before generation"],
    platformHints: [],
    keywords: parsed.title.toLowerCase().split(/\s+/),
    examplesSummary: input.references.slice(0, 3)
  };
}

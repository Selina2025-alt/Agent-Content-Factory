import { openDatabase } from "@/lib/db/client";
import type { SkillLearningResultRecord, SkillRecord } from "@/lib/types";

export function listSkills() {
  const db = openDatabase();
  const rows = db
    .prepare(
      `SELECT id, name, source_type, source_ref, summary, status, created_at, updated_at
       FROM skills
       ORDER BY updated_at DESC`
    )
    .all() as Array<{
      id: string;
      name: string;
      source_type: SkillRecord["sourceType"];
      source_ref: string;
      summary: string;
      status: string;
      created_at: string;
      updated_at: string;
    }>;

  db.close();

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    sourceType: row.source_type,
    sourceRef: row.source_ref,
    summary: row.summary,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  }));
}

export function createSkill(input: Omit<SkillRecord, "createdAt" | "updatedAt">) {
  const db = openDatabase();
  const now = new Date().toISOString();

  db.prepare(
    `INSERT INTO skills (
      id,
      name,
      source_type,
      source_ref,
      summary,
      status,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    input.id,
    input.name,
    input.sourceType,
    input.sourceRef,
    input.summary,
    input.status,
    now,
    now
  );

  db.close();
}

export function getSkillById(skillId: string) {
  const db = openDatabase();
  const row = db
    .prepare(
      `SELECT id, name, source_type, source_ref, summary, status, created_at, updated_at
       FROM skills
       WHERE id = ?`
    )
    .get(skillId) as
    | {
        id: string;
        name: string;
        source_type: SkillRecord["sourceType"];
        source_ref: string;
        summary: string;
        status: string;
        created_at: string;
        updated_at: string;
      }
    | undefined;

  db.close();

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    name: row.name,
    sourceType: row.source_type,
    sourceRef: row.source_ref,
    summary: row.summary,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function saveSkillLearningResult(
  skillId: string,
  input: Omit<SkillLearningResultRecord, "skillId" | "updatedAt">
) {
  const db = openDatabase();
  const now = new Date().toISOString();

  db.prepare(
    `INSERT INTO skill_learning_results (
      skill_id,
      summary,
      rules_json,
      platform_hints_json,
      keywords_json,
      examples_summary_json,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(skill_id) DO UPDATE SET
      summary = excluded.summary,
      rules_json = excluded.rules_json,
      platform_hints_json = excluded.platform_hints_json,
      keywords_json = excluded.keywords_json,
      examples_summary_json = excluded.examples_summary_json,
      updated_at = excluded.updated_at`
  ).run(
    skillId,
    input.summary,
    JSON.stringify(input.rules),
    JSON.stringify(input.platformHints),
    JSON.stringify(input.keywords),
    JSON.stringify(input.examplesSummary),
    now
  );

  db.close();
}

export function getSkillLearningResult(skillId: string) {
  const db = openDatabase();
  const row = db
    .prepare(
      `SELECT skill_id, summary, rules_json, platform_hints_json, keywords_json, examples_summary_json, updated_at
       FROM skill_learning_results
       WHERE skill_id = ?`
    )
    .get(skillId) as
    | {
        skill_id: string;
        summary: string;
        rules_json: string;
        platform_hints_json: string;
        keywords_json: string;
        examples_summary_json: string;
        updated_at: string;
      }
    | undefined;

  db.close();

  if (!row) {
    return null;
  }

  return {
    skillId: row.skill_id,
    summary: row.summary,
    rules: JSON.parse(row.rules_json) as string[],
    platformHints: JSON.parse(row.platform_hints_json) as string[],
    keywords: JSON.parse(row.keywords_json) as string[],
    examplesSummary: JSON.parse(row.examples_summary_json) as string[],
    updatedAt: row.updated_at
  };
}

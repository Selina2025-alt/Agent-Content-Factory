import { openDatabase } from "@/lib/db/client";
import type { SkillRecord } from "@/lib/types";

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

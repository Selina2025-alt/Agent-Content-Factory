import { NextResponse } from "next/server";

import { migrateDatabase } from "@/lib/db/migrate";
import {
  getSkillById,
  getSkillLearningResult
} from "@/lib/db/repositories/skill-repository";

export const runtime = "nodejs";

export async function GET(
  _request: Request,
  context: { params: Promise<{ skillId: string }> }
) {
  migrateDatabase();

  const { skillId } = await context.params;
  const skill = getSkillById(skillId);

  if (!skill) {
    return NextResponse.json({ message: "Skill not found" }, { status: 404 });
  }

  return NextResponse.json({
    skill,
    learningResult: getSkillLearningResult(skillId)
  });
}

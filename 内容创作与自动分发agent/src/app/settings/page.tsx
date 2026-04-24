import { SettingsShell } from "@/components/settings/settings-shell";
import { migrateDatabase } from "@/lib/db/migrate";
import {
  getSkillLearningResult,
  listSkills
} from "@/lib/db/repositories/skill-repository";
import type { SkillLearningResultRecord } from "@/lib/types";

export default function SettingsPage() {
  migrateDatabase();

  const skills = listSkills();
  const initialSkillDetails = skills.reduce<
    Record<string, SkillLearningResultRecord | null>
  >((result, skill) => {
    result[skill.id] = getSkillLearningResult(skill.id);
    return result;
  }, {});

  return (
    <SettingsShell
      initialSkillDetails={initialSkillDetails}
      initialSkills={skills}
    />
  );
}

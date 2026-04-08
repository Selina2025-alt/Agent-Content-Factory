import { openDatabase } from "@/lib/db/client";
import type { PlatformId } from "@/lib/types";

export function getPlatformSetting(platform: PlatformId) {
  const db = openDatabase();
  const row = db
    .prepare(
      `SELECT platform, base_rules_json, enabled_skill_ids_json, updated_at
       FROM platform_settings
       WHERE platform = ?`
    )
    .get(platform);

  db.close();

  return row ?? null;
}

export function upsertPlatformSetting(input: {
  platform: PlatformId;
  baseRulesJson: string;
  enabledSkillIdsJson: string;
}) {
  const db = openDatabase();
  const now = new Date().toISOString();

  db.prepare(
    `INSERT INTO platform_settings (platform, base_rules_json, enabled_skill_ids_json, updated_at)
     VALUES (?, ?, ?, ?)
     ON CONFLICT(platform) DO UPDATE SET
       base_rules_json = excluded.base_rules_json,
       enabled_skill_ids_json = excluded.enabled_skill_ids_json,
       updated_at = excluded.updated_at`
  ).run(input.platform, input.baseRulesJson, input.enabledSkillIdsJson, now);

  db.close();
}

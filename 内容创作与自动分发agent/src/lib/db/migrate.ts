import { openDatabase } from "@/lib/db/client";
import { schemaStatements } from "@/lib/db/schema";

export function migrateDatabase() {
  const db = openDatabase();

  for (const statement of schemaStatements) {
    db.exec(statement);
  }

  db.close();
}

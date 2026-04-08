import { notFound } from "next/navigation";

import { WorkspaceShell } from "@/components/workspace/workspace-shell";
import { migrateDatabase } from "@/lib/db/migrate";
import { getTaskBundle } from "@/lib/db/repositories/task-content-repository";
import { getTaskById, listTasks } from "@/lib/db/repositories/task-repository";

export const runtime = "nodejs";

export default async function WorkspacePage(props: {
  params: Promise<{ taskId: string }>;
}) {
  migrateDatabase();

  const { taskId } = await props.params;
  const task = getTaskById(taskId);

  if (!task) {
    notFound();
  }

  return (
    <WorkspaceShell
      initialBundle={getTaskBundle(taskId)}
      initialHistory={listTasks().map((item) => ({
        id: item.id,
        title: item.title,
        updatedAt: item.updatedAt
      }))}
      initialTask={task}
      initialTaskId={taskId}
    />
  );
}

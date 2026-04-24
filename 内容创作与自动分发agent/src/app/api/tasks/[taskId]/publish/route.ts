import { NextResponse } from "next/server";

import { migrateDatabase } from "@/lib/db/migrate";
import { updatePublishStatus } from "@/lib/db/repositories/task-content-repository";
import { getTaskById } from "@/lib/db/repositories/task-repository";
import { mockPublishContent } from "@/lib/publish/mock-publish-service";
import type { PlatformId } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(
  request: Request,
  context: { params: Promise<{ taskId: string }> }
) {
  migrateDatabase();

  const { taskId } = await context.params;
  const task = getTaskById(taskId);

  if (!task) {
    return NextResponse.json({ message: "Task not found" }, { status: 404 });
  }

  const body = (await request.json()) as {
    platform: PlatformId;
  };

  if (body.platform === "videoScript") {
    return NextResponse.json(
      { message: "Video scripts do not support publishing." },
      { status: 400 }
    );
  }

  const result = await mockPublishContent();
  updatePublishStatus(taskId, body.platform, result.status);

  return NextResponse.json(result);
}

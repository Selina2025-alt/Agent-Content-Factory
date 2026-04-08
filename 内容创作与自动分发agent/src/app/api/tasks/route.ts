import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";

import { generateTaskContentBundle } from "@/lib/content/mock-generation-service";
import { migrateDatabase } from "@/lib/db/migrate";
import { createTaskContents } from "@/lib/db/repositories/task-content-repository";
import { createTask, listTasks } from "@/lib/db/repositories/task-repository";
import type { PlatformId } from "@/lib/types";

export const runtime = "nodejs";

export async function GET() {
  migrateDatabase();

  return NextResponse.json(listTasks());
}

export async function POST(request: Request) {
  migrateDatabase();

  const body = (await request.json()) as {
    prompt: string;
    platforms: PlatformId[];
  };

  const taskId = randomUUID();
  const bundle = await generateTaskContentBundle({
    prompt: body.prompt,
    platforms: body.platforms,
    appliedSkillNamesByPlatform: {}
  });

  const title =
    bundle.wechat?.title ??
    bundle.xiaohongshu?.title ??
    bundle.videoScript?.title ??
    body.prompt.slice(0, 24);

  createTask({
    id: taskId,
    title,
    userInput: body.prompt,
    selectedPlatforms: body.platforms,
    status: "ready"
  });
  createTaskContents(taskId, bundle);

  return NextResponse.json({ id: taskId, title, bundle }, { status: 201 });
}

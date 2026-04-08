// @vitest-environment node

import { rmSync } from "node:fs";
import path from "node:path";

import { beforeEach, describe, expect, it } from "vitest";

import {
  GET as getTaskDetail,
  PATCH as patchTask,
  DELETE as deleteTaskRoute
} from "@/app/api/tasks/[taskId]/route";
import { POST as publishTask } from "@/app/api/tasks/[taskId]/publish/route";
import { GET, POST } from "@/app/api/tasks/route";

process.env.CONTENT_CREATION_AGENT_DATA_ROOT = path.join(
  process.cwd(),
  ".codex-data-tests",
  "task-routes"
);

describe("task routes", () => {
  beforeEach(() => {
    rmSync(process.env.CONTENT_CREATION_AGENT_DATA_ROOT!, {
      recursive: true,
      force: true
    });
  });

  it("creates a task, lists it, updates it, and returns persisted content", async () => {
    const createResponse = await POST(
      new Request("http://localhost/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: "写一篇关于如何提高工作效率的内容",
          platforms: ["wechat", "xiaohongshu", "twitter", "videoScript"]
        })
      })
    );

    expect(createResponse.status).toBe(201);

    const created = (await createResponse.json()) as { id: string };
    const listResponse = await GET(new Request("http://localhost/api/tasks"));
    const tasks = (await listResponse.json()) as Array<{ id: string }>;

    expect(tasks.some((task) => task.id === created.id)).toBe(true);

    const detailResponse = await getTaskDetail(
      new Request(`http://localhost/api/tasks/${created.id}`),
      { params: Promise.resolve({ taskId: created.id }) }
    );
    const detail = (await detailResponse.json()) as {
      task: { id: string; title: string };
      bundle: { wechat: { title: string } };
    };

    expect(detail.task.id).toBe(created.id);
    expect(detail.bundle.wechat.title).toBe("高效工作的 5 个底层逻辑");

    const patchResponse = await patchTask(
      new Request(`http://localhost/api/tasks/${created.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          title: "效率专题任务"
        })
      }),
      { params: Promise.resolve({ taskId: created.id }) }
    );

    expect(patchResponse.status).toBe(200);
    expect((await patchResponse.json()).title).toBe("效率专题任务");
  });

  it("publishes supported content through the mock publisher and allows cleanup", async () => {
    const createResponse = await POST(
      new Request("http://localhost/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt: "写一篇关于如何提高工作效率的内容",
          platforms: ["wechat", "xiaohongshu", "twitter", "videoScript"]
        })
      })
    );
    const created = (await createResponse.json()) as { id: string };

    const response = await publishTask(
      new Request(`http://localhost/api/tasks/${created.id}/publish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ platform: "wechat" })
      }),
      { params: Promise.resolve({ taskId: created.id }) }
    );

    expect(response.status).toBe(200);
    expect((await response.json()).message).toBe("发布成功");

    const detailResponse = await getTaskDetail(
      new Request(`http://localhost/api/tasks/${created.id}`),
      { params: Promise.resolve({ taskId: created.id }) }
    );
    const detail = (await detailResponse.json()) as {
      bundle: { wechat: { publishStatus: string } };
    };

    expect(detail.bundle.wechat.publishStatus).toBe("published");

    const deleteResponse = await deleteTaskRoute(
      new Request(`http://localhost/api/tasks/${created.id}`, {
        method: "DELETE"
      }),
      { params: Promise.resolve({ taskId: created.id }) }
    );

    expect(deleteResponse.status).toBe(200);
  });
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { WorkspaceShell } from "@/components/workspace/workspace-shell";

describe("WorkspaceShell", () => {
  it("shows task summary and switches active platform tabs", async () => {
    const user = userEvent.setup();

    render(
      <WorkspaceShell
        initialBundle={{
          videoScript: { publishStatus: "idle", scenes: [], title: "视频脚本" },
          wechat: {
            body: "正文",
            publishStatus: "idle",
            summary: "摘要",
            title: "高效工作的 5 个底层逻辑"
          },
          xiaohongshu: {
            caption: "文案",
            hashtags: [],
            imageSuggestions: [],
            publishStatus: "idle",
            title: "效率翻倍"
          },
          twitter: {
            mode: "thread",
            publishStatus: "idle",
            tweets: ["1/10 test"]
          }
        }}
        initialHistory={[
          {
            id: "task-1",
            title: "高效工作的 5 个底层逻辑",
            updatedAt: "2026-04-08T00:00:00.000Z"
          }
        ]}
        initialTask={{
          id: "task-1",
          title: "高效工作的 5 个底层逻辑",
          userInput: "写一篇关于如何提高工作效率的内容",
          selectedPlatforms: ["wechat", "xiaohongshu", "twitter", "videoScript"],
          status: "ready",
          createdAt: "2026-04-08T00:00:00.000Z",
          updatedAt: "2026-04-08T00:00:00.000Z"
        }}
        initialTaskId="task-1"
      />
    );

    expect(screen.getByText("写一篇关于如何提高工作效率的内容")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "公众号文章" })).toHaveAttribute(
      "aria-selected",
      "true"
    );

    await user.click(screen.getByRole("tab", { name: "Twitter" }));
    expect(screen.getByRole("tab", { name: "Twitter" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(screen.getByRole("heading", { name: "Thread" })).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "小红书笔记" }));
    expect(screen.getByText("图片建议")).toBeInTheDocument();
  });

  it("shows the simulated publish success state after publishing wechat content", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({
      json: async () => ({
        message: "发布成功",
        status: "published"
      }),
      ok: true
    });

    vi.stubGlobal("fetch", fetchMock);

    render(
      <WorkspaceShell
        initialBundle={{
          videoScript: { publishStatus: "idle", scenes: [], title: "视频脚本" },
          wechat: {
            body: "正文",
            publishStatus: "idle",
            summary: "摘要",
            title: "高效工作的 5 个底层逻辑"
          },
          xiaohongshu: null,
          twitter: null
        }}
        initialHistory={[
          {
            id: "task-1",
            title: "高效工作的 5 个底层逻辑",
            updatedAt: "2026-04-08T00:00:00.000Z"
          }
        ]}
        initialTask={{
          id: "task-1",
          title: "高效工作的 5 个底层逻辑",
          userInput: "写一篇关于如何提高工作效率的内容",
          selectedPlatforms: ["wechat"],
          status: "ready",
          createdAt: "2026-04-08T00:00:00.000Z",
          updatedAt: "2026-04-08T00:00:00.000Z"
        }}
        initialTaskId="task-1"
      />
    );

    await user.click(screen.getByRole("button", { name: "发布" }));

    expect(await screen.findByText("发布成功")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith("/api/tasks/task-1/publish", {
      body: JSON.stringify({ platform: "wechat" }),
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST"
    });
  });
});

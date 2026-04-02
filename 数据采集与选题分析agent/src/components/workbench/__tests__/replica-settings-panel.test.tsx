import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import MonitoringWorkbench from "@/components/workbench/monitoring-workbench";

describe("replica settings panel", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders monitor settings groups and allows adding a keyword target with platform bindings", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        items: [],
        rawItems: [],
        meta: {
          source: "xiaohongshu",
          sortedBy: "publish_time_desc",
          persisted: true
        }
      })
    });

    vi.stubGlobal("fetch", fetchMock);

    render(<MonitoringWorkbench />);

    await user.click(screen.getByRole("button", { name: "监控设置" }));

    expect(screen.getByText("监控平台")).toBeInTheDocument();
    expect(screen.getByText("关键词")).toBeInTheDocument();
    expect(screen.getByText("对标账号")).toBeInTheDocument();
    expect(screen.getByText("运行规则")).toBeInTheDocument();

    const keywordInput = screen.getByPlaceholderText("输入新的监控关键词");
    await user.type(keywordInput, "openclaw");
    await user.click(screen.getByTestId("keyword-platform-xiaohongshu"));
    await user.click(screen.getByRole("button", { name: "新增关键词" }));

    expect(screen.getByText("openclaw")).toBeInTheDocument();

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/content/refresh",
        expect.objectContaining({
          method: "POST"
        })
      );
    });
  });
});

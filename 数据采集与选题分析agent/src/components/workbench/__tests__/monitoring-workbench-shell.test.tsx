import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import MonitoringWorkbench from "@/components/workbench/monitoring-workbench";

describe("MonitoringWorkbench shell", () => {
  it("renders the default editorial workbench shell", () => {
    render(<MonitoringWorkbench />);

    expect(
      screen.getByRole("heading", { name: "ClaudeCode 选题监控" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "今日该看什么" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", { name: "选题分析与报告" })
    ).toHaveAttribute("aria-selected", "true");
    expect(
      screen.getByRole("button", { name: "新建监控分类" })
    ).toBeInTheDocument();
    expect(screen.getByText("今日建议动作区")).toBeInTheDocument();
    expect(screen.getByText("监控分类")).toBeInTheDocument();
    expect(screen.getByText("监控摘要")).toBeInTheDocument();
    expect(screen.getByText("判断辅助信息")).toBeInTheDocument();
    expect(screen.getByText("连续上升话题")).toBeInTheDocument();
    expect(screen.getByText("人工待确认项")).toBeInTheDocument();
  });
});

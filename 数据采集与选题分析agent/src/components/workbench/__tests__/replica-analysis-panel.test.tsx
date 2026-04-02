import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import MonitoringWorkbench from "@/components/workbench/monitoring-workbench";

describe("replica analysis panel", () => {
  it("renders daily report content and lets the user switch to summary mode", async () => {
    const user = userEvent.setup();

    render(<MonitoringWorkbench />);

    await user.click(screen.getByRole("button", { name: "选题分析" }));

    expect(screen.getByText("今日热点摘要")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "日报" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "汇总" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "汇总" }));

    expect(screen.getByText("最近 14 天选题方向汇总")).toBeInTheDocument();
  });

  it("jumps back to the content tab when support content is requested", async () => {
    const user = userEvent.setup();

    render(<MonitoringWorkbench />);

    await user.click(screen.getByRole("button", { name: "选题分析" }));
    await user.click(screen.getAllByRole("button", { name: "查看支撑内容" })[0]!);

    expect(screen.getByRole("button", { name: "内容" }).className).toContain("is-active");
  });
});

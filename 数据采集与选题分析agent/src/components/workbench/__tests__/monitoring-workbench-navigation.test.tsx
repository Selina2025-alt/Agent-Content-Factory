import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import MonitoringWorkbench from "@/components/workbench/monitoring-workbench";
import { monitorCategories } from "@/lib/mock-data";

describe("MonitoringWorkbench navigation", () => {
  it("keeps the default workbench contract and updates scoped content", async () => {
    const user = userEvent.setup();
    const firstCategory = monitorCategories[0];
    const vibecodingCategory = monitorCategories[1];

    render(<MonitoringWorkbench />);

    const main = screen.getByRole("main");
    const rightRail = screen.getByRole("complementary", { name: "右侧面板" });

    expect(
      within(main).getByRole("heading", { name: firstCategory.name })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: firstCategory.name,
        pressed: true
      })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("tab", {
        name: "选题分析与报告",
        selected: true
      })
    ).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: vibecodingCategory.name })
    );

    expect(
      within(main).getByRole("heading", { name: vibecodingCategory.name })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: vibecodingCategory.name,
        pressed: true
      })
    ).toBeInTheDocument();
    expect(
      within(main).getByRole("heading", {
        name: `今日最值得跟进的 ${vibecodingCategory.actionItems.length} 个选题`
      })
    ).toBeInTheDocument();
    expect(
      within(main).getByText(vibecodingCategory.actionItems[0].title)
    ).toBeInTheDocument();
    expect(
      within(rightRail).getByText(vibecodingCategory.decisionSignals.priorityDistribution[0])
    ).toBeInTheDocument();
    expect(
      within(rightRail).getByText(vibecodingCategory.decisionSignals.anomalySignals[0])
    ).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "监控策略" }));

    expect(
      screen.getByRole("tab", { name: "监控策略", selected: true })
    ).toBeInTheDocument();
  });
});

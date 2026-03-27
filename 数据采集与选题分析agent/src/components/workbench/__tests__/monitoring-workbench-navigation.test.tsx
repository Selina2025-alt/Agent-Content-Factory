import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import MonitoringWorkbench from "@/components/workbench/monitoring-workbench";
import { monitorCategories } from "@/lib/mock-data";

describe("MonitoringWorkbench navigation", () => {
  it("switches categories and updates the workbench context", async () => {
    const user = userEvent.setup();
    const vibecodingCategory = monitorCategories[1];

    render(<MonitoringWorkbench />);

    await user.click(
      screen.getByRole("button", { name: vibecodingCategory.name })
    );

    expect(
      screen.getByRole("heading", { name: vibecodingCategory.name })
    ).toBeInTheDocument();
    expect(
      screen.getByText("今日最值得跟进的 3 个选题")
    ).toBeInTheDocument();
    expect(screen.getByText(vibecodingCategory.actionItems[0].title)).toBeInTheDocument();
    expect(screen.getByText("平台异常波动提示")).toBeInTheDocument();
    expect(
      screen.getByText(vibecodingCategory.decisionSignals.priorityDistribution[0])
    ).toBeInTheDocument();
    expect(
      screen.getByText(vibecodingCategory.decisionSignals.anomalySignals[0])
    ).toBeInTheDocument();
  });
});

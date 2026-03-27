import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import MonitoringWorkbench from "@/components/workbench/monitoring-workbench";
import { monitorCategories } from "@/lib/mock-data";
import {
  buildInitialWorkbenchState,
  getCurrentDailyReport,
  getLinkedContentIds
} from "@/lib/workbench-selectors";

describe("report evidence bridge", () => {
  it("switches from a report topic to the linked evidence view", async () => {
    const user = userEvent.setup();
    const category = monitorCategories[0];
    const initialState = buildInitialWorkbenchState([category]);
    const report = getCurrentDailyReport(category, initialState.selectedReportDate);
    const topic = report.topics[0];
    const linkedContentIds = getLinkedContentIds(topic);
    const linkedContent = category.content.find(
      (content) => content.id === linkedContentIds[0]
    );

    expect(linkedContent).toBeDefined();

    render(<MonitoringWorkbench />);

    await user.click(screen.getByRole("tab", { name: "内容" }));

    expect(
      screen.getByText(/请先从选题报告中点击 查看支撑内容/)
    ).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "选题分析与报告" }));

    const reportRegion = screen.getByRole("region", {
      name: `${category.name} 报告`
    });
    expect(screen.getByText(report.hotSummary)).toBeInTheDocument();
    expect(screen.getByText(report.focusSummary)).toBeInTheDocument();

    const supportButton = within(reportRegion).getByRole("button", {
      name: `查看支撑内容：${topic.title}`
    });

    await user.click(supportButton);

    expect(screen.getByRole("tab", { name: "内容", selected: true })).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(`已聚焦 ${linkedContentIds.length} 条支撑内容`))
    ).toBeInTheDocument();
    expect(screen.getByText(linkedContent!.title)).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "内容" }));

    expect(
      screen.getByText(new RegExp(`已聚焦 ${linkedContentIds.length} 条支撑内容`))
    ).toBeInTheDocument();
    expect(screen.getByText(linkedContent!.title)).toBeInTheDocument();
  });
});

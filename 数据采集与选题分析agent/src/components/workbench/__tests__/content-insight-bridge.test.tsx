import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import MonitoringWorkbench from "@/components/workbench/monitoring-workbench";
import { monitorCategories } from "@/lib/mock-data";
import {
  buildInitialWorkbenchState,
  getCurrentDailyReport,
  getLinkedContentIds
} from "@/lib/workbench-selectors";

describe("content insight bridge", () => {
  it("returns to the linked report when opening a content item", async () => {
    const user = userEvent.setup();
    const category = monitorCategories[0];
    const initialState = buildInitialWorkbenchState([category]);
    const report = getCurrentDailyReport(category, initialState.selectedReportDate);
    const topic = report.topics[0];
    const linkedContentIds = getLinkedContentIds(topic);
    const linkedContent = category.content.find(
      (content) => content.id === linkedContentIds[0]
    );

    expect(topic).toBeDefined();
    expect(linkedContent).toBeDefined();

    render(<MonitoringWorkbench />);

    await user.click(
      screen.getByRole("button", { name: `查看支撑内容：${topic.title}` })
    );

    expect(screen.getByRole("tab", { name: "内容", selected: true })).toBeInTheDocument();
    expect(screen.getAllByText(new RegExp(`已聚焦 ${linkedContentIds.length} 条支撑内容`)).length).toBeGreaterThan(0);
    expect(screen.getByText(linkedContent!.title)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: `查看关联洞察：${linkedContent!.title}` }));

    expect(
      screen.getByRole("tab", { name: "选题分析与报告", selected: true })
    ).toBeInTheDocument();
    expect(screen.getByText(report.hotSummary)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: `查看支撑内容：${topic.title}` })
    ).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "内容" }));

    expect(
      screen.queryAllByText(new RegExp(`已聚焦 ${linkedContentIds.length} 条支撑内容`)).length
    ).toBe(0);
    expect(screen.getAllByText(/先用平台、时间范围和内容池筛选缩小范围/).length).toBeGreaterThan(0);
    expect(
      screen
        .getByRole("group", { name: "平台筛选" })
        .querySelector('[aria-pressed="true"]')
    ).toHaveTextContent(/全部/);
  });

  it("exits focused evidence mode when manual browsing changes the content date", async () => {
    const user = userEvent.setup();
    const category = monitorCategories[0];
    const initialState = buildInitialWorkbenchState([category]);
    const report = getCurrentDailyReport(category, initialState.selectedReportDate);
    const topic = report.topics[0];
    const linkedContentIds = getLinkedContentIds(topic);
    const alternateDate = category.content.find((content) => content.date !== report.date)?.date;

    expect(alternateDate).toBeDefined();

    render(<MonitoringWorkbench />);

    await user.click(
      screen.getByRole("button", { name: `查看支撑内容：${topic.title}` })
    );

    expect(screen.getAllByText(new RegExp(`已聚焦 ${linkedContentIds.length} 条支撑内容`)).length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: new RegExp(alternateDate!) }));

    expect(
      screen.queryAllByText(new RegExp(`已聚焦 ${linkedContentIds.length} 条支撑内容`)).length
    ).toBe(0);
    expect(screen.getAllByText(/先用平台、时间范围和内容池筛选缩小范围/).length).toBeGreaterThan(0);
  });
});

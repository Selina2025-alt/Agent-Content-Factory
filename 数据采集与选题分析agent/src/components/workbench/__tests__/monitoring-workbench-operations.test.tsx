import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import MonitoringWorkbench from "@/components/workbench/monitoring-workbench";
import { monitorCategories } from "@/lib/mock-data";
import {
  buildInitialWorkbenchState,
  getCurrentDailyReport
} from "@/lib/workbench-selectors";

describe("MonitoringWorkbench operations", () => {
  it("renders global operations and the complete content monitoring workspace", async () => {
    const user = userEvent.setup();

    render(<MonitoringWorkbench />);

    expect(
      screen.getByRole("button", { name: "新建监控分类" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "开始手动扫描" })
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "+ 新分类" })).toBeInTheDocument();

    const summaryRegion = screen.getByRole("region", { name: "监控对象摘要" });
    expect(within(summaryRegion).getByText("覆盖平台")).toBeInTheDocument();
    expect(within(summaryRegion).getByText("重点关键词")).toBeInTheDocument();
    expect(within(summaryRegion).getByText("目标账号")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "开始手动扫描" }));

    expect(screen.getByText("手动扫描中")).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "内容" }));

    expect(screen.getByRole("group", { name: "平台筛选" })).toBeInTheDocument();
    expect(screen.getByRole("group", { name: "时间范围" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "近24小时" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "近3天" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "近7天" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "内容趋势导航" })).toBeInTheDocument();
    expect(screen.getByRole("region", { name: "内容池" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /加入选题池：/ })
    ).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: /查看关联洞察：/ }).length).toBeGreaterThan(0);
  });

  it("supports report and action card shortcuts into evidence, samples and timeline views", async () => {
    const user = userEvent.setup();
    const category = monitorCategories[0];
    const initialState = buildInitialWorkbenchState([category]);
    const report = getCurrentDailyReport(category, initialState.selectedReportDate);
    const topic = report.topics[0];
    const actionItem = category.actionItems[0];

    render(<MonitoringWorkbench />);

    await user.click(
      screen.getByRole("button", { name: `查看证据：${actionItem.title}` })
    );

    expect(screen.getByRole("tab", { name: "内容", selected: true })).toBeInTheDocument();
    expect(screen.getAllByText(/已聚焦 .* 条支撑内容/).length).toBeGreaterThan(0);

    await user.click(screen.getByRole("tab", { name: "选题分析与报告" }));
    await user.click(
      screen.getByRole("button", { name: `查看原始爆款样本：${topic.title}` })
    );

    expect(screen.getAllByText(/已定位 .* 条原始爆款样本/).length).toBeGreaterThan(0);

    await user.click(screen.getByRole("tab", { name: "选题分析与报告" }));
    await user.click(
      screen.getByRole("button", { name: `查看同类内容时间线：${topic.title}` })
    );

    expect(screen.getAllByText(/已切换到同类内容时间线/).length).toBeGreaterThan(0);
  });
});

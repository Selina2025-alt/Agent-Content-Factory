import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import MonitoringWorkbench, {
  buildWorkbenchStateForCategory
} from "@/components/workbench/monitoring-workbench";
import { monitorCategories } from "@/lib/mock-data";
import { buildInitialWorkbenchState } from "@/lib/workbench-selectors";

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
    expect(screen.getByRole("tab", { name: "内容" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "监控设置" })).toBeInTheDocument();

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
      within(main).getByRole("region", {
        name: `今日最值得跟进的 ${vibecodingCategory.actionItems.length} 个选题`
      })
    ).toBeInTheDocument();
    expect(
      within(main).getByText(vibecodingCategory.actionItems[0].title)
    ).toBeInTheDocument();
    expect(
      within(rightRail).getByText("优先级分布")
    ).toBeInTheDocument();
    expect(
      within(rightRail).getByText("平台波动")
    ).toBeInTheDocument();
    expect(
      within(rightRail).getByText(vibecodingCategory.decisionSignals.reviewItems[0])
    ).toBeInTheDocument();
  });

  it("resets category-scoped state when a category changes", () => {
    const vibecodingCategory = monitorCategories[1];
    const initialCategoryState = buildInitialWorkbenchState([vibecodingCategory]);
    const staleState = {
      ...initialCategoryState,
      selectedCategoryId: monitorCategories[0].id,
      reportView: "summary" as const,
      selectedReportDate: "2026-01-01",
      selectedContentDate: "2026-01-01",
      selectedPlatformId: "bilibili" as const,
      focusedTopicId: "stale-topic",
      highlightedContentIds: ["stale-1", "stale-2"]
    };

    const nextState = buildWorkbenchStateForCategory(
      monitorCategories,
      vibecodingCategory.id,
      staleState.activeTab
    );

    expect(nextState.selectedCategoryId).toBe(vibecodingCategory.id);
    expect(nextState.activeTab).toBe(staleState.activeTab);
    expect(nextState.reportView).toBe(initialCategoryState.reportView);
    expect(nextState.selectedReportDate).toBe(
      initialCategoryState.selectedReportDate
    );
    expect(nextState.selectedContentDate).toBe(
      initialCategoryState.selectedContentDate
    );
    expect(nextState.selectedPlatformId).toBe(
      initialCategoryState.selectedPlatformId
    );
    expect(nextState.focusedTopicId).toBe(initialCategoryState.focusedTopicId);
    expect(nextState.highlightedContentIds).toEqual([]);
  });
});

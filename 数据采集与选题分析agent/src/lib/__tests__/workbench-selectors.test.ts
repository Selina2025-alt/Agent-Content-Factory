import { describe, expect, it } from "vitest";

import { monitorCategories } from "@/lib/mock-data";
import {
  buildInitialWorkbenchState,
  getActiveCategory,
  getCurrentDailyReport,
  getLinkedContentIds
} from "@/lib/workbench-selectors";

describe("workbench selectors", () => {
  it("builds the default workbench state from the first category and latest report date", () => {
    const state = buildInitialWorkbenchState(monitorCategories);

    expect(state.selectedCategoryId).toBe("claudecode");
    expect(state.activeTab).toBe("report");
    expect(state.selectedPlatformId).toBe("all");
    expect(state.selectedReportDate).toBe("2026-03-26");
    expect(state.selectedContentDate).toBe("2026-03-26");
  });

  it("returns the expected linked content ids for the first ClaudeCode topic", () => {
    const category = getActiveCategory(monitorCategories, "claudecode");
    const report = getCurrentDailyReport(category, "2026-03-26");
    const topic = report.topics[0];

    expect(getLinkedContentIds(topic)).toEqual([
      "cc-xhs-0326-1",
      "cc-bili-0326-1",
      "cc-dy-0326-1"
    ]);
  });
});

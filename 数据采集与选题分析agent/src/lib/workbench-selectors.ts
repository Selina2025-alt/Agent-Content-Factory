import { MonitorCategory, TopicIdea, WorkbenchState } from "@/lib/types";

function getLatestReportDate(category: MonitorCategory) {
  return category.reports[0]?.date ?? "";
}

export function buildInitialWorkbenchState(categories: MonitorCategory[]): WorkbenchState {
  const firstCategory = categories[0];

  if (!firstCategory) {
    return {
      selectedCategoryId: "",
      activeTab: "report",
      reportView: "daily",
      selectedReportDate: "",
      selectedContentDate: "",
      selectedPlatformId: "all",
      focusedTopicId: null,
      highlightedContentIds: []
    };
  }

  const latestReportDate = getLatestReportDate(firstCategory);
  const firstTopic = firstCategory.reports[0]?.topics[0] ?? null;

  return {
    selectedCategoryId: firstCategory.id,
    activeTab: "report",
    reportView: "daily",
    selectedReportDate: latestReportDate,
    selectedContentDate: latestReportDate,
    selectedPlatformId: "all",
    focusedTopicId: firstTopic?.id ?? null,
    highlightedContentIds: []
  };
}

export function getActiveCategory(categories: MonitorCategory[], categoryId: string) {
  return categories.find((category) => category.id === categoryId) ?? categories[0]!;
}

export function getCurrentDailyReport(category: MonitorCategory, date: string) {
  return category.reports.find((report) => report.date === date) ?? category.reports[0]!;
}

export function getLinkedContentIds(topic: TopicIdea) {
  return topic.evidence.flatMap((item) => item.contentIds);
}

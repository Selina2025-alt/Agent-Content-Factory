import { DailyReport, MonitorCategory, TopicIdea, WorkbenchState } from "@/lib/types";

function getDefaultCategory(categories: MonitorCategory[]) {
  return categories[0];
}

function getLatestReport(reports: DailyReport[]) {
  return reports.reduce<DailyReport | undefined>((latest, report) => {
    if (!latest) {
      return report;
    }

    return report.date > latest.date ? report : latest;
  }, undefined);
}

function resolveCategory(categories: MonitorCategory[], categoryId: string) {
  return categories.find((category) => category.id === categoryId) ?? getDefaultCategory(categories);
}

function resolveReport(category: MonitorCategory, date: string) {
  return category.reports.find((report) => report.date === date) ?? getLatestReport(category.reports);
}

export function buildInitialWorkbenchState(categories: MonitorCategory[]): WorkbenchState {
  const firstCategory = getDefaultCategory(categories);

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

  const latestReport = getLatestReport(firstCategory.reports);
  const focusedTopicId = latestReport?.topics[0]?.id ?? null;
  const selectedReportDate = latestReport?.date ?? "";

  return {
    selectedCategoryId: firstCategory.id,
    activeTab: "report",
    reportView: "daily",
    selectedReportDate,
    selectedContentDate: selectedReportDate,
    selectedPlatformId: "all",
    focusedTopicId,
    highlightedContentIds: []
  };
}

export function getActiveCategory(categories: MonitorCategory[], categoryId: string) {
  return resolveCategory(categories, categoryId) ?? categories[0]!;
}

export function getCurrentDailyReport(category: MonitorCategory, date: string) {
  return resolveReport(category, date) ?? category.reports[0]!;
}

export function getLinkedContentIds(topic: TopicIdea) {
  const seen = new Set<string>();

  return topic.evidence.flatMap((item) => item.contentIds).filter((contentId) => {
    if (seen.has(contentId)) {
      return false;
    }

    seen.add(contentId);
    return true;
  });
}

"use client";

import { useState } from "react";

import { ActionDeck } from "@/components/workbench/action-deck";
import { CategorySidebar } from "@/components/workbench/category-sidebar";
import { ContentTab } from "@/components/workbench/content-tab";
import { ReportTab } from "@/components/workbench/report-tab";
import { RightRail } from "@/components/workbench/right-rail";
import { SettingsTab } from "@/components/workbench/settings-tab";
import { WorkbenchHeader } from "@/components/workbench/workbench-header";
import { monitorCategories } from "@/lib/mock-data";
import {
  buildInitialWorkbenchState,
  getActiveCategory,
  getCurrentDailyReport,
  getLinkedContentIds
} from "@/lib/workbench-selectors";
import type {
  ContentItem,
  DailyReport,
  TabId,
  TopicIdea,
  WorkbenchState
} from "@/lib/types";

export function buildWorkbenchStateForCategory(
  categories: typeof monitorCategories,
  categoryId: string,
  activeTab: TabId
): WorkbenchState {
  const activeCategory = getActiveCategory(categories, categoryId);
  const categoryState = buildInitialWorkbenchState([activeCategory]);

  return {
    ...categoryState,
    selectedCategoryId: activeCategory.id,
    activeTab
  };
}

export function MonitoringWorkbench() {
  const [workbenchState, setWorkbenchState] = useState<WorkbenchState>(() =>
    buildInitialWorkbenchState(monitorCategories)
  );

  if (monitorCategories.length === 0) {
    return (
      <section className="workbench-shell">
        <div className="workbench-shell__grid">
          <main className="workbench-shell__panel workbench-shell__panel--main">
            <div className="workbench-shell__hero-card">
              <div className="workbench-shell__panel-kicker">浠婃棩寤鸿鍔ㄤ綔姹?</div>
              <h2>鏆傛棤鐩戞帶鍒嗙被</h2>
              <p>璇峰厛娣诲姞涓€涓洃鎺у垎绫诲悗鍐嶆煡鐪嬪伐浣滃彴銆?</p>
            </div>
          </main>
        </div>
      </section>
    );
  }

  const activeCategory = getActiveCategory(
    monitorCategories,
    workbenchState.selectedCategoryId
  );
  const activeReport = getCurrentDailyReport(
    activeCategory,
    workbenchState.selectedReportDate
  );

  function handleOpenEvidence(topic: TopicIdea, report: DailyReport) {
    const linkedContentIds = getLinkedContentIds(topic);

    setWorkbenchState((current) => ({
      ...current,
      activeTab: "content",
      selectedReportDate: report.date,
      selectedContentDate: report.date,
      focusedTopicId: topic.id,
      highlightedContentIds: linkedContentIds
    }));
  }

  function handleOpenLinkedInsight(content: ContentItem) {
    const linkedTopicId = content.linkedTopicIds.find((topicId) =>
      activeCategory.reports.some((report) =>
        report.topics.some((topic) => topic.id === topicId)
      )
    );

    const linkedTopic = linkedTopicId
      ? activeCategory.reports
          .flatMap((report) => report.topics)
          .find((topic) => topic.id === linkedTopicId)
      : null;

    const linkedReport = linkedTopic
      ? activeCategory.reports.find((report) =>
          report.topics.some((topic) => topic.id === linkedTopic.id)
        )
      : null;

    setWorkbenchState((current) => ({
      ...current,
      activeTab: "report",
      selectedReportDate: linkedReport?.date ?? current.selectedReportDate,
      selectedContentDate: content.date,
      focusedTopicId: linkedTopic?.id ?? current.focusedTopicId,
      highlightedContentIds: linkedTopic
        ? getLinkedContentIds(linkedTopic)
        : current.highlightedContentIds
    }));
  }

  return (
    <section className="workbench-shell">
      <div className="workbench-shell__grid">
        <CategorySidebar
          categories={monitorCategories}
          selectedCategoryId={workbenchState.selectedCategoryId}
          onSelectCategory={(categoryId) =>
            setWorkbenchState((current) =>
              buildWorkbenchStateForCategory(
                monitorCategories,
                categoryId,
                current.activeTab
              )
            )
          }
        />

        <main className="workbench-shell__panel workbench-shell__panel--main">
          <WorkbenchHeader
            activeCategory={activeCategory}
            activeTab={workbenchState.activeTab}
            onTabChange={(activeTab) =>
              setWorkbenchState((current) => ({
                ...current,
                activeTab
              }))
            }
          />

          {workbenchState.activeTab === "report" ? (
            <>
              <ReportTab
                activeCategory={activeCategory}
                report={activeReport}
                reportView={workbenchState.reportView}
                onReportViewChange={(reportView) =>
                  setWorkbenchState((current) => ({
                    ...current,
                    reportView
                  }))
                }
                selectedReportDate={workbenchState.selectedReportDate}
                onSelectReportDate={(selectedReportDate) =>
                  setWorkbenchState((current) => ({
                    ...current,
                    selectedReportDate,
                    focusedTopicId: null,
                    highlightedContentIds: []
                  }))
                }
                onOpenEvidence={(topic) => handleOpenEvidence(topic, activeReport)}
              />
              <ActionDeck activeCategory={activeCategory} />
            </>
          ) : workbenchState.activeTab === "content" ? (
            <ContentTab
              activeCategory={activeCategory}
              selectedContentDate={workbenchState.selectedContentDate}
              selectedPlatformId={workbenchState.selectedPlatformId}
              highlightedContentIds={workbenchState.highlightedContentIds}
              onSelectContentDate={(selectedContentDate) =>
                setWorkbenchState((current) => ({
                  ...current,
                  selectedContentDate
                }))
              }
              onSelectPlatformId={(selectedPlatformId) =>
                setWorkbenchState((current) => ({
                  ...current,
                  selectedPlatformId
                }))
              }
              onOpenLinkedInsight={handleOpenLinkedInsight}
            />
          ) : (
            <SettingsTab activeCategory={activeCategory} />
          )}
        </main>

        <RightRail activeCategory={activeCategory} />
      </div>
    </section>
  );
}

export default MonitoringWorkbench;

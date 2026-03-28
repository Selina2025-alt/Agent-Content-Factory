"use client";

import { useState } from "react";

import { ActionDeck } from "@/components/workbench/action-deck";
import { CategorySidebar } from "@/components/workbench/category-sidebar";
import { ContentTab } from "@/components/workbench/content-tab";
import { GlobalToolbar } from "@/components/workbench/global-toolbar";
import { MonitorSummaryBar } from "@/components/workbench/monitor-summary-bar";
import { ReportTab } from "@/components/workbench/report-tab";
import { RightRail } from "@/components/workbench/right-rail";
import { SettingsTab } from "@/components/workbench/settings-tab";
import { WorkbenchHeader } from "@/components/workbench/workbench-header";
import { monitorCategories } from "@/lib/mock-data";
import {
  buildInitialWorkbenchState,
  getActiveCategory,
  getCurrentDailyReport,
  getLinkedContentIds,
  getTimelineContent,
  getTopLinkedContent,
  getTopicById
} from "@/lib/workbench-selectors";
import type {
  ActionItem,
  ContentItem,
  ContentFocusMode,
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
  const [settingsDraftTarget, setSettingsDraftTarget] = useState<
    "keyword" | "account" | null
  >(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);

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

  function openTopicBridge(
    topic: TopicIdea,
    report: DailyReport,
    focusMode: Exclude<ContentFocusMode, null>
  ) {
    const highlightedContent =
      focusMode === "samples"
        ? getTopLinkedContent(activeCategory, topic)
        : focusMode === "timeline"
          ? getTimelineContent(activeCategory, topic)
          : activeCategory.content.filter((content) =>
              getLinkedContentIds(topic).includes(content.id)
            );
    const highlightedContentIds = highlightedContent.map((content) => content.id);
    const selectedContentDate = highlightedContent[0]?.date ?? report.date;

    setWorkbenchState((current) => ({
      ...current,
      activeTab: "content",
      selectedReportDate: report.date,
      selectedContentDate,
      selectedPlatformId: "all",
      selectedContentRange: focusMode === "timeline" ? "7d" : "3d",
      contentPoolView: focusMode === "samples" ? "hot" : "all",
      contentFocusMode: focusMode,
      focusedTopicId: topic.id,
      highlightedContentIds
    }));
  }

  function handleOpenEvidence(topic: TopicIdea, report: DailyReport) {
    openTopicBridge(topic, report, "evidence");
  }

  function handleOpenSamples(topic: TopicIdea, report: DailyReport) {
    openTopicBridge(topic, report, "samples");
  }

  function handleOpenTimeline(topic: TopicIdea, report: DailyReport) {
    openTopicBridge(topic, report, "timeline");
  }

  function handleActionViewEvidence(actionItem: ActionItem) {
    const linkedTopic = actionItem.linkedTopicIds
      .map((topicId) => getTopicById(activeCategory, topicId))
      .find(Boolean);

    if (!linkedTopic) {
      return;
    }

    const linkedReport = activeCategory.reports.find((report) =>
      report.topics.some((topic) => topic.id === linkedTopic.id)
    );

    if (!linkedReport) {
      return;
    }

    handleOpenEvidence(linkedTopic, linkedReport);
  }

  function handleActionAddToPool(actionItem: ActionItem) {
    const linkedContentIds = actionItem.linkedTopicIds.flatMap((topicId) => {
      const topic = getTopicById(activeCategory, topicId);
      return topic ? getLinkedContentIds(topic) : [];
    });

    setWorkbenchState((current) => ({
      ...current,
      pooledContentIds: [...new Set([...current.pooledContentIds, ...linkedContentIds])]
    }));
  }

  function handleTogglePending(actionItem: ActionItem) {
    setWorkbenchState((current) => ({
      ...current,
      pendingActionIds: current.pendingActionIds.includes(actionItem.id)
        ? current.pendingActionIds.filter((id) => id !== actionItem.id)
        : [...current.pendingActionIds, actionItem.id]
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
      selectedPlatformId: "all",
      selectedContentRange: "7d",
      contentPoolView: "all",
      contentFocusMode: null,
      focusedTopicId: linkedTopic?.id ?? null,
      highlightedContentIds: []
    }));
  }

  function handleTogglePool(content: ContentItem) {
    setWorkbenchState((current) => ({
      ...current,
      pooledContentIds: current.pooledContentIds.includes(content.id)
        ? current.pooledContentIds.filter((id) => id !== content.id)
        : [...current.pooledContentIds, content.id]
    }));
  }

  return (
    <section className="workbench-shell">
      <GlobalToolbar
        categories={monitorCategories}
        isScanning={isScanning}
        isCreateCategoryOpen={isCreateCategoryOpen}
        onToggleCreateCategory={() => setIsCreateCategoryOpen((current) => !current)}
        onToggleScan={() => setIsScanning((current) => !current)}
      />

      <div className="workbench-shell__grid">
        <CategorySidebar
          categories={monitorCategories}
          selectedCategoryId={workbenchState.selectedCategoryId}
          onCreateCategory={() => setIsCreateCategoryOpen(true)}
          onSelectCategory={(categoryId) => {
            setSettingsDraftTarget(null);

            setWorkbenchState((current) =>
              buildWorkbenchStateForCategory(
                monitorCategories,
                categoryId,
                current.activeTab
              )
            );
          }}
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
          <MonitorSummaryBar activeCategory={activeCategory} />

          {workbenchState.activeTab === "report" ? (
            <>
              <ActionDeck
                activeCategory={activeCategory}
                pendingActionIds={workbenchState.pendingActionIds}
                onViewEvidence={handleActionViewEvidence}
                onAddToPool={handleActionAddToPool}
                onTogglePending={handleTogglePending}
              />
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
                focusedTopicId={workbenchState.focusedTopicId}
                onSelectReportDate={(selectedReportDate) =>
                  setWorkbenchState((current) => ({
                    ...current,
                    selectedReportDate,
                    focusedTopicId: null,
                    highlightedContentIds: []
                  }))
                }
                onOpenEvidence={(topic) => handleOpenEvidence(topic, activeReport)}
                onOpenSamples={(topic) => handleOpenSamples(topic, activeReport)}
                onOpenTimeline={(topic) => handleOpenTimeline(topic, activeReport)}
              />
            </>
          ) : workbenchState.activeTab === "content" ? (
            <ContentTab
              activeCategory={activeCategory}
              selectedContentDate={workbenchState.selectedContentDate}
              selectedPlatformId={workbenchState.selectedPlatformId}
              selectedContentRange={workbenchState.selectedContentRange}
              contentPoolView={workbenchState.contentPoolView}
              contentFocusMode={workbenchState.contentFocusMode}
              highlightedContentIds={workbenchState.highlightedContentIds}
              pooledContentIds={workbenchState.pooledContentIds}
              onSelectContentDate={(selectedContentDate) =>
                setWorkbenchState((current) => ({
                  ...current,
                  selectedContentDate,
                  contentFocusMode: null,
                  focusedTopicId: null,
                  highlightedContentIds: []
                }))
              }
              onSelectPlatformId={(selectedPlatformId) =>
                setWorkbenchState((current) => ({
                  ...current,
                  selectedPlatformId,
                  contentFocusMode: null,
                  contentPoolView: "all",
                  focusedTopicId: null,
                  highlightedContentIds: []
                }))
              }
              onSelectContentRange={(selectedContentRange) =>
                setWorkbenchState((current) => ({
                  ...current,
                  selectedContentRange,
                  contentFocusMode: null,
                  focusedTopicId: null,
                  highlightedContentIds: []
                }))
              }
              onSelectContentPoolView={(contentPoolView) =>
                setWorkbenchState((current) => ({
                  ...current,
                  contentPoolView,
                  contentFocusMode: null,
                  focusedTopicId: null,
                  highlightedContentIds: []
                }))
              }
              onOpenLinkedInsight={handleOpenLinkedInsight}
              onTogglePool={handleTogglePool}
            />
          ) : (
            <SettingsTab
              activeCategory={activeCategory}
              draftTarget={settingsDraftTarget}
              onAddKeyword={() => setSettingsDraftTarget("keyword")}
              onAddAccount={() => setSettingsDraftTarget("account")}
              onClearDraft={() => setSettingsDraftTarget(null)}
            />
          )}
        </main>

        <RightRail activeCategory={activeCategory} />
      </div>
    </section>
  );
}

export default MonitoringWorkbench;

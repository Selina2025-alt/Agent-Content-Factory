"use client";

import { ContentFilterBar } from "@/components/workbench/content-filter-bar";
import { ContentPool } from "@/components/workbench/content-pool";
import { ContentTrendStrip } from "@/components/workbench/content-trend-strip";
import {
  ContentFocusMode,
  ContentItem,
  ContentPoolView,
  ContentRangeId,
  MonitorCategory,
  NonAggregatePlatformId,
  PlatformId
} from "@/lib/types";

interface ContentTabProps {
  activeCategory: MonitorCategory;
  selectedContentDate: string;
  selectedPlatformId: PlatformId;
  selectedContentRange: ContentRangeId;
  contentPoolView: ContentPoolView;
  contentFocusMode: ContentFocusMode;
  highlightedContentIds: string[];
  pooledContentIds: string[];
  onSelectContentDate: (date: string) => void;
  onSelectPlatformId: (platformId: PlatformId) => void;
  onSelectContentRange: (range: ContentRangeId) => void;
  onSelectContentPoolView: (view: ContentPoolView) => void;
  onOpenLinkedInsight: (content: ContentItem) => void;
  onTogglePool: (content: ContentItem) => void;
}

function getSortedDates(content: ContentItem[]) {
  return [...new Set(content.map((item) => item.date))].sort((left, right) =>
    right.localeCompare(left)
  );
}

function getVisibleDates(content: ContentItem[], selectedRange: ContentRangeId) {
  const sortedDates = getSortedDates(content);
  const rangeLimit = selectedRange === "24h" ? 1 : selectedRange === "3d" ? 3 : 7;

  return sortedDates.slice(0, rangeLimit);
}

function buildPlatformItems(activeCategory: MonitorCategory, visibleDates: string[]) {
  const visibleDateSet = new Set(visibleDates);
  const visibleContent = activeCategory.content.filter((content) =>
    visibleDateSet.has(content.date)
  );

  return [
    { id: "all" as const, label: "全部", count: visibleContent.length },
    ...activeCategory.settings.platforms.map((platform) => ({
      id: platform.id,
      label: platform.label,
      count: visibleContent.filter((content) => content.platformId === platform.id).length
    }))
  ];
}

function buildTrendItems(activeCategory: MonitorCategory, visibleDates: string[]) {
  const platformLabelMap = new Map<NonAggregatePlatformId, string>(
    activeCategory.settings.platforms.map((platform) => [platform.id, platform.label])
  );

  return visibleDates.map((date) => {
    const contentForDate = activeCategory.content.filter((content) => content.date === date);
    const hotCount = contentForDate.filter((content) => content.heatScore >= 85).length;
    const platformCounts = new Map<string, number>();

    for (const content of contentForDate) {
      platformCounts.set(content.platformId, (platformCounts.get(content.platformId) ?? 0) + 1);
    }

    const leadPlatformId =
      [...platformCounts.entries()].sort((left, right) => right[1] - left[1])[0]?.[0] ?? "all";

    return {
      date,
      contentCount: contentForDate.length,
      hotCount,
      leadPlatformLabel:
        leadPlatformId === "all"
          ? "全平台"
          : platformLabelMap.get(leadPlatformId as NonAggregatePlatformId) ?? "全平台"
    };
  });
}

function resolveSelectedDate(visibleDates: string[], selectedDate: string) {
  return visibleDates.includes(selectedDate) ? selectedDate : visibleDates[0] ?? "";
}

function buildVisibleContent({
  activeCategory,
  selectedDate,
  selectedPlatformId,
  contentPoolView,
  contentFocusMode,
  highlightedContentIds,
  pooledContentIds,
  visibleDates
}: {
  activeCategory: MonitorCategory;
  selectedDate: string;
  selectedPlatformId: PlatformId;
  contentPoolView: ContentPoolView;
  contentFocusMode: ContentFocusMode;
  highlightedContentIds: string[];
  pooledContentIds: string[];
  visibleDates: string[];
}) {
  const visibleDateSet = new Set(visibleDates);
  const highlightedIdSet = new Set(highlightedContentIds);
  const pooledIdSet = new Set(pooledContentIds);

  return activeCategory.content
    .filter((content) => {
      if (contentFocusMode === "timeline" && highlightedContentIds.length > 0) {
        return highlightedIdSet.has(content.id);
      }

      return content.date === selectedDate && visibleDateSet.has(content.date);
    })
    .filter(
      (content) => selectedPlatformId === "all" || content.platformId === selectedPlatformId
    )
    .filter((content) => {
      if (contentPoolView === "hot") {
        return content.heatScore >= 85;
      }

      if (contentPoolView === "pool") {
        return pooledIdSet.has(content.id);
      }

      return true;
    })
    .slice()
    .sort((left, right) => {
      if (contentFocusMode === "timeline" && right.date !== left.date) {
        return right.date.localeCompare(left.date);
      }

      if (right.heatScore !== left.heatScore) {
        return right.heatScore - left.heatScore;
      }

      return right.publishedAt.localeCompare(left.publishedAt);
    });
}

function buildFocusDescription(mode: ContentFocusMode, highlightedCount: number) {
  if (mode === "evidence" && highlightedCount > 0) {
    return `已聚焦 ${highlightedCount} 条支撑内容，可直接判断这条洞察为什么成立。`;
  }

  if (mode === "samples" && highlightedCount > 0) {
    return `已定位 ${highlightedCount} 条原始爆款样本，先看最热素材，再决定要不要跟进。`;
  }

  if (mode === "timeline" && highlightedCount > 0) {
    return "已切换到同类内容时间线，先扫最近几天的连续信号，再深入看单条素材。";
  }

  return "先用平台、时间范围和内容池筛选缩小范围，再进入具体素材判断。";
}

export function ContentTab({
  activeCategory,
  selectedContentDate,
  selectedPlatformId,
  selectedContentRange,
  contentPoolView,
  contentFocusMode,
  highlightedContentIds,
  pooledContentIds,
  onSelectContentDate,
  onSelectPlatformId,
  onSelectContentRange,
  onSelectContentPoolView,
  onOpenLinkedInsight,
  onTogglePool
}: ContentTabProps) {
  const visibleDates = getVisibleDates(activeCategory.content, selectedContentRange);
  const resolvedSelectedDate = resolveSelectedDate(visibleDates, selectedContentDate);
  const trendItems = buildTrendItems(activeCategory, visibleDates);
  const platformItems = buildPlatformItems(activeCategory, visibleDates);
  const selectedPlatformLabel =
    platformItems.find((platform) => platform.id === selectedPlatformId)?.label ?? "全部";
  const visibleContent = buildVisibleContent({
    activeCategory,
    selectedDate: resolvedSelectedDate,
    selectedPlatformId,
    contentPoolView,
    contentFocusMode,
    highlightedContentIds,
    pooledContentIds,
    visibleDates
  });
  const poolDescription = buildFocusDescription(contentFocusMode, highlightedContentIds.length);
  const poolTitle =
    contentFocusMode === "timeline"
      ? "同类内容时间线"
      : `${resolvedSelectedDate || "--"} · ${selectedPlatformId === "all" ? "全平台" : selectedPlatformLabel} · ${visibleContent.length} 条内容`;

  return (
    <section className="workbench-shell__hero-card workbench-shell__hero-card--content">
      <div className="workbench-shell__panel-kicker">内容</div>
      <div className="workbench-shell__section-heading">
        <h2>内容监控与素材池</h2>
        <p>{poolDescription}</p>
      </div>

      <ContentFilterBar
        platforms={platformItems}
        ranges={[
          { id: "24h", label: "近24小时" },
          { id: "3d", label: "近3天" },
          { id: "7d", label: "近7天" }
        ]}
        poolViews={[
          { id: "all", label: "全部内容" },
          { id: "hot", label: "只看热点" },
          { id: "pool", label: "只看已入选题池" }
        ]}
        selectedPlatformId={selectedPlatformId}
        selectedRangeId={selectedContentRange}
        selectedPoolView={contentPoolView}
        onSelectPlatformId={onSelectPlatformId}
        onSelectRangeId={onSelectContentRange}
        onSelectPoolView={onSelectContentPoolView}
      />

      <ContentTrendStrip
        items={trendItems}
        selectedDate={resolvedSelectedDate}
        onSelectDate={onSelectContentDate}
      />

      <ContentPool
        title={poolTitle}
        description={poolDescription}
        items={visibleContent}
        highlightedContentIds={highlightedContentIds}
        pooledContentIds={pooledContentIds}
        onOpenLinkedInsight={onOpenLinkedInsight}
        onTogglePool={onTogglePool}
      />
    </section>
  );
}

export default ContentTab;

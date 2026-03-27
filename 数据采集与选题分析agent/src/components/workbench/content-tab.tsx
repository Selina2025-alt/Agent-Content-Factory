"use client";

import { DateStrip, type DateStripItem } from "@/components/workbench/date-strip";
import type { ContentItem, MonitorCategory, PlatformId } from "@/lib/types";

interface ContentTabProps {
  activeCategory: MonitorCategory;
  selectedContentDate: string;
  selectedPlatformId: PlatformId;
  highlightedContentIds: string[];
  onSelectContentDate: (date: string) => void;
  onSelectPlatformId: (platformId: PlatformId) => void;
  onOpenLinkedInsight: (content: ContentItem) => void;
}

function buildDateItems(content: ContentItem[]): DateStripItem[] {
  const contentDates = new Map<
    string,
    {
      count: number;
      platforms: Set<string>;
    }
  >();

  for (const item of content) {
    const existing = contentDates.get(item.date);

    if (existing) {
      existing.count += 1;
      existing.platforms.add(item.platformId);
      continue;
    }

    contentDates.set(item.date, {
      count: 1,
      platforms: new Set([item.platformId])
    });
  }

  return [...contentDates.entries()]
    .sort(([leftDate], [rightDate]) => rightDate.localeCompare(leftDate))
    .map(([date, summary]) => ({
      date,
      label: `${summary.count} 条内容`,
      detail: `${summary.platforms.size} 个平台`
    }));
}

function buildPlatformItems(activeCategory: MonitorCategory) {
  return [
    { id: "all" as const, label: "全部" },
    ...activeCategory.settings.platforms.map((platform) => ({
      id: platform.id,
      label: platform.label
    }))
  ];
}

function resolveSelectedDate(contentDates: DateStripItem[], selectedDate: string) {
  return contentDates.some((item) => item.date === selectedDate)
    ? selectedDate
    : contentDates[0]?.date ?? "";
}

function buildVisibleContent({
  activeCategory,
  selectedContentDate,
  selectedPlatformId
}: Pick<
  ContentTabProps,
  "activeCategory" | "selectedContentDate" | "selectedPlatformId"
>) {
  return activeCategory.content
    .filter((content) => content.date === selectedContentDate)
    .filter(
      (content) => selectedPlatformId === "all" || content.platformId === selectedPlatformId
    )
    .slice()
    .sort((left, right) => right.publishedAt.localeCompare(left.publishedAt));
}

export function ContentTab({
  activeCategory,
  selectedContentDate,
  selectedPlatformId,
  highlightedContentIds,
  onSelectContentDate,
  onSelectPlatformId,
  onOpenLinkedInsight
}: ContentTabProps) {
  const dateItems = buildDateItems(activeCategory.content);
  const resolvedSelectedDate = resolveSelectedDate(dateItems, selectedContentDate);
  const visibleContent = buildVisibleContent({
    activeCategory,
    selectedContentDate: resolvedSelectedDate,
    selectedPlatformId
  });
  const platformItems = buildPlatformItems(activeCategory);

  return (
    <section className="workbench-shell__hero-card" aria-label={`${activeCategory.name} 支撑内容`}>
      <div className="workbench-shell__panel-kicker">内容</div>
      <h2>{`${activeCategory.name} 支撑内容`}</h2>

      {highlightedContentIds.length > 0 ? (
        <p>{`已聚焦 ${highlightedContentIds.length} 条支撑内容。`}</p>
      ) : (
        <p>从选题分析里点开任意主题后，这里会展示对应的内容卡片。</p>
      )}

      <DateStrip
        items={dateItems}
        selectedDate={resolvedSelectedDate}
        onSelectDate={onSelectContentDate}
      />

      <div className="workbench-shell__header-meta" role="group" aria-label="平台筛选">
        {platformItems.map((platform) => {
          const isSelected = platform.id === selectedPlatformId;

          return (
            <button
              key={platform.id}
              type="button"
              className={isSelected ? "workbench-shell__tab is-active" : "workbench-shell__tab"}
              aria-pressed={isSelected}
              onClick={() => onSelectPlatformId(platform.id)}
            >
              {platform.label}
            </button>
          );
        })}
      </div>

      <div className="workbench-shell__action-deck" aria-label="内容卡片">
        {visibleContent.length === 0 ? (
          <article className="workbench-shell__workspace-card">
            <span>暂无内容</span>
            <strong>当前日期和平台下没有匹配的内容。</strong>
          </article>
        ) : (
          visibleContent.map((content) => {
            const isFocused = highlightedContentIds.includes(content.id);

            return (
              <article
                key={content.id}
                className={
                  isFocused
                    ? "workbench-shell__workspace-card is-active"
                    : "workbench-shell__workspace-card"
                }
              >
                <span>
                  {content.publishedAt} · {content.platformId}
                </span>
                <strong>{content.title}</strong>
                <p>{content.aiSummary}</p>
                <small>
                  {content.author} · 热度 {content.heatScore} ·{" "}
                  {content.metrics.likes} 赞
                </small>
                <button
                  type="button"
                  className="workbench-shell__tab"
                  aria-label={`查看关联洞察：${content.title}`}
                  onClick={() => onOpenLinkedInsight(content)}
                >
                  查看关联洞察
                </button>
              </article>
            );
          })
        )}
      </div>
    </section>
  );
}

export default ContentTab;

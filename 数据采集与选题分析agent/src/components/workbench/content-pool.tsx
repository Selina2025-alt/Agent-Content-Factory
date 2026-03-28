import { ContentCard } from "@/components/workbench/content-card";
import type { ContentItem } from "@/lib/types";

interface ContentPoolProps {
  title: string;
  description: string;
  items: ContentItem[];
  highlightedContentIds: string[];
  pooledContentIds: string[];
  onOpenLinkedInsight: (content: ContentItem) => void;
  onTogglePool: (content: ContentItem) => void;
}

export function ContentPool({
  title,
  description,
  items,
  highlightedContentIds,
  pooledContentIds,
  onOpenLinkedInsight,
  onTogglePool
}: ContentPoolProps) {
  return (
    <section className="workbench-shell__content-pool" role="region" aria-label="内容池">
      <div className="workbench-shell__section-heading">
        <h2>{title}</h2>
        <p>{description}</p>
      </div>

      <div className="workbench-shell__content-grid" aria-label="内容卡片">
        {items.length === 0 ? (
          <article className="workbench-shell__workspace-card">
            <span>暂无素材</span>
            <strong>当前筛选条件下没有匹配内容，试试切换平台、日期或内容池筛选。</strong>
          </article>
        ) : (
          items.map((content) => (
            <ContentCard
              key={content.id}
              content={content}
              isHighlighted={highlightedContentIds.includes(content.id)}
              isPooled={pooledContentIds.includes(content.id)}
              onOpenLinkedInsight={onOpenLinkedInsight}
              onTogglePool={onTogglePool}
            />
          ))
        )}
      </div>
    </section>
  );
}

export default ContentPool;

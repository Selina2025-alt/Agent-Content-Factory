import type { ContentItem } from "@/lib/types";

interface ContentCardProps {
  content: ContentItem;
  isHighlighted: boolean;
  isPooled: boolean;
  onOpenLinkedInsight: (content: ContentItem) => void;
  onTogglePool: (content: ContentItem) => void;
}

export function ContentCard({
  content,
  isHighlighted,
  isPooled,
  onOpenLinkedInsight,
  onTogglePool
}: ContentCardProps) {
  const platformLabelMap: Record<ContentItem["platformId"], string> = {
    douyin: "抖音",
    xiaohongshu: "小红书",
    weibo: "微博",
    bilibili: "B站"
  };

  return (
    <article
      className={
        isHighlighted
          ? "workbench-shell__content-card is-active"
          : "workbench-shell__content-card"
      }
    >
      <div className="workbench-shell__content-card-topline">
        <span>{`${platformLabelMap[content.platformId]} · ${content.publishedAt}`}</span>
        <div className="workbench-shell__badge-row">
          {content.heatScore >= 85 ? <small className="is-hot">高热</small> : null}
          {content.includedInDailyReport ? <small>日报已纳入</small> : null}
          {isPooled ? <small className="is-accent">已入选题池</small> : null}
          {isHighlighted ? <small className="is-strong">证据链</small> : null}
        </div>
      </div>

      <strong>{content.title}</strong>
      <p>{content.aiSummary}</p>

      <div className="workbench-shell__chip-row" aria-label={`命中标签：${content.title}`}>
        {content.matchedTargets.map((target) => (
          <span key={target} className="workbench-shell__inline-chip">
            {target}
          </span>
        ))}
      </div>

      <small>{`${content.author} · 热度 ${content.heatScore} · ${content.metrics.likes} 赞 · ${content.metrics.comments} 评 · ${content.metrics.saves} 收藏`}</small>

      <div className="workbench-shell__inline-actions">
        <button
          type="button"
          className="workbench-shell__tab"
          aria-label={`查看关联洞察：${content.title}`}
          onClick={() => onOpenLinkedInsight(content)}
        >
          查看关联洞察
        </button>
        <button
          type="button"
          className={isPooled ? "workbench-shell__tab is-active" : "workbench-shell__tab"}
          aria-label={`${isPooled ? "移出选题池" : "加入选题池"}：${content.title}`}
          onClick={() => onTogglePool(content)}
        >
          {isPooled ? "已入选题池" : "加入选题池"}
        </button>
      </div>
    </article>
  );
}

export default ContentCard;

import type { MonitorCategory } from "@/lib/types";

interface ActionDeckProps {
  activeCategory: MonitorCategory;
}

export function ActionDeck({ activeCategory }: ActionDeckProps) {
  return (
    <section className="workbench-shell__hero-card" aria-label="今日最值得跟进的 3 个选题">
      <div className="workbench-shell__panel-kicker">今日建议动作区</div>
      <h2>今日最值得跟进的 3 个选题</h2>
      <p>{activeCategory.description}</p>

      <div className="workbench-shell__action-deck">
        {activeCategory.actionItems.map((item) => (
          <article key={item.id} className="workbench-shell__workspace-card">
            <span>
              {item.priority} · {item.sourceLabel}
            </span>
            <strong>{item.title}</strong>
            <p>{item.summary}</p>
            <small>{item.evidenceLabel}</small>
          </article>
        ))}
      </div>
    </section>
  );
}

export default ActionDeck;

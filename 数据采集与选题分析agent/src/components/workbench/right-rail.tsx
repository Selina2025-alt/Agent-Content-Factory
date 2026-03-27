import type { MonitorCategory } from "@/lib/types";

interface RightRailProps {
  activeCategory: MonitorCategory;
}

export function RightRail({ activeCategory }: RightRailProps) {
  return (
    <aside
      className="workbench-shell__panel workbench-shell__panel--right"
      aria-label="右侧面板"
    >
      <section className="workbench-shell__panel-block">
        <div className="workbench-shell__panel-kicker">判断辅助信息</div>
        <div className="workbench-shell__insight-stack">
          <section className="workbench-shell__insight-card">
            <span>优先级分布</span>
            <strong>用于快速确认今天先看什么</strong>
            <div className="workbench-shell__insight-list" aria-label="优先级分布">
              {activeCategory.decisionSignals.priorityDistribution.map(
                (signal) => (
                  <p key={signal}>{signal}</p>
                )
              )}
            </div>
          </section>
        </div>
      </section>

      <section className="workbench-shell__panel-block">
        <div className="workbench-shell__panel-kicker">平台异常波动提示</div>
        <div className="workbench-shell__insight-stack">
          {activeCategory.decisionSignals.anomalySignals.map((signal) => (
            <article key={signal} className="workbench-shell__insight-card">
              <span>异常信号</span>
              <strong>{signal}</strong>
            </article>
          ))}
        </div>
      </section>
    </aside>
  );
}

export default RightRail;

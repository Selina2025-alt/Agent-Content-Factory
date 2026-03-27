"use client";

const tabs = ["选题分析与报告", "监控策略", "工作台日志"];

export default function MonitoringWorkbench() {
  return (
    <section className="workbench-shell">
      <header className="workbench-shell__header">
        <div className="workbench-shell__eyebrow">内容监控工作台</div>
        <h1 className="workbench-shell__title">ClaudeCode 选题监控</h1>
        <p className="workbench-shell__description">
          以编辑台方式汇总监控分类、判断辅助信息和今日建议动作。
        </p>
      </header>

      <nav className="workbench-shell__tabs" role="tablist" aria-label="工作台视图">
        {tabs.map((tab, index) => (
          <button
            key={tab}
            type="button"
            role="tab"
            aria-selected={index === 0}
            className={
              index === 0
                ? "workbench-shell__tab is-active"
                : "workbench-shell__tab"
            }
          >
            {tab}
          </button>
        ))}
      </nav>

      <div className="workbench-shell__grid">
        <aside
          className="workbench-shell__panel workbench-shell__panel--left"
          aria-label="左侧面板"
        >
          <section className="workbench-shell__panel-block">
            <div className="workbench-shell__panel-kicker">监控分类</div>
            <div className="workbench-shell__category-chip">ClaudeCode 选题监控</div>
            <ul className="workbench-shell__list-stack" aria-label="监控分类列表">
              <li>热点变化</li>
              <li>选题机会</li>
              <li>风险预警</li>
            </ul>
          </section>

          <section className="workbench-shell__panel-block">
            <div className="workbench-shell__panel-kicker">分类工作区</div>
            <div className="workbench-shell__workspace-card">
              <span>选题筛选</span>
              <strong>围绕本日可执行方向排序</strong>
            </div>
            <div className="workbench-shell__workspace-card">
              <span>素材归档</span>
              <strong>保留可复用观察点与论据</strong>
            </div>
          </section>
        </aside>

        <main className="workbench-shell__panel workbench-shell__panel--main">
          <div className="workbench-shell__hero-card">
            <div className="workbench-shell__panel-kicker">今日建议动作区</div>
            <h2>先聚焦可转化的选题，再补足判断依据。</h2>
            <p>
              这里会承载今天最值得推进的动作、简要理由和下一步提示，
              让监控结果直接转成编辑动作。
            </p>
          </div>
        </main>

        <aside
          className="workbench-shell__panel workbench-shell__panel--right"
          aria-label="右侧面板"
        >
          <section className="workbench-shell__panel-block">
            <div className="workbench-shell__panel-kicker">判断辅助信息</div>
            <div className="workbench-shell__insight-stack">
              <article className="workbench-shell__insight-card">
                <span>信号强度</span>
                <strong>高</strong>
              </article>
              <article className="workbench-shell__insight-card">
                <span>建议处理</span>
                <strong>继续观察并整理论据</strong>
              </article>
            </div>
          </section>
        </aside>
      </div>
    </section>
  );
}

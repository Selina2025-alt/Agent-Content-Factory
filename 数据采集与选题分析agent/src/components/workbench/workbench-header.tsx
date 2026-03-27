import type { MonitorCategory } from "@/lib/types";

interface WorkbenchHeaderProps {
  activeCategory: MonitorCategory;
}

const tabs = ["选题分析与报告", "监控策略", "工作台日志"];

export function WorkbenchHeader({ activeCategory }: WorkbenchHeaderProps) {
  return (
    <header className="workbench-shell__header">
      <div className="workbench-shell__eyebrow">内容监控工作台</div>
      <h1 className="workbench-shell__title">{activeCategory.name}</h1>
      <p className="workbench-shell__description">
        {activeCategory.description}
      </p>
      <div className="workbench-shell__header-meta">
        <span>最后更新 {activeCategory.overview.updatedAt}</span>
        <span>覆盖 {activeCategory.overview.platformCount} 个平台</span>
        <span>状态 {activeCategory.reportStatus}</span>
      </div>

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
    </header>
  );
}

export default WorkbenchHeader;

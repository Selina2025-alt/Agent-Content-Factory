import type { MonitorCategory } from "@/lib/types";
import type { TabId } from "@/lib/types";

interface WorkbenchHeaderProps {
  activeCategory: MonitorCategory;
  activeTab: TabId;
  onTabChange: (tabId: TabId) => void;
}

const tabs: Array<{ id: TabId; label: string }> = [
  { id: "content", label: "内容" },
  { id: "report", label: "选题分析与报告" },
  { id: "settings", label: "监控设置" }
];

export function WorkbenchHeader({
  activeCategory,
  activeTab,
  onTabChange
}: WorkbenchHeaderProps) {
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
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={tab.id === activeTab}
            className={
              tab.id === activeTab
                ? "workbench-shell__tab is-active"
                : "workbench-shell__tab"
            }
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </header>
  );
}

export default WorkbenchHeader;

import type { MonitorCategory } from "@/lib/types";

interface GlobalToolbarProps {
  categories: MonitorCategory[];
  isScanning: boolean;
  isCreateCategoryOpen: boolean;
  onToggleCreateCategory: () => void;
  onToggleScan: () => void;
}

export function GlobalToolbar({
  categories,
  isScanning,
  isCreateCategoryOpen,
  onToggleCreateCategory,
  onToggleScan
}: GlobalToolbarProps) {
  const reportCount = categories.filter((category) => category.reportStatus === "已完成").length;
  const contentCount = categories.reduce(
    (total, category) => total + category.todayCollectionCount,
    0
  );
  const reviewCount = categories.reduce(
    (total, category) => total + category.decisionSignals.reviewItems.length,
    0
  );
  const latestRunAt = categories[0]?.lastRunAt ?? "--";

  return (
    <section className="workbench-shell__global-toolbar">
      <div className="workbench-shell__global-toolbar-copy">
        <div className="workbench-shell__panel-kicker">系统级操作</div>
        <strong>内容监控与选题决策工作台</strong>
        <p>{`今日已完成 ${reportCount}/${categories.length} 个分类日报，优先处理高热信号和待复核项。`}</p>
      </div>

      <div className="workbench-shell__global-toolbar-status" aria-label="全局状态">
        <span>{`上次扫描 ${latestRunAt}`}</span>
        <span>{`今日新增 ${contentCount} 条内容`}</span>
        <span>{`${reviewCount} 个分类待复核`}</span>
        <span>{isScanning ? "手动扫描中" : "系统待命中"}</span>
      </div>

      <div className="workbench-shell__global-toolbar-actions">
        <button
          type="button"
          className="workbench-shell__ghost-button"
          aria-pressed={isCreateCategoryOpen}
          onClick={onToggleCreateCategory}
        >
          新建监控分类
        </button>
        <button
          type="button"
          className="workbench-shell__action-button"
          aria-pressed={isScanning}
          onClick={onToggleScan}
        >
          {isScanning ? "扫描中..." : "开始手动扫描"}
        </button>
      </div>

      {isCreateCategoryOpen ? (
        <div className="workbench-shell__draft-panel" role="region" aria-label="新建监控分类草稿">
          <div>
            <strong>新建监控分类草稿</strong>
            <p>原型阶段先展示系统级入口和表单骨架，便于后续补真实创建流程。</p>
          </div>
          <div className="workbench-shell__draft-grid">
            <article className="workbench-shell__draft-field">
              <span>分类名称</span>
              <strong>例如：AI 产品选题监控</strong>
            </article>
            <article className="workbench-shell__draft-field">
              <span>监控平台</span>
              <strong>抖音 / 小红书 / 微博 / B站</strong>
            </article>
            <article className="workbench-shell__draft-field">
              <span>重点关键词</span>
              <strong>产品验证、增长实验、周报复盘</strong>
            </article>
            <article className="workbench-shell__draft-field">
              <span>目标账号</span>
              <strong>独立开发者、行业观察员、方法论博主</strong>
            </article>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export default GlobalToolbar;

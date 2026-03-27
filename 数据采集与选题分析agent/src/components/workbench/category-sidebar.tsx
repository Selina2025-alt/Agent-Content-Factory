import type { MonitorCategory } from "@/lib/types";

interface CategorySidebarProps {
  categories: MonitorCategory[];
  selectedCategoryId: string;
  onSelectCategory: (categoryId: string) => void;
}

export function CategorySidebar({
  categories,
  selectedCategoryId,
  onSelectCategory
}: CategorySidebarProps) {
  const activeCategory =
    categories.find((category) => category.id === selectedCategoryId) ??
    categories[0];

  if (!activeCategory) {
    return null;
  }

  return (
    <aside
      className="workbench-shell__panel workbench-shell__panel--left"
      aria-label="左侧面板"
    >
      <section className="workbench-shell__panel-block">
        <div className="workbench-shell__panel-kicker">监控分类</div>
        <div className="workbench-shell__category-chip">
          {activeCategory.name}
        </div>
        <div className="workbench-shell__category-stack" role="list">
          {categories.map((category) => {
            const isSelected = category.id === selectedCategoryId;

            return (
              <button
                key={category.id}
                type="button"
                aria-label={category.name}
                aria-pressed={isSelected}
                className={
                  isSelected
                    ? "workbench-shell__workspace-card is-active"
                    : "workbench-shell__workspace-card"
                }
                onClick={() => onSelectCategory(category.id)}
              >
                <span>{category.name}</span>
                <strong>{category.description}</strong>
                <small>
                  {category.overview.platformCount} 平台 ·{" "}
                  {category.overview.keywordCount} 关键词 ·{" "}
                  {category.overview.creatorCount} 账号
                </small>
              </button>
            );
          })}
        </div>
      </section>

      <section className="workbench-shell__panel-block">
        <div className="workbench-shell__panel-kicker">分类工作区</div>
        <div className="workbench-shell__workspace-card">
          <span>当前选中</span>
          <strong>{activeCategory.name}</strong>
        </div>
        <div className="workbench-shell__workspace-card">
          <span>今日收集</span>
          <strong>{activeCategory.todayCollectionCount} 条素材</strong>
        </div>
      </section>
    </aside>
  );
}

export default CategorySidebar;

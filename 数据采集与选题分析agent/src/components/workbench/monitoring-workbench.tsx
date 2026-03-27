"use client";

import { useState } from "react";

import { ActionDeck } from "@/components/workbench/action-deck";
import { CategorySidebar } from "@/components/workbench/category-sidebar";
import { RightRail } from "@/components/workbench/right-rail";
import { WorkbenchHeader } from "@/components/workbench/workbench-header";
import { monitorCategories } from "@/lib/mock-data";
import { buildInitialWorkbenchState, getActiveCategory } from "@/lib/workbench-selectors";
import type { TabId, WorkbenchState } from "@/lib/types";

export function buildWorkbenchStateForCategory(
  categories: typeof monitorCategories,
  categoryId: string,
  activeTab: TabId
): WorkbenchState {
  const activeCategory = getActiveCategory(categories, categoryId);
  const categoryState = buildInitialWorkbenchState([activeCategory]);

  return {
    ...categoryState,
    selectedCategoryId: activeCategory.id,
    activeTab
  };
}

export function MonitoringWorkbench() {
  const [workbenchState, setWorkbenchState] = useState<WorkbenchState>(() =>
    buildInitialWorkbenchState(monitorCategories)
  );

  if (monitorCategories.length === 0) {
    return (
      <section className="workbench-shell">
        <div className="workbench-shell__grid">
          <main className="workbench-shell__panel workbench-shell__panel--main">
            <div className="workbench-shell__hero-card">
              <div className="workbench-shell__panel-kicker">今日建议动作区</div>
              <h2>暂无监控分类</h2>
              <p>请先添加一个监控分类后再查看工作台。</p>
            </div>
          </main>
        </div>
      </section>
    );
  }

  const activeCategory = getActiveCategory(
    monitorCategories,
    workbenchState.selectedCategoryId
  );

  return (
    <section className="workbench-shell">
      <div className="workbench-shell__grid">
        <CategorySidebar
          categories={monitorCategories}
          selectedCategoryId={workbenchState.selectedCategoryId}
          onSelectCategory={(categoryId) =>
            setWorkbenchState((current) =>
              buildWorkbenchStateForCategory(
                monitorCategories,
                categoryId,
                current.activeTab
              )
            )
          }
        />

        <main className="workbench-shell__panel workbench-shell__panel--main">
          <WorkbenchHeader
            activeCategory={activeCategory}
            activeTab={workbenchState.activeTab}
            onTabChange={(activeTab) =>
              setWorkbenchState((current) => ({
                ...current,
                activeTab
              }))
            }
          />
          <ActionDeck activeCategory={activeCategory} />
        </main>

        <RightRail activeCategory={activeCategory} />
      </div>
    </section>
  );
}

export default MonitoringWorkbench;

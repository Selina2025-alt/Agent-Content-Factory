"use client";

import { useState } from "react";

import { ActionDeck } from "@/components/workbench/action-deck";
import { CategorySidebar } from "@/components/workbench/category-sidebar";
import { RightRail } from "@/components/workbench/right-rail";
import { WorkbenchHeader } from "@/components/workbench/workbench-header";
import { monitorCategories } from "@/lib/mock-data";
import type { MonitorCategory } from "@/lib/types";

const initialCategoryId = monitorCategories[0]?.id ?? "";

function getActiveCategory(categoryId: string): MonitorCategory {
  return (
    monitorCategories.find((category) => category.id === categoryId) ??
    monitorCategories[0]
  );
}

export function MonitoringWorkbench() {
  const [selectedCategoryId, setSelectedCategoryId] =
    useState(initialCategoryId);
  const activeCategory = getActiveCategory(selectedCategoryId);

  return (
    <section className="workbench-shell">
      <div className="workbench-shell__grid">
        <CategorySidebar
          categories={monitorCategories}
          activeCategory={activeCategory}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={setSelectedCategoryId}
        />

        <main className="workbench-shell__panel workbench-shell__panel--main">
          <WorkbenchHeader activeCategory={activeCategory} />
          <ActionDeck activeCategory={activeCategory} />
        </main>

        <RightRail activeCategory={activeCategory} />
      </div>
    </section>
  );
}

export default MonitoringWorkbench;

import { describe, expect, it } from "vitest";

import {
  addKeywordTargetToCategory,
  buildDateOptions,
  buildReplicaArticles,
  createReplicaKeywordTarget,
  filterReplicaArticles
} from "@/lib/replica-workbench";
import { initialReplicaCategories } from "@/lib/replica-workbench-data";

describe("replica workbench selectors", () => {
  it("builds screenshot-style articles from the active keyword", () => {
    const articles = buildReplicaArticles(initialReplicaCategories[0], "claude code");

    expect(articles.length).toBeGreaterThan(0);
    expect(articles[0]?.title).toContain("Claude Code");
  });

  it("filters by platform and date slot", () => {
    const articles = buildReplicaArticles(initialReplicaCategories[0], "claude code");
    const firstDate = buildDateOptions(articles)[0]?.id;
    const filtered = filterReplicaArticles(articles, "wechat", firstDate);

    expect(filtered.length).toBeGreaterThan(0);
    expect(filtered.every((item) => item.platformId === "wechat")).toBe(true);
    expect(filtered.every((item) => item.publishedAt.startsWith(firstDate || ""))).toBe(true);
  });

  it("keeps a seven-day date timeline even when fetched content only has one publish date", () => {
    const [singleArticle] = buildReplicaArticles(initialReplicaCategories[0], "claude code");
    const dateOptions = buildDateOptions(singleArticle ? [singleArticle] : []);

    expect(dateOptions).toHaveLength(7);
    expect(dateOptions[0]?.id).toBe(singleArticle?.publishedAt.slice(0, 10));
  });

  it("creates keyword targets with multiple platform bindings", () => {
    const keywordTarget = createReplicaKeywordTarget("openclaw", ["wechat", "xiaohongshu"]);

    expect(keywordTarget.keyword).toBe("openclaw");
    expect(keywordTarget.platformIds).toEqual(["wechat", "xiaohongshu"]);
    expect(keywordTarget.lastRunStatus).toBe("idle");
    expect(keywordTarget.lastResultCount).toBe(0);
  });

  it("keeps legacy keywords in sync when adding a keyword target", () => {
    const category = addKeywordTargetToCategory(initialReplicaCategories[0], {
      keyword: "openclaw",
      platformIds: ["wechat", "xiaohongshu"]
    });

    expect(category.keywordTargets.some((item) => item.keyword === "openclaw")).toBe(true);
    expect(category.keywords).toContain("openclaw");
  });
});

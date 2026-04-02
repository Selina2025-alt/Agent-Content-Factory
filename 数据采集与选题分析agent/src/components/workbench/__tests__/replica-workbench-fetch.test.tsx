import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import MonitoringWorkbench from "@/components/workbench/monitoring-workbench";
import ReplicaSettingsPanel from "@/components/workbench/replica-settings-panel";
import { initialReplicaCategories } from "@/lib/replica-workbench-data";

describe("replica workbench fetch", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("allows twitter/x in the keyword platform picker after the platform is enabled", async () => {
    const user = userEvent.setup();
    const onAddKeywordTarget = vi.fn();
    const category = {
      ...initialReplicaCategories[0]!,
      platforms: initialReplicaCategories[0]!.platforms.map((platform) =>
        platform.id === "twitter" ? { ...platform, enabled: true } : platform
      )
    };

    render(
      <ReplicaSettingsPanel
        category={category}
        onTogglePlatform={vi.fn()}
        onAddKeywordTarget={onAddKeywordTarget}
        onRemoveKeywordTarget={vi.fn()}
        onAddCreator={vi.fn()}
        onRemoveCreator={vi.fn()}
        onDeleteCategory={vi.fn()}
      />
    );

    await user.type(screen.getByPlaceholderText("输入新的监控关键词"), "twitter launch");
    await user.click(screen.getByTestId("keyword-platform-twitter"));
    await user.click(screen.getByRole("button", { name: /新增关键词/ }));

    expect(onAddKeywordTarget).toHaveBeenCalledWith({
      keyword: "twitter launch",
      platformIds: expect.arrayContaining(["twitter"])
    });
  });

  it("uses the unified refresh api for the current twitter/x platform and labels twitter content clearly", async () => {
    const user = userEvent.setup();

    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === "string" ? input : input.toString();

      if (url === "/api/keyword-targets?categoryId=claude") {
        return {
          ok: true,
          json: async () => ({
            keywordTargets: [
              {
                id: "claude-keyword-1",
                keyword: "claude code",
                platformIds: ["twitter"],
                createdAt: "2026-03-31T08:00:00.000Z",
                lastRunAt: null,
                lastRunStatus: "idle",
                lastResultCount: 0
              }
            ]
          })
        };
      }

      if (url === "/api/content/list?categoryId=claude&keywordTargetId=claude-keyword-1&platformId=twitter") {
        return {
          ok: true,
          json: async () => ({
            items: [],
            meta: {
              source: "twitter",
              sortedBy: "publish_time_desc",
              persisted: true
            }
          })
        };
      }

      if (url === "/api/content/refresh") {
        const body = JSON.parse(String(init?.body));

        expect(body.platformId).toBe("twitter");
        expect(body.keyword).toBe("claude code");

        return {
          ok: true,
          json: async () => ({
            rawItems: [],
            items: [
              {
                id: "tw-1",
                date: "2026-03-31",
                timeOfDay: "上午",
                title: "Twitter/X signal for Claude Code",
                platformId: "twitter",
                author: "X Author",
                authorName: "X Author",
                authorId: "x-author",
                publishedAt: "2026-03-31 10:20:00",
                publishTime: "2026-03-31 10:20:00",
                publishTimestamp: 1711870800,
                heatScore: 93,
                metrics: { likes: "21", comments: "4", saves: "2" },
                matchedTargets: ["claude code"],
                aiSummary: "twitter summary",
                summary: "twitter summary",
                linkedTopicIds: [],
                includedInDailyReport: false,
                inTopicPool: false,
                rawOrderIndex: 0,
                articleUrl: "https://x.com/example/status/1"
              }
            ],
            meta: {
              source: "twitter",
              sortedBy: "publish_time_desc",
              persisted: true,
              fetchedCount: 1,
              cappedCount: 1
            }
          })
        };
      }

      if (url.startsWith("/api/content/list")) {
        return {
          ok: true,
          json: async () => ({
            items: [],
            meta: {
              source: "twitter",
              sortedBy: "publish_time_desc",
              persisted: true
            }
          })
        };
      }

      throw new Error(`Unexpected fetch url: ${url}`);
    });

    vi.stubGlobal("fetch", fetchMock);

    render(<MonitoringWorkbench />);

    await user.click(screen.getByRole("button", { name: "监控设置" }));
    await user.click(screen.getByTestId("settings-platform-twitter"));
    await user.click(screen.getByRole("button", { name: "内容" }));
    await user.click(screen.getByTestId("platform-filter-twitter"));
    await user.click(screen.getByRole("button", { name: /一键更新/ }));

    const articleTitle = await screen.findByText("Twitter/X signal for Claude Code");

    expect(
      within(articleTitle.closest(".replica-shell__content-card") as HTMLElement).getByText("Twitter/X")
    ).toBeInTheDocument();
    expect(screen.getByText("按点赞数排序 · 真实数据")).toBeInTheDocument();
    expect(screen.getByText("当前来源：Twitter/X 原文")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "查看推文原文" })).toHaveAttribute(
      "href",
      "https://x.com/example/status/1"
    );
  });

  it("keeps mock content and shows the api error when update fails", async () => {
    const user = userEvent.setup();

    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = typeof input === "string" ? input : input.toString();

        if (url === "/api/keyword-targets?categoryId=claude") {
          return {
            ok: true,
            json: async () => ({
              keywordTargets: []
            })
          };
        }

        return {
          ok: false,
          json: async () => ({
            error: "Xiaohongshu monitor request failed with status 403: QUOTA_EXCEEDED"
          })
        };
      })
    );

    render(<MonitoringWorkbench />);

    await user.click(screen.getByTestId("platform-filter-xiaohongshu"));
    await user.click(screen.getByRole("button", { name: /一键更新/i }));

    await waitFor(() => {
      expect(screen.getByText(/QUOTA_EXCEEDED/)).toBeInTheDocument();
    });

    expect(screen.getAllByText(/当前筛选下暂无内容|本地原型示例内容|小红书实时结果/).length).toBeGreaterThan(0);
  });

  it("rehydrates persisted keyword target metadata and loads stored content after a reload", async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = typeof input === "string" ? input : input.toString();

      if (url === "/api/keyword-targets?categoryId=claude") {
        return {
          ok: true,
          json: async () => ({
            keywordTargets: [
              {
                id: "claude-keyword-1",
                keyword: "claude code",
                platformIds: ["wechat", "xiaohongshu"],
                createdAt: "2026-03-31T08:00:00.000Z",
                lastRunAt: "2026-03-31T09:05:00.000Z",
                lastRunStatus: "success",
                lastResultCount: 1
              }
            ]
          })
        };
      }

      if (
        url ===
        "/api/content/list?categoryId=claude&keywordTargetId=claude-keyword-1&platformId=wechat"
      ) {
        return {
          ok: true,
          json: async () => ({
            items: [
              {
                id: "wx-persisted",
                date: "2026-03-31",
                timeOfDay: "上午",
                title: "Persisted wechat article",
                platformId: "wechat",
                author: "Persisted Author",
                authorName: "Persisted Author",
                authorId: "persisted-author",
                publishedAt: "2026-03-31 09:00:00",
                publishTime: "2026-03-31 09:00:00",
                publishTimestamp: 1711846800,
                heatScore: 91,
                metrics: { likes: "12", comments: "4", saves: "7" },
                matchedTargets: ["claude code"],
                aiSummary: "persisted summary",
                summary: "persisted summary",
                linkedTopicIds: [],
                includedInDailyReport: false,
                inTopicPool: false,
                rawOrderIndex: 0
              }
            ],
            meta: {
              source: "wechat",
              sortedBy: "publish_time_desc",
              persisted: true
            }
          })
        };
      }

      throw new Error(`Unexpected fetch url: ${url}`);
    });

    vi.stubGlobal("fetch", fetchMock);

    render(<MonitoringWorkbench />);

    expect(await screen.findByText("Persisted wechat article")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith("/api/keyword-targets?categoryId=claude");
  });

  it("does not refresh a platform after the category-level platform switch is disabled", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === "string" ? input : input.toString();

      if (url === "/api/keyword-targets?categoryId=claude") {
        return {
          ok: true,
          json: async () => ({
            keywordTargets: []
          })
        };
      }

      if (url.startsWith("/api/content/list")) {
        return {
          ok: true,
          json: async () => ({
            items: [],
            meta: {
              source: "xiaohongshu",
              sortedBy: "publish_time_desc",
              persisted: true
            }
          })
        };
      }

      if (url === "/api/content/refresh") {
        return {
          ok: true,
          json: async () => ({
            items: [],
            rawItems: [],
            meta: {
              source: "xiaohongshu",
              sortedBy: "publish_time_desc",
              persisted: true
            }
          })
        };
      }

      throw new Error(`Unexpected fetch url: ${url}`);
    });

    vi.stubGlobal("fetch", fetchMock);

    render(<MonitoringWorkbench />);

    await user.click(screen.getByRole("button", { name: "监控设置" }));
    await user.click(screen.getByTestId("settings-platform-xiaohongshu"));
    await user.click(screen.getByRole("button", { name: "内容" }));
    await user.click(screen.getByTestId("platform-filter-xiaohongshu"));
    await user.click(screen.getByRole("button", { name: "一键更新" }));

    await waitFor(() => {
      expect(
        fetchMock.mock.calls.filter(([url]) => String(url) === "/api/content/refresh")
      ).toHaveLength(0);
    });
  });

  it("keeps sidebar, top summary, and content counts aligned to the displayed capped results", async () => {
    const user = userEvent.setup();

    const xiaohongshuItems = Array.from({ length: 20 }, (_, index) => ({
      id: `xhs-${index + 1}`,
      date: "2026-03-31",
      timeOfDay: "上午",
      title: `xiaohongshu item ${index + 1}`,
      platformId: "xiaohongshu",
      author: `author ${index + 1}`,
      authorName: `author ${index + 1}`,
      authorId: `author-${index + 1}`,
      publishedAt: `2026-03-31 ${`${9 + Math.floor(index / 2)}`.padStart(2, "0")}:${`${index % 2}`.padStart(2, "0")}:00`,
      publishTime: `2026-03-31 ${`${9 + Math.floor(index / 2)}`.padStart(2, "0")}:${`${index % 2}`.padStart(2, "0")}:00`,
      publishTimestamp: 1711846800 - index * 60,
      heatScore: 90,
      metrics: { likes: `${index + 1}`, comments: `${index + 1}`, saves: `${index + 1}` },
      matchedTargets: ["claude code"],
      aiSummary: `summary ${index + 1}`,
      summary: `summary ${index + 1}`,
      linkedTopicIds: [],
      includedInDailyReport: false,
      inTopicPool: false,
      rawOrderIndex: index
    }));

    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === "string" ? input : input.toString();

      if (url === "/api/keyword-targets?categoryId=claude") {
        return {
          ok: true,
          json: async () => ({
            keywordTargets: []
          })
        };
      }

      if (url === "/api/content/refresh") {
        const body = JSON.parse(String(init?.body));

        expect(body.platformId).toBe("xiaohongshu");

        return {
          ok: true,
          json: async () => ({
            rawItems: xiaohongshuItems,
            items: xiaohongshuItems,
            meta: {
              source: "xiaohongshu",
              sortedBy: "publish_time_desc",
              persisted: true,
              fetchedCount: 25,
              cappedCount: 20
            }
          })
        };
      }

      if (url.startsWith("/api/content/list")) {
        return {
          ok: true,
          json: async () => ({
            items: [],
            meta: {
              source: "weibo",
              sortedBy: "publish_time_desc",
              persisted: true,
              fetchedCount: 0,
              cappedCount: 0
            }
          })
        };
      }

      throw new Error(`Unexpected fetch url: ${url}`);
    });

    vi.stubGlobal("fetch", fetchMock);

    const { container } = render(<MonitoringWorkbench />);

    await user.click(screen.getByTestId("platform-filter-xiaohongshu"));
    await user.click(screen.getByRole("button", { name: "一键更新" }));

    await screen.findByText("xiaohongshu item 1");

    expect(screen.getByText("按点赞数排序 · 真实数据")).toBeInTheDocument();
    expect(screen.getByText("当前来源：小红书原文")).toBeInTheDocument();
    expect(
      container.querySelector(".replica-shell__category-card.is-active .replica-shell__category-meta")?.textContent
    ).toContain("20");
    expect(container.querySelector(".replica-shell__summary-row")?.textContent).toContain("20");
    expect(container.querySelector(".replica-shell__content-head h3")?.textContent).toContain("20");

    await user.click(screen.getByTestId("platform-filter-weibo"));

    await waitFor(() => {
      expect(screen.getByText(/当前筛选下暂无内容/)).toBeInTheDocument();
    });
    expect(screen.queryByText("xiaohongshu item 1")).not.toBeInTheDocument();
    expect(
      container.querySelector(".replica-shell__category-card.is-active .replica-shell__category-meta")?.textContent
    ).toContain("0");
    expect(container.querySelector(".replica-shell__summary-row")?.textContent).toContain("0");
    expect(container.querySelector(".replica-shell__content-head h3")?.textContent).toContain("0");
  });

  it("refreshes only the enabled and configured collectable platforms in the all-platform view", async () => {
    const user = userEvent.setup();

    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === "string" ? input : input.toString();

      if (url === "/api/keyword-targets?categoryId=claude") {
        return {
          ok: true,
          json: async () => ({
            keywordTargets: []
          })
        };
      }

      if (url === "/api/content/refresh") {
        const body = JSON.parse(String(init?.body));

        return {
          ok: true,
          json: async () => ({
            rawItems: [],
            items: [
              {
                id: `${body.platformId}-1`,
                date: "2026-03-31",
                timeOfDay: "上午",
                title: `${body.platformId} item`,
                platformId: body.platformId,
                author: `${body.platformId} author`,
                authorName: `${body.platformId} author`,
                authorId: `${body.platformId}-author`,
                publishedAt: "2026-03-31 10:00:00",
                publishTime: "2026-03-31 10:00:00",
                publishTimestamp: 1711846800,
                heatScore: 80,
                metrics: { likes: "1", comments: "1", saves: "1" },
                matchedTargets: ["claude code"],
                aiSummary: `${body.platformId} summary`,
                summary: `${body.platformId} summary`,
                linkedTopicIds: [],
                includedInDailyReport: false,
                inTopicPool: false,
                rawOrderIndex: 0
              }
            ],
            meta: {
              source: body.platformId,
              sortedBy: "publish_time_desc",
              persisted: true,
              fetchedCount: 1,
              cappedCount: 1
            }
          })
        };
      }

      if (url === "/api/content/list?categoryId=claude&keywordTargetId=claude-keyword-1") {
        return {
          ok: true,
          json: async () => ({
            items: [
              {
                id: "wechat-1",
                date: "2026-03-31",
                timeOfDay: "上午",
                title: "wechat item",
                platformId: "wechat",
                author: "wechat author",
                authorName: "wechat author",
                authorId: "wechat-author",
                publishedAt: "2026-03-31 10:00:00",
                publishTime: "2026-03-31 10:00:00",
                publishTimestamp: 1711846800,
                heatScore: 80,
                metrics: { likes: "1", comments: "1", saves: "1" },
                matchedTargets: ["claude code"],
                aiSummary: "wechat summary",
                summary: "wechat summary",
                linkedTopicIds: [],
                includedInDailyReport: false,
                inTopicPool: false,
                rawOrderIndex: 0
              },
              {
                id: "xiaohongshu-1",
                date: "2026-03-31",
                timeOfDay: "上午",
                title: "xiaohongshu item",
                platformId: "xiaohongshu",
                author: "xiaohongshu author",
                authorName: "xiaohongshu author",
                authorId: "xiaohongshu-author",
                publishedAt: "2026-03-31 10:01:00",
                publishTime: "2026-03-31 10:01:00",
                publishTimestamp: 1711846860,
                heatScore: 80,
                metrics: { likes: "1", comments: "1", saves: "1" },
                matchedTargets: ["claude code"],
                aiSummary: "xiaohongshu summary",
                summary: "xiaohongshu summary",
                linkedTopicIds: [],
                includedInDailyReport: false,
                inTopicPool: false,
                rawOrderIndex: 0
              }
            ],
            meta: {
              source: "all",
              sortedBy: "publish_time_desc",
              persisted: true,
              fetchedCount: 2,
              cappedCount: 2
            }
          })
        };
      }

      if (url.startsWith("/api/content/list")) {
        return {
          ok: true,
          json: async () => ({
            items: [],
            meta: {
              source: "all",
              sortedBy: "publish_time_desc",
              persisted: true,
              fetchedCount: 0,
              cappedCount: 0
            }
          })
        };
      }

      throw new Error(`Unexpected fetch url: ${url}`);
    });

    vi.stubGlobal("fetch", fetchMock);

    render(<MonitoringWorkbench />);

    await user.click(screen.getByTestId("platform-filter-all"));
    await user.click(screen.getByRole("button", { name: "一键更新" }));

    await screen.findByText("xiaohongshu item");

    const refreshCalls = fetchMock.mock.calls.filter(([url]) => String(url) === "/api/content/refresh");
    expect(refreshCalls).toHaveLength(2);
    expect(refreshCalls.map(([, init]) => JSON.parse(String(init?.body)).platformId)).toEqual([
      "wechat",
      "xiaohongshu"
    ]);
  });

  it("refreshes twitter/x in the all-platform view only after the platform is enabled and configured", async () => {
    const user = userEvent.setup();

    const fetchMock = vi.fn(async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = typeof input === "string" ? input : input.toString();

      if (url === "/api/keyword-targets?categoryId=claude") {
        return {
          ok: true,
          json: async () => ({
            keywordTargets: [
              {
                id: "claude-keyword-1",
                keyword: "claude code",
                platformIds: ["wechat", "xiaohongshu", "twitter"],
                createdAt: "2026-03-31T08:00:00.000Z",
                lastRunAt: null,
                lastRunStatus: "idle",
                lastResultCount: 0
              }
            ]
          })
        };
      }

      if (url === "/api/content/refresh") {
        const body = JSON.parse(String(init?.body));

        return {
          ok: true,
          json: async () => ({
            rawItems: [],
            items: [],
            meta: {
              source: body.platformId,
              sortedBy: "publish_time_desc",
              persisted: true,
              fetchedCount: 0,
              cappedCount: 0
            }
          })
        };
      }

      if (url.startsWith("/api/content/list")) {
        return {
          ok: true,
          json: async () => ({
            items: [],
            meta: {
              source: "all",
              sortedBy: "publish_time_desc",
              persisted: true,
              fetchedCount: 0,
              cappedCount: 0
            }
          })
        };
      }

      throw new Error(`Unexpected fetch url: ${url}`);
    });

    vi.stubGlobal("fetch", fetchMock);

    render(<MonitoringWorkbench />);

    await user.click(screen.getByRole("button", { name: "监控设置" }));
    await user.click(screen.getByTestId("settings-platform-twitter"));
    await user.click(screen.getByRole("button", { name: "内容" }));
    await user.click(screen.getByTestId("platform-filter-all"));
    await user.click(screen.getByRole("button", { name: "一键更新" }));

    const refreshCalls = fetchMock.mock.calls.filter(([url]) => String(url) === "/api/content/refresh");
    expect(refreshCalls).toHaveLength(3);
    expect(refreshCalls.map(([, init]) => JSON.parse(String(init?.body)).platformId)).toEqual([
      "wechat",
      "xiaohongshu",
      "twitter"
    ]);
  });

  it("shows an empty state for twitter/x when there is no twitter content", async () => {
    const user = userEvent.setup();

    vi.stubGlobal(
      "fetch",
      vi.fn(async (input: RequestInfo | URL) => {
        const url = typeof input === "string" ? input : input.toString();

        if (url === "/api/keyword-targets?categoryId=claude") {
          return {
            ok: true,
            json: async () => ({ keywordTargets: [] })
          };
        }

        throw new Error(`Unexpected fetch url: ${url}`);
      })
    );

    render(<MonitoringWorkbench />);

    await user.click(screen.getByTestId("platform-filter-twitter"));

    expect(await screen.findByText("当前筛选下暂无内容")).toBeInTheDocument();
    expect(screen.queryByText("Claude Code + 开源工具的暴力工作流，下次直接躺赢")).not.toBeInTheDocument();
  });
});

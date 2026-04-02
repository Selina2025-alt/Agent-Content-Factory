import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import MonitoringWorkbench from "@/components/workbench/monitoring-workbench";

describe("replica workbench fetch", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("uses the unified refresh api for the current platform and shows xiaohongshu results", async () => {
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

        expect(body.platformId).toBe("xiaohongshu");
        expect(body.keyword).toBe("claude code");

        return {
          ok: true,
          json: async () => ({
            rawItems: [
              {
                id: "xhs-older",
                date: "2026-03-29",
                timeOfDay: "上午",
                title: "older note",
                platformId: "xiaohongshu",
                author: "旧作者",
                authorName: "旧作者",
                authorId: "old-user",
                publishedAt: "2026-03-29 08:00:00",
                publishTime: "2026-03-29 08:00:00",
                publishTimestamp: 1711670400,
                heatScore: 77,
                metrics: { likes: "9", comments: "1", saves: "10" },
                matchedTargets: ["claude code"],
                aiSummary: "old summary",
                summary: "old summary",
                linkedTopicIds: [],
                includedInDailyReport: false,
                inTopicPool: false,
                rawOrderIndex: 0
              }
            ],
            items: [
              {
                id: "xhs-new",
                date: "2026-03-31",
                timeOfDay: "上午",
                title: "Claude Code 小红书新样本",
                platformId: "xiaohongshu",
                author: "小红书作者",
                authorName: "小红书作者",
                authorId: "xhs-user",
                publishedAt: "2026-03-31 09:00:00",
                publishTime: "2026-03-31 09:00:00",
                publishTimestamp: 1711846800,
                heatScore: 88,
                metrics: { likes: "12", comments: "3", saves: "14" },
                matchedTargets: ["claude code"],
                aiSummary: "summary",
                summary: "summary",
                linkedTopicIds: [],
                includedInDailyReport: false,
                inTopicPool: false,
                rawOrderIndex: 1
              }
            ],
            meta: {
              source: "xiaohongshu",
              sortedBy: "publish_time_desc",
              persisted: true
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

    await user.click(screen.getByTestId("platform-filter-xiaohongshu"));
    await user.click(screen.getByRole("button", { name: /一键更新/i }));

    const articleTitle = await screen.findByText("Claude Code 小红书新样本");
    const card = articleTitle.closest(".replica-shell__content-card");
    expect(screen.getByText("按点赞数排序 · 真实数据")).toBeInTheDocument();
    expect(screen.getByText(/当前来源：小红书关键词结果/)).toBeInTheDocument();
    expect(within(card as HTMLElement).queryByRole("link", { name: "查看笔记原文" })).toBeNull();
    return;

    expect(screen.getByText(/页面展示顺序：按 publish_time 倒序/)).toBeInTheDocument();
    expect(screen.getByText(/当前来源：小红书关键词结果/)).toBeInTheDocument();
    expect(within(card as HTMLElement).queryByRole("link", { name: "查看笔记原文" })).toBeNull();
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
                timeOfDay: "涓婂崍",
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
      timeOfDay: "涓婂崍",
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

  it("refreshes every collectable platform when the all-platform view is selected", async () => {
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
                timeOfDay: "涓婂崍",
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
                timeOfDay: "涓婂崍",
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
                timeOfDay: "涓婂崍",
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
});

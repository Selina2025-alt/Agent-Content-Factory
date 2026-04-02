import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import MonitoringWorkbench from "@/components/workbench/monitoring-workbench";

function createHistoryQuery(keyword = "claude code") {
  return {
    id: "query-twitter-1",
    categoryId: "claude",
    keywordTargetId: "claude-keyword-1",
    keyword,
    platformScope: "twitter",
    triggerType: "manual_refresh",
    status: "success",
    fetchedCount: 6,
    cappedCount: 6,
    startedAt: "2026-04-01T10:00:00.000Z",
    finishedAt: "2026-04-01T10:01:00.000Z",
    errorMessage: null
  };
}

function createHistoryFetchMock(queries: unknown[] = []) {
  return vi.fn(async (input: RequestInfo | URL) => {
    const url = typeof input === "string" ? input : input.toString();

    if (url === "/api/keyword-targets?categoryId=claude") {
      return {
        ok: true,
        json: async () => ({ keywordTargets: [] })
      };
    }

    if (url === "/api/history") {
      return {
        ok: true,
        json: async () => ({ queries })
      };
    }

    if (url === "/api/history/query-twitter-1") {
      return {
        ok: true,
        json: async () => ({
          query: createHistoryQuery(),
          analysis: null,
          items: [
            {
              id: "twitter-history-1",
              date: "2026-04-01",
              timeOfDay: "上午",
              title: "Twitter/X history post",
              platformId: "twitter",
              author: "History Author",
              authorName: "History Author",
              authorId: "history-author",
              publishedAt: "2026-04-01 10:00:00",
              publishTime: "2026-04-01 10:00:00",
              publishTimestamp: 1711965600,
              heatScore: 88,
              metrics: { likes: "10", comments: "3", saves: "5" },
              matchedTargets: ["claude code"],
              aiSummary: "history summary",
              summary: "history summary",
              linkedTopicIds: [],
              includedInDailyReport: false,
              inTopicPool: false,
              keyword: "claude code",
              articleUrl: "https://x.com/example/status/2",
              sourceUrl: "https://x.com/example/status/2",
              rawOrderIndex: 0
            }
          ]
        })
      };
    }

    throw new Error(`Unexpected fetch url: ${url}`);
  });
}

describe("replica history page", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    window.localStorage.clear();
  });

  it("opens the history page from the workbench tab bar", async () => {
    const user = userEvent.setup();

    vi.stubGlobal("fetch", createHistoryFetchMock());

    render(<MonitoringWorkbench />);

    await user.click(screen.getByRole("button", { name: "搜索历史" }));

    expect(await screen.findByRole("heading", { name: "搜索历史" })).toBeInTheDocument();
    expect(screen.getByLabelText("平台")).toBeInTheDocument();
    expect(screen.getByLabelText("关键词")).toBeInTheDocument();
  });

  it("keeps history records collapsed until a specific entry is opened", async () => {
    const user = userEvent.setup();

    vi.stubGlobal("fetch", createHistoryFetchMock([createHistoryQuery()]));

    render(<MonitoringWorkbench />);

    await user.click(screen.getByRole("button", { name: "搜索历史" }));

    expect(screen.getByText("claude code")).toBeInTheDocument();
    expect(screen.queryByText("Twitter/X history post")).not.toBeInTheDocument();

    await user.click(screen.getByText("claude code").closest("button") as HTMLButtonElement);

    expect(screen.getByText("Twitter/X history post")).toBeInTheDocument();
    expect(screen.getByText("来源平台：Twitter/X")).toBeInTheDocument();
  });

  it("does not fall back to legacy localStorage history when sqlite returns an empty list", async () => {
    const user = userEvent.setup();

    window.localStorage.setItem(
      "replica-search-history",
      JSON.stringify([
        {
          id: "legacy-entry-1",
          keyword: "legacy keyword",
          categoryId: "claude",
          categoryName: "Legacy Category",
          searchedAt: "2026-04-01 09:00"
        }
      ])
    );

    vi.stubGlobal("fetch", createHistoryFetchMock([]));

    render(<MonitoringWorkbench />);

    await user.click(screen.getByRole("button", { name: "搜索历史" }));

    expect(await screen.findByRole("heading", { name: "搜索历史" })).toBeInTheDocument();
    expect(screen.getByText("还没有搜索历史，先去内容页执行一次抓取吧。")).toBeInTheDocument();
    expect(screen.queryByText("legacy keyword")).not.toBeInTheDocument();
  });

  it("shows twitter/x history records with the twitter/x platform label", async () => {
    const user = userEvent.setup();

    vi.stubGlobal("fetch", createHistoryFetchMock([createHistoryQuery()]));

    render(<MonitoringWorkbench />);

    await user.click(screen.getByRole("button", { name: "搜索历史" }));
    await user.click(screen.getByText("claude code").closest("button") as HTMLButtonElement);

    const record = screen.getByText("claude code").closest("article") as HTMLElement;

    expect(within(record).getByText("Twitter/X")).toBeInTheDocument();
    expect(within(record).getByText("来源平台：Twitter/X")).toBeInTheDocument();
    expect(within(record).getByText("Twitter/X history post")).toBeInTheDocument();
  });
});

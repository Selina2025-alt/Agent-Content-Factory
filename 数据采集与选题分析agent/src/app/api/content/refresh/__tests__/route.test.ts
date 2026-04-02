// @vitest-environment node

import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";

const repository = {
  database: {
    close: vi.fn()
  }
};

const createMonitoringRepositoryMock = vi.fn(() => repository);
const upsertAnalysisSnapshotMock = vi.fn();
const buildAnalysisArchiveSnapshotMock = vi.fn(() => ({
  snapshot: {
    id: "query-run-1-analysis",
    searchQueryId: "query-run-1",
    categoryId: "claude",
    keyword: "claude code",
    generatedAt: "2026-04-01T10:00:00.000Z",
    hotSummary: "hot",
    focusSummary: "focus",
    patternSummary: "pattern",
    insightSummary: "insight"
  },
  topics: []
}));
const refreshKeywordTargetPlatformMock = vi.fn();

vi.mock("@/lib/db/monitoring-repository", () => ({
  createMonitoringRepository: createMonitoringRepositoryMock,
  upsertAnalysisSnapshot: upsertAnalysisSnapshotMock
}));

vi.mock("@/lib/history-archive", () => ({
  buildAnalysisArchiveSnapshot: buildAnalysisArchiveSnapshotMock
}));

vi.mock("@/lib/monitoring-sync-service", () => ({
  refreshKeywordTargetPlatform: refreshKeywordTargetPlatformMock
}));

describe("POST /api/content/refresh", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    repository.database.close.mockReset();
    refreshKeywordTargetPlatformMock.mockResolvedValue({
      searchQueryId: "query-run-1",
      items: [],
      rawItems: [],
      fetchedCount: 2,
      cappedCount: 2
    });
  });

  it("archives an analysis snapshot when reports are provided without changing the response shape", async () => {
    const { POST } = await import("@/app/api/content/refresh/route");

    const request = new NextRequest("http://localhost/api/content/refresh", {
      method: "POST",
      body: JSON.stringify({
        categoryId: "claude",
        keywordTargetId: "claude-keyword-1",
        keyword: "claude code",
        platformId: "wechat",
        platformIds: ["wechat", "xiaohongshu"],
        reports: [
          {
            id: "report-1",
            date: "2026-04-01",
            label: "4月1日",
            hotSummary: "hot",
            focusSummary: "focus",
            patternSummary: "pattern",
            insightSummary: "insight",
            suggestions: []
          }
        ]
      })
    });

    const response = await POST(request);
    const payload = await response.json();

    expect(refreshKeywordTargetPlatformMock).toHaveBeenCalledTimes(1);
    expect(buildAnalysisArchiveSnapshotMock).toHaveBeenCalledWith({
      searchQueryId: "query-run-1",
      categoryId: "claude",
      keyword: "claude code",
      reports: [
        expect.objectContaining({
          id: "report-1",
          date: "2026-04-01"
        })
      ]
    });
    expect(upsertAnalysisSnapshotMock).toHaveBeenCalledWith(
      repository,
      expect.objectContaining({
        snapshot: expect.objectContaining({
          searchQueryId: "query-run-1"
        })
      })
    );
    expect(payload).toEqual({
      items: [],
      rawItems: [],
      meta: {
        source: "wechat",
        sortedBy: "publish_time_desc",
        persisted: true,
        fetchedCount: 2,
        cappedCount: 2
      }
    });
    expect(repository.database.close).toHaveBeenCalledTimes(1);
  });
});

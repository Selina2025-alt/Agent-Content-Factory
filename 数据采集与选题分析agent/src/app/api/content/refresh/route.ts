import { NextRequest, NextResponse } from "next/server";

import { createMonitoringRepository } from "@/lib/db/monitoring-repository";
import { upsertAnalysisSnapshot } from "@/lib/db/monitoring-repository";
import { buildAnalysisArchiveSnapshot } from "@/lib/history-archive";
import { refreshKeywordTargetPlatform, type SyncablePlatformId } from "@/lib/monitoring-sync-service";
import type { ReplicaDailyReport, ReplicaTrackedPlatformId } from "@/lib/replica-workbench-data";

interface RefreshRequestBody {
  categoryId?: string;
  keywordTargetId?: string;
  keyword?: string;
  platformId?: ReplicaTrackedPlatformId;
  platformIds?: ReplicaTrackedPlatformId[];
  createdAt?: string;
  lastRunAt?: string | null;
  lastRunStatus?: "idle" | "running" | "success" | "failed";
  lastResultCount?: number;
  reports?: ReplicaDailyReport[];
}

export async function POST(request: NextRequest) {
  const body = (await request.json()) as RefreshRequestBody;
  const categoryId = body.categoryId?.trim() ?? "";
  const keywordTargetId = body.keywordTargetId?.trim() ?? "";
  const keyword = body.keyword?.trim().toLowerCase() ?? "";
  const platformId = body.platformId;
  const platformIds = Array.isArray(body.platformIds) ? body.platformIds : platformId ? [platformId] : [];

  if (!categoryId || !keywordTargetId || !keyword || !platformId) {
    return NextResponse.json(
      {
        error: "categoryId, keywordTargetId, keyword, and platformId are required",
        items: []
      },
      { status: 400 }
    );
  }

  if (platformId !== "wechat" && platformId !== "xiaohongshu") {
    return NextResponse.json(
      {
        error: "Only wechat and xiaohongshu refresh are supported right now",
        items: []
      },
      { status: 400 }
    );
  }

  const repository = createMonitoringRepository();

  try {
    const snapshot = await refreshKeywordTargetPlatform({
      repository,
      categoryId,
      keywordTarget: {
        id: keywordTargetId,
        categoryId,
        keyword,
        platformIds,
        createdAt: body.createdAt?.trim() || new Date().toISOString(),
        lastRunAt: body.lastRunAt ?? null,
        lastRunStatus: body.lastRunStatus ?? "idle",
        lastResultCount: body.lastResultCount ?? 0
      },
      platformId: platformId as SyncablePlatformId
    });

    if (Array.isArray(body.reports) && body.reports.length > 0) {
      upsertAnalysisSnapshot(
        repository,
        buildAnalysisArchiveSnapshot({
          searchQueryId: snapshot.searchQueryId,
          categoryId,
          keyword,
          reports: body.reports
        })
      );
    }

    return NextResponse.json({
      items: snapshot.items,
      rawItems: snapshot.rawItems,
      meta: {
        source: platformId,
        sortedBy: "publish_time_desc",
        persisted: true,
        fetchedCount: snapshot.fetchedCount,
        cappedCount: snapshot.cappedCount
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      {
        error: message,
        items: [],
        rawItems: [],
        meta: null
      },
      { status: 502 }
    );
  } finally {
    repository.database.close();
  }
}

import type { MonitoringDatabase } from "@/lib/db/database";
import { initializeMonitoringDatabase } from "@/lib/db/database";
import type { ReplicaTrackedPlatformId } from "@/lib/replica-workbench-data";
import type { ContentItem } from "@/lib/types";

export type SyncRunStatus = "idle" | "running" | "success" | "failed";

export interface PersistedKeywordTarget {
  id: string;
  categoryId: string;
  keyword: string;
  platformIds: ReplicaTrackedPlatformId[];
  createdAt: string;
  lastRunAt: string | null;
  lastRunStatus: SyncRunStatus;
  lastResultCount: number;
}

export interface PersistedSearchQuery {
  id: string;
  categoryId: string;
  keywordTargetId: string | null;
  keyword: string;
  platformScope: string;
  triggerType: "manual_refresh" | "keyword_created";
  status: SyncRunStatus;
  fetchedCount: number;
  cappedCount: number;
  startedAt: string;
  finishedAt: string | null;
  errorMessage: string | null;
}

export interface PersistedAnalysisTopic {
  id: string;
  snapshotId: string;
  title: string;
  intro: string;
  whyNow: string;
  hook: string;
  growth: string;
  supportContentIds: string[];
}

export interface PersistedAnalysisSnapshot {
  id: string;
  searchQueryId: string;
  categoryId: string;
  keyword: string;
  generatedAt: string;
  hotSummary: string;
  focusSummary: string;
  patternSummary: string;
  insightSummary: string;
}

export interface PersistedAnalysisSnapshotDetail {
  snapshot: PersistedAnalysisSnapshot;
  topics: PersistedAnalysisTopic[];
}

export interface PersistedSyncRun {
  id: string;
  categoryId: string;
  keywordTargetId: string;
  platformId: ReplicaTrackedPlatformId;
  status: SyncRunStatus;
  resultCount: number;
  errorMessage: string | null;
  startedAt: string;
  finishedAt: string | null;
}

interface UpsertCollectedContentsInput {
  categoryId: string;
  keywordTargetId: string;
  platformId: ContentItem["platformId"];
  syncRunId: string | null;
  items: ContentItem[];
  collectedAt: string;
}

interface ReplaceSearchQueryContentsInput {
  searchQueryId: string;
  categoryId: string;
  keywordTargetId: string | null;
  platformId: ContentItem["platformId"];
  items: ContentItem[];
  collectedAt: string;
}

interface ListCollectedContentsInput {
  categoryId: string;
  keywordTargetId: string;
  platformId?: ContentItem["platformId"];
  limit?: number;
}

interface ListCollectedContentsBySearchQueryInput {
  searchQueryId: string;
  platformId?: ContentItem["platformId"];
  limit?: number;
}

export interface MonitoringRepository {
  database: MonitoringDatabase;
}

export { initializeMonitoringDatabase } from "@/lib/db/database";

export function createMonitoringRepository(database = initializeMonitoringDatabase()): MonitoringRepository {
  return {
    database
  };
}

export function coerceSearchQueryTriggerType(
  value: string
): PersistedSearchQuery["triggerType"] {
  return value === "keyword_created" ? "keyword_created" : "manual_refresh";
}

export function coerceSyncRunStatus(value: string): SyncRunStatus {
  switch (value) {
    case "running":
    case "success":
    case "failed":
      return value;
    default:
      return "idle";
  }
}

export function upsertKeywordTarget(repository: MonitoringRepository, target: PersistedKeywordTarget) {
  repository.database
    .prepare(
      `INSERT INTO keyword_targets (
        id,
        category_id,
        keyword,
        platform_ids,
        created_at,
        last_run_at,
        last_run_status,
        last_result_count
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        category_id = excluded.category_id,
        keyword = excluded.keyword,
        platform_ids = excluded.platform_ids,
        created_at = excluded.created_at,
        last_run_at = excluded.last_run_at,
        last_run_status = excluded.last_run_status,
        last_result_count = excluded.last_result_count`
    )
    .run(
      target.id,
      target.categoryId,
      target.keyword,
      JSON.stringify(target.platformIds),
      target.createdAt,
      target.lastRunAt,
      target.lastRunStatus,
      target.lastResultCount
    );
}

export function listKeywordTargets(repository: MonitoringRepository, categoryId: string): PersistedKeywordTarget[] {
  const rows = repository.database
    .prepare(
      `SELECT
        id,
        category_id,
        keyword,
        platform_ids,
        created_at,
        last_run_at,
        last_run_status,
        last_result_count
      FROM keyword_targets
      WHERE category_id = ?
      ORDER BY created_at ASC`
    )
    .all(categoryId) as Array<{
    id: string;
    category_id: string;
    keyword: string;
    platform_ids: string;
    created_at: string;
    last_run_at: string | null;
    last_run_status: SyncRunStatus;
    last_result_count: number;
  }>;

  return rows.map((row) => ({
    id: row.id,
    categoryId: row.category_id,
    keyword: row.keyword,
    platformIds: JSON.parse(row.platform_ids) as ReplicaTrackedPlatformId[],
    createdAt: row.created_at,
    lastRunAt: row.last_run_at,
    lastRunStatus: row.last_run_status,
    lastResultCount: row.last_result_count
  }));
}

export function getKeywordTargetById(
  repository: MonitoringRepository,
  categoryId: string,
  id: string
): PersistedKeywordTarget | undefined {
  const row = repository.database
    .prepare(
      `SELECT
        id,
        category_id,
        keyword,
        platform_ids,
        created_at,
        last_run_at,
        last_run_status,
        last_result_count
      FROM keyword_targets
      WHERE category_id = ? AND id = ?`
    )
    .get(categoryId, id) as
    | {
        id: string;
        category_id: string;
        keyword: string;
        platform_ids: string;
        created_at: string;
        last_run_at: string | null;
        last_run_status: SyncRunStatus;
        last_result_count: number;
      }
    | undefined;

  if (!row) {
    return undefined;
  }

  return {
    id: row.id,
    categoryId: row.category_id,
    keyword: row.keyword,
    platformIds: JSON.parse(row.platform_ids) as ReplicaTrackedPlatformId[],
    createdAt: row.created_at,
    lastRunAt: row.last_run_at,
    lastRunStatus: row.last_run_status,
    lastResultCount: row.last_result_count
  };
}

export function createSearchQuery(repository: MonitoringRepository, input: PersistedSearchQuery) {
  repository.database
    .prepare(
      `INSERT INTO search_queries (
        id,
        category_id,
        keyword_target_id,
        keyword,
        platform_scope,
        trigger_type,
        status,
        fetched_count,
        capped_count,
        started_at,
        finished_at,
        error_message
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        category_id = excluded.category_id,
        keyword_target_id = excluded.keyword_target_id,
        keyword = excluded.keyword,
        platform_scope = excluded.platform_scope,
        trigger_type = excluded.trigger_type,
        status = excluded.status,
        fetched_count = excluded.fetched_count,
        capped_count = excluded.capped_count,
        started_at = excluded.started_at,
        finished_at = excluded.finished_at,
        error_message = excluded.error_message`
    )
    .run(
      input.id,
      input.categoryId,
      input.keywordTargetId,
      input.keyword,
      input.platformScope,
      input.triggerType,
      input.status,
      input.fetchedCount,
      input.cappedCount,
      input.startedAt,
      input.finishedAt,
      input.errorMessage
    );
}

export function finishSearchQuery(
  repository: MonitoringRepository,
  input: Pick<PersistedSearchQuery, "id" | "status" | "fetchedCount" | "cappedCount" | "finishedAt" | "errorMessage">
) {
  repository.database
    .prepare(
      `UPDATE search_queries
      SET status = ?,
          fetched_count = ?,
          capped_count = ?,
          finished_at = ?,
          error_message = ?
      WHERE id = ?`
    )
    .run(
      input.status,
      input.fetchedCount,
      input.cappedCount,
      input.finishedAt,
      input.errorMessage,
      input.id
    );
}

export function listSearchQueries(
  repository: MonitoringRepository,
  categoryId?: string | null
): PersistedSearchQuery[] {
  const normalizedCategoryId = categoryId?.trim() ?? "";
  const statement = normalizedCategoryId
    ? repository.database.prepare(
        `SELECT
          id,
          category_id,
          keyword_target_id,
          keyword,
          platform_scope,
          trigger_type,
          status,
          fetched_count,
          capped_count,
          started_at,
          finished_at,
          error_message
        FROM search_queries
        WHERE category_id = ?
        ORDER BY started_at DESC, id DESC`
      )
    : repository.database.prepare(
        `SELECT
          id,
          category_id,
          keyword_target_id,
          keyword,
          platform_scope,
          trigger_type,
          status,
          fetched_count,
          capped_count,
          started_at,
          finished_at,
          error_message
        FROM search_queries
        ORDER BY started_at DESC, id DESC`
      );
  const rows = (normalizedCategoryId ? statement.all(normalizedCategoryId) : statement.all()) as Array<{
    id: string;
    category_id: string;
    keyword_target_id: string | null;
    keyword: string;
    platform_scope: string;
    trigger_type: string;
    status: string;
    fetched_count: number;
    capped_count: number;
    started_at: string;
    finished_at: string | null;
    error_message: string | null;
  }>;

  return rows.map((row) => mapSearchQueryRow(row));
}

export function getSearchQueryById(
  repository: MonitoringRepository,
  id: string
): PersistedSearchQuery | undefined {
  const row = repository.database
    .prepare(
      `SELECT
        id,
        category_id,
        keyword_target_id,
        keyword,
        platform_scope,
        trigger_type,
        status,
        fetched_count,
        capped_count,
        started_at,
        finished_at,
        error_message
      FROM search_queries
      WHERE id = ?`
    )
    .get(id) as
    | {
        id: string;
        category_id: string;
        keyword_target_id: string | null;
        keyword: string;
        platform_scope: string;
        trigger_type: string;
        status: string;
        fetched_count: number;
        capped_count: number;
        started_at: string;
        finished_at: string | null;
        error_message: string | null;
      }
    | undefined;

  return row ? mapSearchQueryRow(row) : undefined;
}

export function createSyncRun(repository: MonitoringRepository, input: PersistedSyncRun) {
  repository.database
    .prepare(
      `INSERT INTO sync_runs (
        id,
        category_id,
        keyword_target_id,
        platform_id,
        status,
        result_count,
        error_message,
        started_at,
        finished_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      input.id,
      input.categoryId,
      input.keywordTargetId,
      input.platformId,
      input.status,
      input.resultCount,
      input.errorMessage,
      input.startedAt,
      input.finishedAt
    );
}

export function finishSyncRun(
  repository: MonitoringRepository,
  input: Pick<PersistedSyncRun, "id" | "status" | "resultCount" | "errorMessage" | "finishedAt">
) {
  const syncRun = repository.database
    .prepare(
      `SELECT category_id, keyword_target_id
      FROM sync_runs
      WHERE id = ?`
    )
    .get(input.id) as
    | {
        category_id: string;
        keyword_target_id: string;
      }
    | undefined;

  repository.database
    .prepare(
      `UPDATE sync_runs
      SET status = ?,
          result_count = ?,
          error_message = ?,
          finished_at = ?
      WHERE id = ?`
    )
    .run(input.status, input.resultCount, input.errorMessage, input.finishedAt, input.id);

  if (!syncRun) {
    return;
  }

  repository.database
    .prepare(
      `UPDATE keyword_targets
      SET last_run_at = ?,
          last_run_status = ?,
          last_result_count = ?
      WHERE id = ? AND category_id = ?`
    )
    .run(
      input.finishedAt,
      input.status,
      input.resultCount,
      syncRun.keyword_target_id,
      syncRun.category_id
    );
}

export function upsertAnalysisSnapshot(
  repository: MonitoringRepository,
  input: { snapshot: PersistedAnalysisSnapshot; topics: PersistedAnalysisTopic[] }
) {
  repository.database.exec("BEGIN");

  try {
    repository.database
      .prepare(
        `INSERT INTO analysis_snapshots (
          id,
          search_query_id,
          category_id,
          keyword,
          generated_at,
          hot_summary,
          focus_summary,
          pattern_summary,
          insight_summary
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(id) DO UPDATE SET
          search_query_id = excluded.search_query_id,
          category_id = excluded.category_id,
          keyword = excluded.keyword,
          generated_at = excluded.generated_at,
          hot_summary = excluded.hot_summary,
          focus_summary = excluded.focus_summary,
          pattern_summary = excluded.pattern_summary,
          insight_summary = excluded.insight_summary`
      )
      .run(
        input.snapshot.id,
        input.snapshot.searchQueryId,
        input.snapshot.categoryId,
        input.snapshot.keyword,
        input.snapshot.generatedAt,
        input.snapshot.hotSummary,
        input.snapshot.focusSummary,
        input.snapshot.patternSummary,
        input.snapshot.insightSummary
      );

    repository.database
      .prepare(`DELETE FROM analysis_topics WHERE snapshot_id = ?`)
      .run(input.snapshot.id);

    const topicStatement = repository.database.prepare(
      `INSERT INTO analysis_topics (
        id,
        snapshot_id,
        title,
        intro,
        why_now,
        hook,
        growth,
        support_content_ids
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        snapshot_id = excluded.snapshot_id,
        title = excluded.title,
        intro = excluded.intro,
        why_now = excluded.why_now,
        hook = excluded.hook,
        growth = excluded.growth,
        support_content_ids = excluded.support_content_ids`
    );

    for (const topic of input.topics) {
      topicStatement.run(
        topic.id,
        topic.snapshotId,
        topic.title,
        topic.intro,
        topic.whyNow,
        topic.hook,
        topic.growth,
        JSON.stringify(topic.supportContentIds)
      );
    }

    repository.database.exec("COMMIT");
  } catch (error) {
    repository.database.exec("ROLLBACK");
    throw error;
  }
}

export function getAnalysisSnapshotBySearchQuery(
  repository: MonitoringRepository,
  searchQueryId: string
): PersistedAnalysisSnapshotDetail | undefined {
  const snapshot = repository.database
    .prepare(
      `SELECT
        id,
        search_query_id,
        category_id,
        keyword,
        generated_at,
        hot_summary,
        focus_summary,
        pattern_summary,
        insight_summary
      FROM analysis_snapshots
      WHERE search_query_id = ?
      ORDER BY generated_at DESC, id DESC
      LIMIT 1`
    )
    .get(searchQueryId) as
    | {
        id: string;
        search_query_id: string;
        category_id: string;
        keyword: string;
        generated_at: string;
        hot_summary: string;
        focus_summary: string;
        pattern_summary: string;
        insight_summary: string;
      }
    | undefined;

  if (!snapshot) {
    return undefined;
  }

  const topics = repository.database
    .prepare(
      `SELECT
        id,
        title,
        intro,
        why_now,
        hook,
        growth,
        support_content_ids
      FROM analysis_topics
      WHERE snapshot_id = ?
      ORDER BY id ASC`
    )
    .all(snapshot.id) as Array<{
    id: string;
    title: string;
    intro: string;
    why_now: string;
    hook: string;
    growth: string;
    support_content_ids: string;
  }>;

  return {
    snapshot: {
      id: snapshot.id,
      searchQueryId: snapshot.search_query_id,
      categoryId: snapshot.category_id,
      keyword: snapshot.keyword,
      generatedAt: snapshot.generated_at,
      hotSummary: snapshot.hot_summary,
      focusSummary: snapshot.focus_summary,
      patternSummary: snapshot.pattern_summary,
      insightSummary: snapshot.insight_summary
    },
    topics: topics.map((topic) => ({
      id: topic.id,
      snapshotId: snapshot.id,
      title: topic.title,
      intro: topic.intro,
      whyNow: topic.why_now,
      hook: topic.hook,
      growth: topic.growth,
      supportContentIds: JSON.parse(topic.support_content_ids) as string[]
    }))
  };
}

export function upsertCollectedContents(
  repository: MonitoringRepository,
  input: UpsertCollectedContentsInput
) {
  const deleteStatement = repository.database.prepare(
    `DELETE FROM collected_contents
    WHERE category_id = ?
      AND keyword_target_id = ?
      AND platform_id = ?`
  );
  const statement = repository.database.prepare(
    `INSERT INTO collected_contents (
      platform_id,
      content_id,
      category_id,
      keyword_target_id,
      sync_run_id,
      title,
      summary,
      author_name,
      author_id,
      published_at,
      publish_timestamp,
      read_count,
      like_count,
      comment_count,
      article_url,
      avatar,
      is_original,
      keyword,
      raw_order_index,
      source_payload,
      last_collected_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(platform_id, content_id, keyword_target_id) DO UPDATE SET
      category_id = excluded.category_id,
      sync_run_id = excluded.sync_run_id,
      title = excluded.title,
      summary = excluded.summary,
      author_name = excluded.author_name,
      author_id = excluded.author_id,
      published_at = excluded.published_at,
      publish_timestamp = excluded.publish_timestamp,
      read_count = excluded.read_count,
      like_count = excluded.like_count,
      comment_count = excluded.comment_count,
      article_url = excluded.article_url,
      avatar = excluded.avatar,
      is_original = excluded.is_original,
      keyword = excluded.keyword,
      raw_order_index = excluded.raw_order_index,
      source_payload = excluded.source_payload,
      last_collected_at = excluded.last_collected_at`
  );

  repository.database.exec("BEGIN");

  try {
    deleteStatement.run(input.categoryId, input.keywordTargetId, input.platformId);

    for (const item of input.items) {
      statement.run(
        input.platformId,
        item.id,
        input.categoryId,
        input.keywordTargetId,
        input.syncRunId,
        item.title,
        item.summary ?? "",
        item.authorName ?? item.author,
        item.authorId ?? null,
        item.publishTime ?? item.publishedAt,
        item.publishTimestamp ?? 0,
        item.readCount ?? null,
        item.likeCount ?? null,
        Number.parseInt(item.metrics.comments, 10) || null,
        item.articleUrl ?? item.sourceUrl ?? null,
        item.avatar ?? null,
        item.isOriginal ? 1 : 0,
        item.keyword ?? null,
        item.rawOrderIndex ?? null,
        JSON.stringify(item),
        input.collectedAt
      );
    }
    repository.database.exec("COMMIT");
  } catch (error) {
    repository.database.exec("ROLLBACK");
    throw error;
  }
}

export function replaceSearchQueryContents(
  repository: MonitoringRepository,
  input: ReplaceSearchQueryContentsInput
) {
  const deleteStatement = repository.database.prepare(
    `DELETE FROM search_query_contents
    WHERE search_query_id = ?
      AND platform_id = ?`
  );
  const statement = repository.database.prepare(
    `INSERT INTO search_query_contents (
      search_query_id,
      category_id,
      keyword_target_id,
      platform_id,
      content_id,
      title,
      summary,
      author_name,
      author_id,
      published_at,
      publish_timestamp,
      read_count,
      like_count,
      comment_count,
      article_url,
      avatar,
      is_original,
      keyword,
      raw_order_index,
      source_payload,
      last_collected_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON CONFLICT(search_query_id, platform_id, content_id) DO UPDATE SET
      category_id = excluded.category_id,
      keyword_target_id = excluded.keyword_target_id,
      title = excluded.title,
      summary = excluded.summary,
      author_name = excluded.author_name,
      author_id = excluded.author_id,
      published_at = excluded.published_at,
      publish_timestamp = excluded.publish_timestamp,
      read_count = excluded.read_count,
      like_count = excluded.like_count,
      comment_count = excluded.comment_count,
      article_url = excluded.article_url,
      avatar = excluded.avatar,
      is_original = excluded.is_original,
      keyword = excluded.keyword,
      raw_order_index = excluded.raw_order_index,
      source_payload = excluded.source_payload,
      last_collected_at = excluded.last_collected_at`
  );

  repository.database.exec("BEGIN");

  try {
    deleteStatement.run(input.searchQueryId, input.platformId);

    for (const item of input.items) {
      statement.run(
        input.searchQueryId,
        input.categoryId,
        input.keywordTargetId,
        input.platformId,
        item.id,
        item.title,
        item.summary ?? "",
        item.authorName ?? item.author,
        item.authorId ?? null,
        item.publishTime ?? item.publishedAt,
        item.publishTimestamp ?? 0,
        item.readCount ?? null,
        item.likeCount ?? null,
        Number.parseInt(item.metrics.comments, 10) || null,
        item.articleUrl ?? item.sourceUrl ?? null,
        item.avatar ?? null,
        item.isOriginal ? 1 : 0,
        item.keyword ?? null,
        item.rawOrderIndex ?? null,
        JSON.stringify(item),
        input.collectedAt
      );
    }

    repository.database.exec("COMMIT");
  } catch (error) {
    repository.database.exec("ROLLBACK");
    throw error;
  }
}

export function listCollectedContents(
  repository: MonitoringRepository,
  input: ListCollectedContentsInput
): ContentItem[] {
  const limit = input.limit ?? 100;

  const rows = repository.database
    .prepare(
      `SELECT
        content_id,
        platform_id,
        title,
        summary,
        author_name,
        author_id,
        published_at,
        publish_timestamp,
        read_count,
        like_count,
        comment_count,
        article_url,
        avatar,
        is_original,
        keyword,
        raw_order_index,
        source_payload
      FROM collected_contents
      WHERE category_id = ?
        AND keyword_target_id = ?
        AND (? IS NULL OR platform_id = ?)
      ORDER BY publish_timestamp DESC, raw_order_index ASC
      LIMIT ?`
    )
    .all(
      input.categoryId,
      input.keywordTargetId,
      input.platformId ?? null,
      input.platformId ?? null,
      limit
    ) as Array<{
    content_id: string;
    platform_id: ContentItem["platformId"];
    title: string;
    summary: string;
    author_name: string;
    author_id: string | null;
    published_at: string;
    publish_timestamp: number;
    read_count: number | null;
    like_count: number | null;
    comment_count: number | null;
    article_url: string | null;
    avatar: string | null;
    is_original: number | null;
    keyword: string | null;
    raw_order_index: number | null;
    source_payload: string;
  }>;

  return rows.map((row) => {
    const payload = JSON.parse(row.source_payload) as ContentItem;

    return {
      ...payload,
      id: row.content_id,
      platformId: row.platform_id,
      title: row.title,
      summary: row.summary,
      author: row.author_name,
      authorName: row.author_name,
      authorId: row.author_id ?? undefined,
      publishedAt: row.published_at,
      publishTime: row.published_at,
      publishTimestamp: row.publish_timestamp,
      readCount: row.read_count ?? undefined,
      likeCount: row.like_count ?? undefined,
      articleUrl: row.article_url ?? undefined,
      sourceUrl: row.article_url ?? undefined,
      avatar: row.avatar ?? undefined,
      isOriginal: row.is_original === 1,
      keyword: row.keyword ?? undefined,
      rawOrderIndex: row.raw_order_index ?? undefined,
      metrics: {
        ...payload.metrics,
        comments:
          row.comment_count !== null && row.comment_count !== undefined
            ? `${row.comment_count}`
            : payload.metrics.comments
      }
    };
  });
}

export function listCollectedContentsBySearchQuery(
  repository: MonitoringRepository,
  input: ListCollectedContentsBySearchQueryInput
): ContentItem[] {
  return listSearchQueryContents(repository, input);
}

export function listSearchQueryContents(
  repository: MonitoringRepository,
  input: ListCollectedContentsBySearchQueryInput
): ContentItem[] {
  const limit = input.limit ?? 100;
  const rows = repository.database
    .prepare(
      `SELECT
        content_id,
        platform_id,
        title,
        summary,
        author_name,
        author_id,
        published_at,
        publish_timestamp,
        read_count,
        like_count,
        comment_count,
        article_url,
        avatar,
        is_original,
        keyword,
        raw_order_index,
        source_payload
      FROM search_query_contents
      WHERE search_query_id = ?
        AND (? IS NULL OR platform_id = ?)
      ORDER BY
        CASE WHEN raw_order_index IS NULL THEN 1 ELSE 0 END ASC,
        raw_order_index ASC,
        publish_timestamp DESC
      LIMIT ?`
    )
    .all(
      input.searchQueryId,
      input.platformId ?? null,
      input.platformId ?? null,
      limit
    ) as Array<{
    content_id: string;
    platform_id: ContentItem["platformId"];
    title: string;
    summary: string;
    author_name: string;
    author_id: string | null;
    published_at: string;
    publish_timestamp: number;
    read_count: number | null;
    like_count: number | null;
    comment_count: number | null;
    article_url: string | null;
    avatar: string | null;
    is_original: number | null;
    keyword: string | null;
    raw_order_index: number | null;
    source_payload: string;
  }>;

  if (rows.length > 0) {
    return rows.map((row) => mapStoredContentRow(row));
  }

  const searchQuery = getSearchQueryById(repository, input.searchQueryId);

  if (!searchQuery?.keywordTargetId) {
    return [];
  }

  const derivedSyncRunId = input.searchQueryId.startsWith("query-")
    ? input.searchQueryId.slice("query-".length)
    : null;

  if (!derivedSyncRunId) {
    return [];
  }

  const fallbackRows = repository.database
    .prepare(
      `SELECT
        content_id,
        platform_id,
        title,
        summary,
        author_name,
        author_id,
        published_at,
        publish_timestamp,
        read_count,
        like_count,
        comment_count,
        article_url,
        avatar,
        is_original,
        keyword,
        raw_order_index,
        source_payload
      FROM collected_contents
      WHERE category_id = ?
        AND keyword_target_id = ?
        AND sync_run_id = ?
        AND (? IS NULL OR platform_id = ?)
      ORDER BY
        CASE WHEN raw_order_index IS NULL THEN 1 ELSE 0 END ASC,
        raw_order_index ASC,
        publish_timestamp DESC
      LIMIT ?`
    )
    .all(
      searchQuery.categoryId,
      searchQuery.keywordTargetId,
      derivedSyncRunId,
      input.platformId ?? null,
      input.platformId ?? null,
      limit
    ) as Array<{
    content_id: string;
    platform_id: ContentItem["platformId"];
    title: string;
    summary: string;
    author_name: string;
    author_id: string | null;
    published_at: string;
    publish_timestamp: number;
    read_count: number | null;
    like_count: number | null;
    comment_count: number | null;
    article_url: string | null;
    avatar: string | null;
    is_original: number | null;
    keyword: string | null;
    raw_order_index: number | null;
    source_payload: string;
  }>;

  return fallbackRows.map((row) => mapStoredContentRow(row));
}

function mapSearchQueryRow(row: {
  id: string;
  category_id: string;
  keyword_target_id: string | null;
  keyword: string;
  platform_scope: string;
  trigger_type: string;
  status: string;
  fetched_count: number;
  capped_count: number;
  started_at: string;
  finished_at: string | null;
  error_message: string | null;
}): PersistedSearchQuery {
  return {
    id: row.id,
    categoryId: row.category_id,
    keywordTargetId: row.keyword_target_id,
    keyword: row.keyword,
    platformScope: row.platform_scope,
    triggerType: coerceSearchQueryTriggerType(row.trigger_type),
    status: coerceSyncRunStatus(row.status),
    fetchedCount: row.fetched_count,
    cappedCount: row.capped_count,
    startedAt: row.started_at,
    finishedAt: row.finished_at,
    errorMessage: row.error_message
  };
}

function mapStoredContentRow(row: {
  content_id: string;
  platform_id: ContentItem["platformId"];
  title: string;
  summary: string;
  author_name: string;
  author_id: string | null;
  published_at: string;
  publish_timestamp: number;
  read_count: number | null;
  like_count: number | null;
  comment_count: number | null;
  article_url: string | null;
  avatar: string | null;
  is_original: number | null;
  keyword: string | null;
  raw_order_index: number | null;
  source_payload: string;
}): ContentItem {
  const payload = JSON.parse(row.source_payload) as ContentItem;

  return {
    ...payload,
    id: row.content_id,
    platformId: row.platform_id,
    title: row.title,
    summary: row.summary,
    author: row.author_name,
    authorName: row.author_name,
    authorId: row.author_id ?? undefined,
    publishedAt: row.published_at,
    publishTime: row.published_at,
    publishTimestamp: row.publish_timestamp,
    readCount: row.read_count ?? undefined,
    likeCount: row.like_count ?? undefined,
    articleUrl: row.article_url ?? undefined,
    sourceUrl: row.article_url ?? undefined,
    avatar: row.avatar ?? undefined,
    isOriginal: row.is_original === 1,
    keyword: row.keyword ?? undefined,
    rawOrderIndex: row.raw_order_index ?? undefined,
    metrics: {
      ...payload.metrics,
      comments:
        row.comment_count !== null && row.comment_count !== undefined
          ? `${row.comment_count}`
          : payload.metrics.comments
    }
  };
}

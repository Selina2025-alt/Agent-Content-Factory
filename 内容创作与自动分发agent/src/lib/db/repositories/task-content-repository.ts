import type {
  GeneratedTaskContentBundle,
  PlatformContentRecord,
  PlatformId,
  PublishStatus
} from "@/lib/types";
import { openDatabase } from "@/lib/db/client";

type TaskContentRow = {
  id: string;
  task_id: string;
  platform: PlatformId;
  content_type: string;
  title: string;
  body_json: string;
  publish_status: PublishStatus;
  version: number;
  created_at: string;
  updated_at: string;
};

function buildRecord(
  taskId: string,
  platform: PlatformId,
  contentType: string,
  title: string,
  body: object
): PlatformContentRecord {
  const now = new Date().toISOString();

  return {
    id: `${taskId}:${platform}`,
    taskId,
    platform,
    contentType,
    title,
    bodyJson: JSON.stringify(body),
    publishStatus: "idle",
    version: 1,
    createdAt: now,
    updatedAt: now
  };
}

function mapTaskContentRow(row: TaskContentRow): PlatformContentRecord {
  return {
    id: row.id,
    taskId: row.task_id,
    platform: row.platform,
    contentType: row.content_type,
    title: row.title,
    bodyJson: row.body_json,
    publishStatus: row.publish_status,
    version: row.version,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}

export function createTaskContents(
  taskId: string,
  bundle: GeneratedTaskContentBundle
) {
  const records: PlatformContentRecord[] = [];

  if (bundle.wechat) {
    records.push(
      buildRecord(taskId, "wechat", "article", bundle.wechat.title, bundle.wechat)
    );
  }

  if (bundle.xiaohongshu) {
    records.push(
      buildRecord(
        taskId,
        "xiaohongshu",
        "note",
        bundle.xiaohongshu.title,
        bundle.xiaohongshu
      )
    );
  }

  if (bundle.twitter) {
    records.push(
      buildRecord(taskId, "twitter", "thread", "Twitter Thread", bundle.twitter)
    );
  }

  if (bundle.videoScript) {
    records.push(
      buildRecord(
        taskId,
        "videoScript",
        "script",
        bundle.videoScript.title,
        bundle.videoScript
      )
    );
  }

  const db = openDatabase();
  const statement = db.prepare(
    `INSERT INTO task_contents (
      id,
      task_id,
      platform,
      content_type,
      title,
      body_json,
      publish_status,
      version,
      created_at,
      updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  for (const record of records) {
    statement.run(
      record.id,
      record.taskId,
      record.platform,
      record.contentType,
      record.title,
      record.bodyJson,
      record.publishStatus,
      record.version,
      record.createdAt,
      record.updatedAt
    );
  }

  db.close();
}

export function listTaskContents(taskId: string) {
  const db = openDatabase();
  const rows = db
    .prepare(
      `SELECT id, task_id, platform, content_type, title, body_json, publish_status, version, created_at, updated_at
       FROM task_contents
       WHERE task_id = ?
       ORDER BY created_at ASC`
    )
    .all(taskId) as TaskContentRow[];

  db.close();

  return rows.map(mapTaskContentRow);
}

export function getTaskBundle(taskId: string) {
  const rows = listTaskContents(taskId);

  return rows.reduce(
    (bundle, row) => {
      const parsedBody = JSON.parse(row.bodyJson) as Record<string, unknown>;
      const content = {
        ...parsedBody,
        publishStatus: row.publishStatus
      };

      bundle[row.platform] = content;

      return bundle;
    },
    {
      wechat: null,
      xiaohongshu: null,
      twitter: null,
      videoScript: null
    } as Record<PlatformId, Record<string, unknown> | null>
  );
}

export function updatePublishStatus(
  taskId: string,
  platform: Exclude<PlatformId, "videoScript">,
  publishStatus: PublishStatus
) {
  const db = openDatabase();

  db.prepare(
    `UPDATE task_contents
     SET publish_status = ?, updated_at = ?
     WHERE task_id = ? AND platform = ?`
  ).run(publishStatus, new Date().toISOString(), taskId, platform);

  db.close();
}

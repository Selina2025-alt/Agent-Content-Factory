"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { ArticleEditor } from "@/components/workspace/article-editor";
import { ContentActions } from "@/components/workspace/content-actions";
import { HistorySidebar } from "@/components/workspace/history-sidebar";
import { PlatformTabs } from "@/components/workspace/platform-tabs";
import { TaskSummaryBar } from "@/components/workspace/task-summary-bar";
import { TwitterEditor } from "@/components/workspace/twitter-editor";
import { VideoScriptEditor } from "@/components/workspace/video-script-editor";
import { XiaohongshuEditor } from "@/components/workspace/xiaohongshu-editor";
import type {
  PersistedGeneratedTaskContentBundle,
  PlatformId,
  TaskRecord
} from "@/lib/types";

type HistoryItem = {
  id: string;
  title: string;
  updatedAt: string;
};

const platformLabels: Record<PlatformId, string> = {
  wechat: "公众号文章",
  xiaohongshu: "小红书笔记",
  twitter: "Twitter",
  videoScript: "视频脚本"
};

export function WorkspaceShell(props: {
  initialTaskId: string;
  initialTask: TaskRecord;
  initialHistory: HistoryItem[];
  initialBundle: PersistedGeneratedTaskContentBundle;
}) {
  const [historyItems, setHistoryItems] = useState(props.initialHistory);
  const [task, setTask] = useState(props.initialTask);
  const [bundle, setBundle] = useState(props.initialBundle);
  const [activePlatform, setActivePlatform] = useState<PlatformId>(
    props.initialTask.selectedPlatforms[0] ?? "wechat"
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [statusText, setStatusText] = useState("内容已就绪");
  const isFirstRender = useRef(true);
  const suppressAutosaveStatus = useRef(false);

  const activeLabel = platformLabels[activePlatform];
  const currentContent = bundle[activePlatform];

  const contentPreview = useMemo(() => {
    if (!currentContent) {
      return "当前平台暂时没有内容。";
    }

    if ("title" in currentContent && typeof currentContent.title === "string") {
      return currentContent.title;
    }

    return "这里会显示当前平台的编辑器与操作区。";
  }, [currentContent]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (suppressAutosaveStatus.current) {
      suppressAutosaveStatus.current = false;
      return;
    }

    setStatusText("Saving draft...");

    const timer = window.setTimeout(() => {
      setStatusText("Autosaved locally");
    }, 450);

    return () => window.clearTimeout(timer);
  }, [bundle]);

  function handleRename(taskId: string, title: string) {
    setHistoryItems((items) =>
      items.map((item) => (item.id === taskId ? { ...item, title } : item))
    );

    if (task.id === taskId) {
      setTask((currentTask) => ({
        ...currentTask,
        title
      }));
    }
  }

  function handleDelete(taskId: string) {
    setHistoryItems((items) => items.filter((item) => item.id !== taskId));
  }

  function updateCurrentPlatformContent(
    nextValue: PersistedGeneratedTaskContentBundle[PlatformId]
  ) {
    setBundle((currentBundle) => ({
      ...currentBundle,
      [activePlatform]: nextValue
    }));
  }

  async function handleCopy() {
    if (!currentContent) {
      return;
    }

    const serialized = JSON.stringify(currentContent, null, 2);

    if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(serialized);
      setStatusText("已复制到剪贴板");
      return;
    }

    setStatusText("当前环境不支持系统剪贴板");
  }

  async function handlePublish() {
    if (activePlatform === "videoScript") {
      return;
    }

    setIsPublishing(true);

    try {
      const response = await fetch(`/api/tasks/${props.initialTaskId}/publish`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          platform: activePlatform
        })
      });

      const result = (await response.json()) as { message: string; status: string };

      suppressAutosaveStatus.current = true;
      setBundle((currentBundle) => {
        const platformContent = currentBundle[activePlatform];

        if (!platformContent) {
          return currentBundle;
        }

        return {
          ...currentBundle,
          [activePlatform]: {
            ...platformContent,
            publishStatus: result.status
          }
        };
      });
      setStatusText(result.message);
    } finally {
      setIsPublishing(false);
    }
  }

  function renderEditor() {
    if (activePlatform === "wechat" && bundle.wechat) {
      return (
        <ArticleEditor
          isEditing={isEditing}
          onChange={updateCurrentPlatformContent}
          value={bundle.wechat}
        />
      );
    }

    if (activePlatform === "xiaohongshu" && bundle.xiaohongshu) {
      return (
        <XiaohongshuEditor
          isEditing={isEditing}
          onChange={updateCurrentPlatformContent}
          value={bundle.xiaohongshu}
        />
      );
    }

    if (activePlatform === "twitter" && bundle.twitter) {
      return (
        <TwitterEditor
          isEditing={isEditing}
          onChange={updateCurrentPlatformContent}
          value={bundle.twitter}
        />
      );
    }

    if (activePlatform === "videoScript" && bundle.videoScript) {
      return (
        <VideoScriptEditor
          isEditing={isEditing}
          onChange={updateCurrentPlatformContent}
          value={bundle.videoScript}
        />
      );
    }

    return (
      <div className="workspace-card__body">
        <p className="workspace-card__description">当前平台暂时没有内容。</p>
      </div>
    );
  }

  return (
    <main className="workspace-layout">
      <HistorySidebar
        activeTaskId={props.initialTaskId}
        items={historyItems}
        onDelete={handleDelete}
        onRename={handleRename}
        onSelect={() => {}}
      />

      <section className="workspace-canvas">
        <TaskSummaryBar
          prompt={task.userInput}
          selectedPlatforms={task.selectedPlatforms}
          title={task.title}
        />

        <div className="workspace-card">
          <PlatformTabs
            activePlatform={activePlatform}
            availablePlatforms={task.selectedPlatforms}
            onChange={setActivePlatform}
          />

          <ContentActions
            canPublish={activePlatform !== "videoScript"}
            isEditing={isEditing}
            isPublishing={isPublishing}
            onCopy={() => {
              void handleCopy();
            }}
            onPublish={() => {
              void handlePublish();
            }}
            onToggleEdit={() => setIsEditing((current) => !current)}
            statusText={statusText}
          />

          <div className="workspace-card__body">
            <p className="workspace-card__eyebrow">{activeLabel}</p>
            <h2 className="workspace-card__title">当前正在查看 {activeLabel} 内容</h2>
            <p className="workspace-card__description">{contentPreview}</p>
            {renderEditor()}
          </div>
        </div>
      </section>
    </main>
  );
}

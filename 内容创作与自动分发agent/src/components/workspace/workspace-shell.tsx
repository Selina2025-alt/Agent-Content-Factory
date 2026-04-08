"use client";

import { useMemo, useState } from "react";

import { HistorySidebar } from "@/components/workspace/history-sidebar";
import { PlatformTabs } from "@/components/workspace/platform-tabs";
import { TaskSummaryBar } from "@/components/workspace/task-summary-bar";
import type { PlatformId, TaskRecord } from "@/lib/types";

type HistoryItem = {
  id: string;
  title: string;
  updatedAt: string;
};

type PersistedBundle = {
  [K in PlatformId]: Record<string, unknown> | null;
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
  initialBundle: PersistedBundle;
}) {
  const [historyItems, setHistoryItems] = useState(props.initialHistory);
  const [task, setTask] = useState(props.initialTask);
  const [activePlatform, setActivePlatform] = useState<PlatformId>(
    props.initialTask.selectedPlatforms[0] ?? "wechat"
  );

  const activeLabel = platformLabels[activePlatform];
  const currentContent = props.initialBundle[activePlatform];

  const contentPreview = useMemo(() => {
    if (!currentContent) {
      return "当前平台暂时没有内容。";
    }

    if ("title" in currentContent && typeof currentContent.title === "string") {
      return currentContent.title;
    }

    return "这里会显示当前平台的编辑器与操作区。";
  }, [currentContent]);

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

          <div className="workspace-card__body">
            <p className="workspace-card__eyebrow">{activeLabel}</p>
            <h2 className="workspace-card__title">当前正在查看 {activeLabel} 内容</h2>
            <p className="workspace-card__description">{contentPreview}</p>
          </div>
        </div>
      </section>
    </main>
  );
}

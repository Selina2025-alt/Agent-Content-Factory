import { useMemo, useState } from "react";

import type { ReplicaCategory, ReplicaTrackedPlatformId } from "@/lib/replica-workbench-data";
import { replicaPlatforms } from "@/lib/replica-workbench-data";

interface ReplicaSettingsPanelProps {
  category: ReplicaCategory;
  onTogglePlatform: (platformId: string) => void;
  onAddKeywordTarget: (input: { keyword: string; platformIds: ReplicaTrackedPlatformId[] }) => void;
  onRemoveKeywordTarget: (keywordTargetId: string) => void;
  onAddCreator: (creator: string) => void;
  onRemoveCreator: (creatorId: string) => void;
  onDeleteCategory: () => void;
}

function isKeywordPlatformDisabled(
  platformId: ReplicaTrackedPlatformId,
  enabledPlatformIds: ReplicaTrackedPlatformId[]
) {
  return !enabledPlatformIds.includes(platformId);
}

export function ReplicaSettingsPanel({
  category,
  onTogglePlatform,
  onAddKeywordTarget,
  onRemoveKeywordTarget,
  onAddCreator,
  onRemoveCreator,
  onDeleteCategory
}: ReplicaSettingsPanelProps) {
  const [keywordDraft, setKeywordDraft] = useState("");
  const [creatorDraft, setCreatorDraft] = useState("");
  const [selectedKeywordPlatforms, setSelectedKeywordPlatforms] = useState<ReplicaTrackedPlatformId[]>([
    "wechat"
  ]);

  const enabledPlatforms = useMemo(
    () => category.platforms.filter((platform) => platform.enabled).map((platform) => platform.id),
    [category.platforms]
  );
  const keywordPlatforms = useMemo(
    () =>
      replicaPlatforms.filter(
        (platform): platform is (typeof replicaPlatforms)[number] & { id: ReplicaTrackedPlatformId } =>
          platform.id !== "all"
      ),
    []
  );

  const canSubmitKeyword =
    keywordDraft.trim().length > 0 &&
    selectedKeywordPlatforms.some((platformId) => enabledPlatforms.includes(platformId));

  function handleToggleKeywordPlatform(platformId: ReplicaTrackedPlatformId) {
    setSelectedKeywordPlatforms((current) =>
      current.includes(platformId)
        ? current.filter((item) => item !== platformId)
        : [...current, platformId]
    );
  }

  function handleSubmitKeyword() {
    const normalized = keywordDraft.trim();

    if (!normalized) {
      return;
    }

    const nextPlatformIds = selectedKeywordPlatforms.filter((platformId) => enabledPlatforms.includes(platformId));

    if (nextPlatformIds.length === 0) {
      return;
    }

    onAddKeywordTarget({
      keyword: normalized,
      platformIds: nextPlatformIds
    });
    setKeywordDraft("");
    setSelectedKeywordPlatforms(["wechat"]);
  }

  return (
    <div className="replica-shell__settings-grid">
      <section className="replica-shell__settings-card">
        <h4>监控平台</h4>
        <div className="replica-shell__settings-platforms">
          {category.platforms.map((platform) => (
            <button
              key={platform.id}
              className={`replica-shell__platform-setting ${platform.enabled ? "is-enabled" : ""}`}
              data-testid={`settings-platform-${platform.id}`}
              type="button"
              onClick={() => onTogglePlatform(platform.id)}
            >
              <span>
                {platform.icon} {platform.label}
              </span>
              <strong>{platform.enabled ? "已启用" : "已停用"}</strong>
            </button>
          ))}
        </div>
      </section>

      <section className="replica-shell__settings-card">
        <div className="replica-shell__settings-card-head">
          <h4>关键词</h4>
          <button type="button" onClick={handleSubmitKeyword} disabled={!canSubmitKeyword}>
            新增关键词
          </button>
        </div>
        <input
          className="replica-shell__settings-input"
          placeholder="输入新的监控关键词"
          value={keywordDraft}
          onChange={(event) => setKeywordDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleSubmitKeyword();
            }
          }}
        />
        <div className="replica-shell__settings-platform-picker">
          {keywordPlatforms.map((platform) => {
            const isSelected = selectedKeywordPlatforms.includes(platform.id);
            const isDisabled = isKeywordPlatformDisabled(platform.id, enabledPlatforms);

            return (
              <button
                key={platform.id}
                type="button"
                className={`replica-shell__keyword-platform-chip ${isSelected ? "is-selected" : ""}`}
                data-testid={`keyword-platform-${platform.id}`}
                aria-pressed={isSelected}
                disabled={isDisabled}
                onClick={() => handleToggleKeywordPlatform(platform.id)}
              >
                <span>
                  {platform.icon} {platform.label}
                </span>
              </button>
            );
          })}
        </div>
        <div className="replica-shell__keyword-target-list">
          {category.keywordTargets.map((target) => (
            <div key={target.id} className="replica-shell__keyword-target-item">
              <div className="replica-shell__keyword-target-head">
                <strong>{target.keyword}</strong>
                <button type="button" onClick={() => onRemoveKeywordTarget(target.id)}>
                  删除
                </button>
              </div>
              <div className="replica-shell__tag-list">
                {target.platformIds.map((platformId) => {
                  const platform = replicaPlatforms.find((item) => item.id === platformId);

                  return (
                    <span key={`${target.id}-${platformId}`} className="replica-shell__tag-item">
                      {platform?.icon} {platform?.label ?? platformId}
                    </span>
                  );
                })}
              </div>
              <div className="replica-shell__keyword-target-meta">
                <span>最近抓取：{target.lastRunAt ?? "未抓取"}</span>
                <span>状态：{target.lastRunStatus}</span>
                <span>结果数：{target.lastResultCount}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="replica-shell__settings-card">
        <div className="replica-shell__settings-card-head">
          <h4>对标账号</h4>
          <button
            type="button"
            onClick={() => {
              onAddCreator(creatorDraft);
              setCreatorDraft("");
            }}
          >
            新增账号
          </button>
        </div>
        <input
          className="replica-shell__settings-input"
          placeholder="输入账号名称"
          value={creatorDraft}
          onChange={(event) => setCreatorDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onAddCreator(creatorDraft);
              setCreatorDraft("");
            }
          }}
        />
        <div className="replica-shell__creator-list">
          {category.creators.map((creator) => (
            <div key={creator.id} className="replica-shell__creator-item">
              <span>
                {creator.name} · {creator.platformId}
              </span>
              <button type="button" onClick={() => onRemoveCreator(creator.id)}>
                删除
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="replica-shell__settings-card">
        <h4>运行规则</h4>
        <div className="replica-shell__rule-list">
          <span>{category.runRule.scheduleLabel}</span>
          <span>运行时间 {category.runRule.runTime}</span>
          <span>分析范围 {category.runRule.analysisScope}</span>
        </div>
      </section>

      <section className="replica-shell__settings-card replica-shell__settings-card--danger">
        <h4>分类管理</h4>
        <p>删除当前分类后，左侧列表会同步移除该分类。</p>
        <button className="replica-shell__danger-button" type="button" onClick={onDeleteCategory}>
          删除当前分类
        </button>
      </section>
    </div>
  );
}

export default ReplicaSettingsPanel;

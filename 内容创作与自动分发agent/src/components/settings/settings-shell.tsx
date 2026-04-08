"use client";

import { useState } from "react";

import { PlatformRuleBindingPanel } from "@/components/settings/platform-rule-binding-panel";
import { GithubSkillInstallPanel } from "@/components/settings/github-skill-install-panel";
import { SkillDetailPanel } from "@/components/settings/skill-detail-panel";
import { SkillUploadPanel } from "@/components/settings/skill-upload-panel";
import { SkillsLibrary } from "@/components/settings/skills-library";
import type { SkillLearningResultRecord, SkillRecord } from "@/lib/types";

const platformPanels = [
  {
    key: "wechat",
    label: "公众号文章",
    description:
      "适合长文深度内容，支持标题、摘要、正文和基础富文本结构。"
  },
  {
    key: "xiaohongshu",
    label: "小红书笔记",
    description:
      "面向图文种草场景，突出标题、文案和图片建议。"
  },
  {
    key: "twitter",
    label: "Twitter",
    description: "单条与 Thread 并存，适合简洁观点和连续输出。"
  },
  {
    key: "videoScript",
    label: "视频脚本",
    description: "强调分镜和旁白结构，适合短视频原型阶段创作。"
  }
] as const;

type SkillDetailsMap = Record<string, SkillLearningResultRecord | null>;

export function SettingsShell(props: {
  initialSkillDetails?: SkillDetailsMap;
  initialSkills?: SkillRecord[];
}) {
  const [skills, setSkills] = useState(props.initialSkills ?? []);
  const [skillDetails, setSkillDetails] = useState<SkillDetailsMap>(
    props.initialSkillDetails ?? {}
  );
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(
    props.initialSkills?.[0]?.id ?? null
  );

  const selectedSkill =
    skills.find((skill) => skill.id === selectedSkillId) ?? null;
  const selectedLearningResult = selectedSkillId
    ? skillDetails[selectedSkillId] ?? null
    : null;

  function handleSkillReady(input: {
    skill: SkillRecord;
    learningResult: SkillLearningResultRecord;
  }) {
    setSkills((current) => [
      input.skill,
      ...current.filter((skill) => skill.id !== input.skill.id)
    ]);
    setSkillDetails((current) => ({
      ...current,
      [input.skill.id]: input.learningResult
    }));
    setSelectedSkillId(input.skill.id);
  }

  return (
    <main className="settings-layout">
      <aside className="settings-nav">
        <p className="settings-nav__eyebrow">Settings</p>
        <h1 className="settings-nav__title">平台规则与 Skills</h1>
        <nav className="settings-nav__list">
          {platformPanels.map((panel) => (
            <button className="settings-nav__button" key={panel.key} type="button">
              {panel.label}
            </button>
          ))}
          <button className="settings-nav__button settings-nav__button--accent" type="button">
            Skills Library
          </button>
        </nav>
      </aside>

      <section className="settings-content">
        <div className="settings-grid">
          {platformPanels.map((panel) => (
            <PlatformRuleBindingPanel
              description={panel.description}
              enabledSkillNames={skills.slice(0, 2).map((skill) => skill.name)}
              key={panel.key}
              platform={panel.label}
            />
          ))}
        </div>

        <div className="settings-skills-grid">
          <div className="settings-panel-stack">
            <SkillUploadPanel onUploaded={handleSkillReady} />
            <GithubSkillInstallPanel onInstalled={handleSkillReady} />
          </div>
          <SkillDetailPanel
            learningResult={selectedLearningResult}
            skill={selectedSkill}
          />
        </div>

        <SkillsLibrary
          activeSkillId={selectedSkillId}
          onSelect={setSelectedSkillId}
          skills={skills.map((skill) => ({
            id: skill.id,
            name: skill.name,
            summary: skill.summary,
            source: skill.sourceType.toUpperCase(),
            status: skill.status
          }))}
        />
      </section>
    </main>
  );
}

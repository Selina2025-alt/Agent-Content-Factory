import { PlatformRuleBindingPanel } from "@/components/settings/platform-rule-binding-panel";
import { SkillsLibrary } from "@/components/settings/skills-library";

const platformPanels = [
  {
    key: "wechat",
    label: "公众号文章",
    description: "适合长文深度内容，支持标题、摘要、正文和基础富文本结构。"
  },
  {
    key: "xiaohongshu",
    label: "小红书笔记",
    description: "面向图文种草场景，突出标题、文案和图片建议。"
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

export function SettingsShell() {
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
              enabledSkillNames={[]}
              key={panel.key}
              platform={panel.label}
            />
          ))}
        </div>

        <SkillsLibrary skills={[]} />
      </section>
    </main>
  );
}

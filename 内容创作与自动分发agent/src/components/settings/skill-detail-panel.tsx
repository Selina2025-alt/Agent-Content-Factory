import type { SkillLearningResultRecord, SkillRecord } from "@/lib/types";

export function SkillDetailPanel(props: {
  skill: SkillRecord | null;
  learningResult: SkillLearningResultRecord | null;
}) {
  return (
    <section className="settings-card">
      <p className="settings-card__eyebrow">Skill Detail</p>
      <h2 className="settings-card__title">
        {props.skill?.name ?? "选中一个 skill 查看详情"}
      </h2>
      <p className="settings-card__description">
        {props.learningResult?.summary ??
          "这里会展示 skill 的学习摘要、关键词、规则和示例索引。"}
      </p>

      {props.learningResult ? (
        <div className="settings-detail-grid">
          <div>
            <p className="settings-card__eyebrow">Keywords</p>
            <div className="settings-chip-list">
              {props.learningResult.keywords.map((keyword) => (
                <span className="settings-chip" key={keyword}>
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="settings-card__eyebrow">Rules</p>
            <ul className="settings-detail-list">
              {props.learningResult.rules.map((rule) => (
                <li key={rule}>{rule}</li>
              ))}
            </ul>
          </div>

          <div>
            <p className="settings-card__eyebrow">Examples</p>
            <ul className="settings-detail-list">
              {props.learningResult.examplesSummary.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </section>
  );
}

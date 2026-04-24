export function PlatformRuleBindingPanel(props: {
  platform: string;
  description: string;
  enabledSkillNames: string[];
}) {
  return (
    <section className="settings-card">
      <p className="settings-card__eyebrow">Platform Rules</p>
      <h2 className="settings-card__title">{props.platform}</h2>
      <p className="settings-card__description">{props.description}</p>
      <div className="settings-chip-list">
        {props.enabledSkillNames.length > 0 ? (
          props.enabledSkillNames.map((skill) => (
            <span className="settings-chip" key={skill}>
              {skill}
            </span>
          ))
        ) : (
          <span className="settings-empty-inline">尚未绑定 skills</span>
        )}
      </div>
      <div className="settings-actions">
        <button type="button">保存</button>
        <button type="button">重置</button>
      </div>
    </section>
  );
}

type SkillListItem = {
  id: string;
  name: string;
  summary: string;
  source: string;
};

export function SkillsLibrary(props: { skills: SkillListItem[] }) {
  return (
    <section className="settings-card">
      <p className="settings-card__eyebrow">Skills Library</p>
      <h2 className="settings-card__title">Skills Library</h2>
      <p className="settings-card__description">
        上传 zip 技能包，或者后续从 GitHub 安装 skill，让不同平台生成时复用你的规则。
      </p>

      {props.skills.length > 0 ? (
        <div className="settings-library-list">
          {props.skills.map((skill) => (
            <article className="settings-library-item" key={skill.id}>
              <div>
                <strong>{skill.name}</strong>
                <p>{skill.summary}</p>
              </div>
              <span className="settings-chip">{skill.source}</span>
            </article>
          ))}
        </div>
      ) : (
        <div className="settings-empty">
          <strong>还没有导入任何 skills</strong>
          <p>下一步我们会在这里接上 zip 上传、解析学习和 GitHub 安装能力。</p>
        </div>
      )}
    </section>
  );
}

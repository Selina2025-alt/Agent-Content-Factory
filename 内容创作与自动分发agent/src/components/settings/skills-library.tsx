type SkillListItem = {
  id: string;
  name: string;
  summary: string;
  source: string;
  status: string;
};

export function SkillsLibrary(props: {
  activeSkillId?: string | null;
  onSelect?: (skillId: string) => void;
  skills: SkillListItem[];
}) {
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
            <article
              className={[
                "settings-library-item",
                props.activeSkillId === skill.id
                  ? "settings-library-item--active"
                  : ""
              ]
                .filter(Boolean)
                .join(" ")}
              key={skill.id}
            >
              <button
                className="settings-library-item__button"
                onClick={() => props.onSelect?.(skill.id)}
                type="button"
              >
                <div>
                  <strong>{skill.name}</strong>
                  <p>{skill.summary}</p>
                </div>
                <div className="settings-library-item__meta">
                  <span className="settings-chip">{skill.source}</span>
                  <span className="settings-chip">{skill.status}</span>
                </div>
              </button>
            </article>
          ))}
        </div>
      ) : (
        <div className="settings-empty">
          <strong>还没有导入任何 skills</strong>
          <p>上传一个 zip 技能包后，这里会显示解析结果，并允许你切换查看详情。</p>
        </div>
      )}
    </section>
  );
}

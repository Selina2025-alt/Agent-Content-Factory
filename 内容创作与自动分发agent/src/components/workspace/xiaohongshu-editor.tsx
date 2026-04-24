import type { PersistedXiaohongshuContent } from "@/lib/types";

export function XiaohongshuEditor(props: {
  value: PersistedXiaohongshuContent;
  isEditing: boolean;
  onChange: (value: PersistedXiaohongshuContent) => void;
}) {
  function updateImageSuggestion(index: number, nextValue: string) {
    const nextSuggestions = [...props.value.imageSuggestions];
    nextSuggestions[index] = nextValue;
    props.onChange({ ...props.value, imageSuggestions: nextSuggestions });
  }

  return (
    <section className="editor-surface editor-surface--stacked">
      <div className="editor-field">
        <label htmlFor="xh-title">笔记标题</label>
        <input
          id="xh-title"
          onChange={(event) =>
            props.onChange({ ...props.value, title: event.target.value })
          }
          readOnly={!props.isEditing}
          value={props.value.title}
        />
      </div>

      <div className="editor-field">
        <label htmlFor="xh-caption">文案</label>
        <textarea
          id="xh-caption"
          onChange={(event) =>
            props.onChange({ ...props.value, caption: event.target.value })
          }
          readOnly={!props.isEditing}
          rows={10}
          value={props.value.caption}
        />
      </div>

      <div className="editor-section">
        <h3>图片建议</h3>
        <div className="editor-grid editor-grid--cards">
          {props.value.imageSuggestions.map((suggestion, index) => (
            <label className="editor-mini-card" key={`${suggestion}-${index}`}>
              <span>图片 {index + 1}</span>
              <textarea
                onChange={(event) =>
                  updateImageSuggestion(index, event.target.value)
                }
                readOnly={!props.isEditing}
                rows={3}
                value={suggestion}
              />
            </label>
          ))}
        </div>
      </div>
    </section>
  );
}

import type { PersistedVideoScriptContent } from "@/lib/types";

export function VideoScriptEditor(props: {
  value: PersistedVideoScriptContent;
  isEditing: boolean;
  onChange: (value: PersistedVideoScriptContent) => void;
}) {
  function updateScene(
    index: number,
    field: "shot" | "visual" | "voiceover",
    nextValue: string
  ) {
    const nextScenes = props.value.scenes.map((scene, sceneIndex) =>
      sceneIndex === index ? { ...scene, [field]: nextValue } : scene
    );

    props.onChange({ ...props.value, scenes: nextScenes });
  }

  return (
    <section className="editor-surface editor-surface--stacked">
      <div className="editor-field">
        <label htmlFor="video-title">脚本标题</label>
        <input
          id="video-title"
          onChange={(event) =>
            props.onChange({ ...props.value, title: event.target.value })
          }
          readOnly={!props.isEditing}
          value={props.value.title}
        />
      </div>

      <div className="editor-section">
        <h3>分镜</h3>
        <div className="editor-grid">
          {props.value.scenes.map((scene, index) => (
            <article className="editor-scene-card" key={`${scene.shot}-${index}`}>
              <label className="editor-field">
                <span>镜头</span>
                <input
                  onChange={(event) =>
                    updateScene(index, "shot", event.target.value)
                  }
                  readOnly={!props.isEditing}
                  value={scene.shot}
                />
              </label>
              <label className="editor-field">
                <span>画面</span>
                <textarea
                  onChange={(event) =>
                    updateScene(index, "visual", event.target.value)
                  }
                  readOnly={!props.isEditing}
                  rows={3}
                  value={scene.visual}
                />
              </label>
              <label className="editor-field">
                <span>旁白</span>
                <textarea
                  onChange={(event) =>
                    updateScene(index, "voiceover", event.target.value)
                  }
                  readOnly={!props.isEditing}
                  rows={4}
                  value={scene.voiceover}
                />
              </label>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

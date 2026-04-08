import type { PersistedTwitterContent, TwitterMode } from "@/lib/types";

const modes: TwitterMode[] = ["auto", "single", "thread"];

export function TwitterEditor(props: {
  value: PersistedTwitterContent;
  isEditing: boolean;
  onChange: (value: PersistedTwitterContent) => void;
}) {
  function updateTweet(index: number, nextValue: string) {
    const nextTweets = [...props.value.tweets];
    nextTweets[index] = nextValue;
    props.onChange({ ...props.value, tweets: nextTweets });
  }

  return (
    <section className="editor-surface editor-surface--stacked">
      <div className="editor-inline-group">
        <span className="editor-inline-group__label">输出模式</span>
        <div className="editor-inline-group__controls">
          {modes.map((mode) => (
            <button
              className={`editor-chip${props.value.mode === mode ? " editor-chip--active" : ""}`}
              key={mode}
              onClick={() => props.onChange({ ...props.value, mode })}
              type="button"
            >
              {mode === "auto"
                ? "Auto"
                : mode === "single"
                  ? "Single"
                  : "Thread"}
            </button>
          ))}
        </div>
      </div>

      <div className="editor-section">
        <h3>Thread</h3>
        <div className="editor-grid">
          {props.value.tweets.map((tweet, index) => (
            <label className="editor-field" key={`${index + 1}-${tweet}`}>
              <span>Tweet {index + 1}</span>
              <textarea
                onChange={(event) => updateTweet(index, event.target.value)}
                readOnly={!props.isEditing}
                rows={4}
                value={tweet}
              />
            </label>
          ))}
        </div>
      </div>
    </section>
  );
}

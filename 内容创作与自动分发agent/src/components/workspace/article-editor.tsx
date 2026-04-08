import type { PersistedWechatContent } from "@/lib/types";

export function ArticleEditor(props: {
  value: PersistedWechatContent;
  isEditing: boolean;
  onChange: (value: PersistedWechatContent) => void;
}) {
  return (
    <section className="editor-surface">
      <div className="editor-field">
        <label htmlFor="article-title">文章标题</label>
        <input
          id="article-title"
          onChange={(event) =>
            props.onChange({ ...props.value, title: event.target.value })
          }
          readOnly={!props.isEditing}
          value={props.value.title}
        />
      </div>

      <div className="editor-field">
        <label htmlFor="article-summary">文章摘要</label>
        <textarea
          id="article-summary"
          onChange={(event) =>
            props.onChange({ ...props.value, summary: event.target.value })
          }
          readOnly={!props.isEditing}
          rows={4}
          value={props.value.summary}
        />
      </div>

      <div className="editor-field">
        <label htmlFor="article-body">正文</label>
        <textarea
          id="article-body"
          onChange={(event) =>
            props.onChange({ ...props.value, body: event.target.value })
          }
          readOnly={!props.isEditing}
          rows={18}
          value={props.value.body}
        />
      </div>
    </section>
  );
}

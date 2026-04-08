type ContentActionsProps = {
  canPublish: boolean;
  isEditing: boolean;
  isPublishing: boolean;
  statusText: string;
  onCopy: () => void;
  onPublish: () => void;
  onToggleEdit: () => void;
};

export function ContentActions(props: ContentActionsProps) {
  return (
    <div className="content-actions">
      <span className="content-actions__status">{props.statusText}</span>
      <div className="content-actions__buttons">
        <button onClick={props.onToggleEdit} type="button">
          {props.isEditing ? "完成编辑" : "编辑"}
        </button>
        <button onClick={props.onCopy} type="button">
          复制
        </button>
        {props.canPublish ? (
          <button
            className="content-actions__publish"
            disabled={props.isPublishing}
            onClick={props.onPublish}
            type="button"
          >
            {props.isPublishing ? "发布中..." : "发布"}
          </button>
        ) : null}
      </div>
    </div>
  );
}

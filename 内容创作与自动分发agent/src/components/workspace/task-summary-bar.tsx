import type { PlatformId } from "@/lib/types";

const platformLabels: Record<PlatformId, string> = {
  wechat: "公众号文章",
  xiaohongshu: "小红书笔记",
  twitter: "Twitter",
  videoScript: "视频脚本"
};

export function TaskSummaryBar(props: {
  title: string;
  prompt: string;
  selectedPlatforms: PlatformId[];
}) {
  return (
    <section className="task-summary">
      <div>
        <p className="task-summary__eyebrow">Current Task</p>
        <h1 className="task-summary__title">{props.title}</h1>
        <p className="task-summary__prompt">{props.prompt}</p>
      </div>
      <div className="task-summary__chips">
        {props.selectedPlatforms.map((platform) => (
          <span className="task-summary__chip" key={platform}>
            {platformLabels[platform]}
          </span>
        ))}
      </div>
    </section>
  );
}

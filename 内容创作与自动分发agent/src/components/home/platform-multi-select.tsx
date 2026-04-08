"use client";

import type { PlatformId } from "@/lib/types";

const platformOptions: Array<{
  id: PlatformId;
  label: string;
  tag: string;
  description: string;
}> = [
  {
    id: "wechat",
    label: "公众号文章",
    tag: "Long-form",
    description: "适合深度观点、完整结构和可编辑的长文内容。"
  },
  {
    id: "xiaohongshu",
    label: "小红书笔记",
    tag: "Lifestyle",
    description: "图片建议 + 爆点文案，适合种草和经验分享。"
  },
  {
    id: "twitter",
    label: "Twitter",
    tag: "Thread-ready",
    description: "自动判断单条或 Thread，并保留后续手动编辑空间。"
  },
  {
    id: "videoScript",
    label: "视频脚本",
    tag: "Storyboard",
    description: "分镜 + 旁白结构，适合短视频创作和口播规划。"
  }
];

type PlatformMultiSelectProps = {
  value: PlatformId[];
  onChange: (nextValue: PlatformId[]) => void;
};

export function PlatformMultiSelect({
  value,
  onChange
}: PlatformMultiSelectProps) {
  function toggle(platform: PlatformId) {
    if (value.includes(platform)) {
      onChange(value.filter((item) => item !== platform));
      return;
    }

    onChange([...value, platform]);
  }

  return (
    <fieldset className="platform-select">
      <legend className="platform-select__legend">生成平台</legend>
      <div className="platform-select__grid">
        {platformOptions.map((option) => {
          const checked = value.includes(option.id);

          return (
            <label className="platform-card" key={option.id}>
              <input
                aria-label={option.label}
                checked={checked}
                onChange={() => toggle(option.id)}
                type="checkbox"
              />
              <span className="platform-card__surface">
                <span className="platform-card__tag">{option.tag}</span>
                <span className="platform-card__title">{option.label}</span>
                <span className="platform-card__description">
                  {option.description}
                </span>
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

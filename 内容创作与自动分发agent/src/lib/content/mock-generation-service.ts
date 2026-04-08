import { efficiencyFixture } from "@/lib/content/sample-fixtures";
import { resolvePlatformRules } from "@/lib/platform/platform-rule-resolver";
import type {
  GeneratedTaskContentBundle,
  PlatformId,
  VideoScriptContentBody,
  WechatContentBody,
  XiaohongshuContentBody
} from "@/lib/types";

const FIXTURE_PROMPT = "写一篇关于如何提高工作效率的内容";

function includesAllPlatforms(platforms: PlatformId[]) {
  return (
    platforms.length === 4 &&
    platforms.includes("wechat") &&
    platforms.includes("xiaohongshu") &&
    platforms.includes("twitter") &&
    platforms.includes("videoScript")
  );
}

function buildFallbackWechat(prompt: string): WechatContentBody {
  return {
    title: "待完善的公众号选题",
    summary: "这是一个用于原型演示的公众号草稿摘要。",
    body: `${prompt}\n\n这是一篇为原型阶段准备的公众号草稿。后续我们会把这里替换成真实模型生成内容。`
  };
}

function buildFallbackXiaohongshu(prompt: string): XiaohongshuContentBody {
  return {
    title: "小红书笔记草稿",
    caption: `${prompt}\n\n这是一条用于演示流程的小红书笔记草稿，后续会接入更完整的内容生成。`,
    imageSuggestions: [
      "封面图建议",
      "场景图建议",
      "重点观点配图建议"
    ],
    hashtags: ["内容创作", "原型演示"]
  };
}

function buildFallbackVideoScript(prompt: string): VideoScriptContentBody {
  return {
    title: "视频脚本草稿",
    scenes: [
      {
        shot: "开场",
        visual: "人物进入画面并抛出主题问题",
        voiceover: `今天我们来聊聊：${prompt}`
      },
      {
        shot: "正文",
        visual: "用关键词卡片拆解核心观点",
        voiceover: "先用一个清晰框架，把重点方法讲明白。"
      },
      {
        shot: "结尾",
        visual: "总结卡片和行动号召",
        voiceover: "如果这个方向对你有帮助，可以继续完善成正式脚本。"
      }
    ]
  };
}

export async function generateTaskContentBundle(input: {
  prompt: string;
  platforms: PlatformId[];
  appliedSkillNamesByPlatform: Partial<Record<PlatformId, string[]>>;
}): Promise<GeneratedTaskContentBundle> {
  for (const platform of input.platforms) {
    resolvePlatformRules({
      platform,
      baseRules: [],
      appliedSkillSummaries: input.appliedSkillNamesByPlatform[platform] ?? []
    });
  }

  if (input.prompt.trim() === FIXTURE_PROMPT && includesAllPlatforms(input.platforms)) {
    return efficiencyFixture;
  }

  return {
    wechat: input.platforms.includes("wechat")
      ? buildFallbackWechat(input.prompt)
      : null,
    xiaohongshu: input.platforms.includes("xiaohongshu")
      ? buildFallbackXiaohongshu(input.prompt)
      : null,
    twitter: input.platforms.includes("twitter")
      ? {
          mode: input.prompt.length > 180 ? "thread" : "single",
          tweets:
            input.prompt.length > 180
              ? [
                  `1/3 ${input.prompt}`,
                  "2/3 这是一个用于演示的 Thread 草稿，我们会在后续接入真实生成。",
                  "3/3 你可以继续编辑、复制或发布这组内容。"
                ]
              : [input.prompt]
        }
      : null,
    videoScript: input.platforms.includes("videoScript")
      ? buildFallbackVideoScript(input.prompt)
      : null
  };
}

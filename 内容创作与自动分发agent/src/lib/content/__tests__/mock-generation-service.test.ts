// @vitest-environment node

import { describe, expect, it } from "vitest";

import { generateTaskContentBundle } from "@/lib/content/mock-generation-service";

describe("generateTaskContentBundle", () => {
  it("returns the fixed efficiency fixture when all platforms are selected", async () => {
    const bundle = await generateTaskContentBundle({
      prompt: "写一篇关于如何提高工作效率的内容",
      platforms: ["wechat", "xiaohongshu", "twitter", "videoScript"],
      appliedSkillNamesByPlatform: {}
    });

    expect(bundle.wechat?.title).toBe("高效工作的 5 个底层逻辑");
    expect(bundle.xiaohongshu?.imageSuggestions).toHaveLength(9);
    expect(bundle.twitter?.tweets).toHaveLength(10);
    expect(bundle.videoScript?.scenes).toHaveLength(3);
  });
});

// @vitest-environment node

import { describe, expect, it, vi } from "vitest";

import { createSiliconFlowClient } from "@/lib/siliconflow-client";

describe("siliconflow client", () => {
  it("sends an OpenAI-compatible chat/completions request", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: "{\"ok\":true}" } }]
      })
    });

    const client = createSiliconFlowClient({
      apiKey: "test-key",
      baseUrl: "https://api.siliconflow.cn/v1",
      model: "zai-org/GLM-5",
      fetchImpl: fetchMock as typeof fetch
    });

    await client.completeJson({ system: "sys", user: "usr" });

    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.siliconflow.cn/v1/chat/completions",
      expect.objectContaining({
        method: "POST",
        headers: expect.objectContaining({
          Authorization: "Bearer test-key",
          "Content-Type": "application/json"
        })
      })
    );
  });
});

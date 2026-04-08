"use client";

import { useDeferredValue, useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import { GenerationProgress } from "@/components/home/generation-progress";
import { PlatformMultiSelect } from "@/components/home/platform-multi-select";
import type { PlatformId } from "@/lib/types";

export function CreateTaskHero() {
  const router = useRouter();
  const [prompt, setPrompt] = useState("");
  const deferredPrompt = useDeferredValue(prompt);
  const [platforms, setPlatforms] = useState<PlatformId[]>([]);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, startTransition] = useTransition();

  const promptLength = deferredPrompt.trim().length;

  async function handleSubmit() {
    if (!prompt.trim()) {
      setFormError("先写下你的创作需求，我们再开始生成。");
      return;
    }

    if (platforms.length === 0) {
      setFormError("至少选择一个要生成的平台。");
      return;
    }

    setFormError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          prompt,
          platforms
        })
      });

      if (!response.ok) {
        throw new Error("Failed to create task");
      }

      const task = (await response.json()) as { id: string };

      startTransition(() => {
        router.push(`/workspace/${task.id}`);
      });
    } catch {
      setFormError("生成任务时出现问题，请稍后再试。");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="hero-shell">
      <div className="hero-panel">
        <div className="hero-panel__header">
          <div>
            <h2 className="hero-panel__title">把需求丢进来，剩下交给系统</h2>
            <p className="hero-panel__hint">
              用一段自然语言描述你的选题、目标、受众和语气，我们会按平台差异生成对应内容。
            </p>
          </div>
          <span className="hero-panel__badge">Local-first prototype</span>
        </div>

        <div className="prompt-field">
          <label className="prompt-field__label" htmlFor="creation-prompt">
            创作需求
          </label>
          <textarea
            aria-label="创作需求"
            className="prompt-field__textarea"
            id="creation-prompt"
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="例如：写一篇关于如何提高工作效率的内容，面向 25-35 岁知识工作者，风格清晰、有方法论、有案例。"
            value={prompt}
          />
          <div className="prompt-field__meta">
            <span>建议写清楚主题、受众、目标和风格。</span>
            <span>{promptLength} chars</span>
          </div>
        </div>

        <PlatformMultiSelect onChange={setPlatforms} value={platforms} />

        <div className="hero-panel__footer">
          {formError ? (
            <p className="hero-panel__error" role="alert">
              {formError}
            </p>
          ) : (
            <span className="hero-panel__hint">
              当前支持模拟生成与模拟发布，后续再接真实模型与平台。
            </span>
          )}

          <div className="hero-panel__actions">
            <GenerationProgress visible={isSubmitting} />
            <button
              className="hero-submit"
              disabled={isSubmitting}
              onClick={handleSubmit}
              type="button"
            >
              生成多平台内容
            </button>
          </div>
        </div>
      </div>

      <aside className="hero-sidecard">
        <p className="hero-sidecard__title">This Flow Includes</p>
        <div className="hero-sidecard__list">
          <article className="hero-sidecard__item">
            <strong>多平台分发</strong>
            <p>一次输入后，自动拆成公众号长文、小红书笔记、Twitter 和视频脚本。</p>
          </article>
          <article className="hero-sidecard__item">
            <strong>平台差异化</strong>
            <p>Twitter 自动判断单条或 Thread，小红书保留 9 张图片建议位。</p>
          </article>
          <article className="hero-sidecard__item">
            <strong>Skills 可插拔</strong>
            <p>后续你上传的 zip 技能包和 GitHub skills，会在生成链路里参与规则约束。</p>
          </article>
        </div>
      </aside>
    </section>
  );
}

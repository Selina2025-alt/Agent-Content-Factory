import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SettingsTab } from "@/components/workbench/settings-tab";
import { monitorCategories } from "@/lib/mock-data";

describe("SettingsTab", () => {
  it("surfaces quality feedback and add-entry actions", async () => {
    const user = userEvent.setup();
    const onAddKeyword = vi.fn();
    const onAddAccount = vi.fn();

    render(
      <SettingsTab
        activeCategory={monitorCategories[0]}
        onAddKeyword={onAddKeyword}
        onAddAccount={onAddAccount}
      />
    );

    expect(
      screen.getByRole("heading", { name: "平台配置" })
    ).toBeInTheDocument();
    expect(screen.getAllByText(/推荐继续放大/)).toHaveLength(2);
    expect(screen.getByText(/稳定采样/)).toBeInTheDocument();
    expect(screen.getByText(/覆盖稳定/)).toBeInTheDocument();
    expect(screen.getByText(/偏窄/)).toBeInTheDocument();
    expect(screen.getByText(/活跃且高贡献/)).toBeInTheDocument();
    expect(screen.getByText("规则反馈")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "添加关键词" }));
    await user.click(screen.getByRole("button", { name: "添加账号" }));

    expect(onAddKeyword).toHaveBeenCalledTimes(1);
    expect(onAddAccount).toHaveBeenCalledTimes(1);
  });
});

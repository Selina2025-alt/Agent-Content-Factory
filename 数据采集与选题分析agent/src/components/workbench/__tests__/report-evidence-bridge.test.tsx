import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import MonitoringWorkbench from "@/components/workbench/monitoring-workbench";
import { monitorCategories } from "@/lib/mock-data";
import { getLinkedContentIds } from "@/lib/workbench-selectors";

describe("report evidence bridge", () => {
  it("switches from a report topic to the linked evidence view", async () => {
    const user = userEvent.setup();
    const category = monitorCategories[0];
    const report = category.reports[0];
    const topic = report.topics[0];
    const linkedContentId = getLinkedContentIds(topic)[0];
    const linkedContentIds = getLinkedContentIds(topic);
    const linkedContent = category.content.find(
      (content) => content.id === linkedContentId
    );

    expect(linkedContent).toBeDefined();

    render(<MonitoringWorkbench />);

    await user.click(
      screen.getByRole("tab", { name: "选题分析与报告" })
    );

    expect(
      screen.getByRole("heading", { name: `${category.name} 报告` })
    ).toBeInTheDocument();
    const reportRegion = screen.getByRole("region", {
      name: `${category.name} 报告`
    });
    expect(screen.getByText(report.hotSummary)).toBeInTheDocument();
    expect(screen.getByText(report.focusSummary)).toBeInTheDocument();

    const supportButton = within(reportRegion).getByRole("button", {
      name: `查看支撑内容：${topic.title}`
    });

    await user.click(supportButton);

    expect(screen.getByRole("tab", { name: "内容", selected: true })).toBeInTheDocument();
    expect(
      screen.getByText(new RegExp(`已聚焦 ${linkedContentIds.length} 条支撑内容`))
    ).toBeInTheDocument();
    expect(screen.getByText(linkedContent!.title)).toBeInTheDocument();
  });
});

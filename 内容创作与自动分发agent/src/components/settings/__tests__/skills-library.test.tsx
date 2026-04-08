import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import SettingsPage from "@/app/settings/page";

describe("SettingsPage", () => {
  it("renders platform bindings and skills library navigation", () => {
    render(<SettingsPage />);

    expect(
      screen.getByRole("button", { name: "Skills Library" })
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Skills Library" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "公众号文章" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Twitter" })).toBeInTheDocument();
  });
});

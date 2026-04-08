import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import HomePage from "@/app/page";

describe("HomePage", () => {
  it("renders the creation prompt and platform options", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", { name: "What should we create today?" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("公众号文章")).toBeInTheDocument();
    expect(screen.getByLabelText("小红书笔记")).toBeInTheDocument();
    expect(screen.getByLabelText("Twitter")).toBeInTheDocument();
    expect(screen.getByLabelText("视频脚本")).toBeInTheDocument();
  });
});

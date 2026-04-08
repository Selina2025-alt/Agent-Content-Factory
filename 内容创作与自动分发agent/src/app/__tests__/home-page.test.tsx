import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { pushMock } = vi.hoisted(() => ({
  pushMock: vi.fn()
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock
  })
}));

import HomePage from "@/app/page";

describe("HomePage", () => {
  beforeEach(() => {
    pushMock.mockReset();
    vi.restoreAllMocks();
  });

  it("renders the creation prompt and platform options", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", { name: "What should we create today?" })
    ).toBeInTheDocument();
    expect(screen.getByLabelText("创作需求")).toBeInTheDocument();
    expect(screen.getByLabelText("公众号文章")).toBeInTheDocument();
    expect(screen.getByLabelText("小红书笔记")).toBeInTheDocument();
    expect(screen.getByLabelText("Twitter")).toBeInTheDocument();
    expect(screen.getByLabelText("视频脚本")).toBeInTheDocument();
  });

  it("submits the request when at least one platform is selected", async () => {
    const user = userEvent.setup();

    let resolveResponse: ((value: Response) => void) | undefined;
    const fetchMock = vi.fn(
      () =>
        new Promise<Response>((resolve) => {
          resolveResponse = resolve;
        })
    );

    vi.stubGlobal("fetch", fetchMock);

    render(<HomePage />);

    await user.type(
      screen.getByLabelText("创作需求"),
      "写一篇关于如何提高工作效率的内容"
    );
    await user.click(screen.getByLabelText("公众号文章"));
    await user.click(screen.getByRole("button", { name: "生成多平台内容" }));

    expect(await screen.findByText("Generating content bundle...")).toBeInTheDocument();

    resolveResponse?.(
      new Response(JSON.stringify({ id: "task-123" }), {
        status: 201,
        headers: {
          "Content-Type": "application/json"
        }
      })
    );

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/workspace/task-123");
    });
  });
});

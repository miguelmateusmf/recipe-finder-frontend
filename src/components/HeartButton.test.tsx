import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HeartButton } from "./HeartButton";

describe("HeartButton (integration)", () => {
  it("fires onToggle when clicked and reflects active state", async () => {
    const onToggle = vi.fn();
    render(
      <HeartButton
        active={false}
        onClick={onToggle}
        ariaLabel="favorite chicken"
      />,
    );
    const user = userEvent.setup();

    const btn = screen.getByLabelText("favorite chicken");
    expect(btn).toHaveAttribute("aria-pressed", "false");

    await user.click(btn);
    expect(onToggle).toHaveBeenCalledOnce();
  });

  it("shows pressed state when active", () => {
    render(
      <HeartButton
        active={true}
        onClick={() => {}}
        ariaLabel="favorite apple"
      />,
    );
    expect(screen.getByLabelText("favorite apple")).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });
});

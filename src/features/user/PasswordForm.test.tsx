import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { PasswordForm } from "./PasswordForm";
import { LanguageProvider } from "../../context/languageProvider";

// Mock the mutation hook
const mutate = vi.fn();
vi.mock("./useUserMutations", () => ({
  useChangePassword: () => ({
    mutate,
    isPending: false,
    isSuccess: false,
    isError: false,
    reset: () => {},
  }),
}));

describe("PasswordForm (integration)", () => {
  beforeEach(() => mutate.mockClear());

  it("shows a mismatch error and disables submit when passwords differ", async () => {
    render(
      <LanguageProvider>
        <PasswordForm />
      </LanguageProvider>,
    );
    const user = userEvent.setup({ pointerEventsCheck: 0 });

    await user.type(screen.getByLabelText("Current password"), "oldpass123");
    await user.type(screen.getByLabelText("New password"), "newpass123");
    await user.type(screen.getByLabelText("Confirm new password"), "different");

    expect(screen.getByText(/do not match/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /change password/i }),
    ).toBeDisabled();
    expect(mutate).not.toHaveBeenCalled();
  });

  it("submits when passwords match", async () => {
    render(
      <LanguageProvider>
        {" "}
        <PasswordForm />
      </LanguageProvider>,
    );
    const user = userEvent.setup({ pointerEventsCheck: 0 });

    await user.type(screen.getByLabelText("Current password"), "oldpass123");
    await user.type(screen.getByLabelText("New password"), "newpass123");
    await user.type(
      screen.getByLabelText("Confirm new password"),
      "newpass123",
    );
    await user.click(screen.getByRole("button", { name: "Change password" }));

    expect(mutate).toHaveBeenCalledOnce();
    expect(mutate).toHaveBeenCalledWith(
      { currentPassword: "oldpass123", newPassword: "newpass123" },
      expect.anything(),
    );
  });
});

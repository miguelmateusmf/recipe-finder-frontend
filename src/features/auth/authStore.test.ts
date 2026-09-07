import { describe, it, expect, beforeEach } from "vitest";
import { useAuthStore } from "./authStore";

describe("authStore", () => {
  beforeEach(() => {
    useAuthStore.getState().clearToken();
  });

  it("starts with no token", () => {
    expect(useAuthStore.getState().token).toBeNull();
  });

  it("sets a token", () => {
    useAuthStore.getState().setToken("abc123");
    expect(useAuthStore.getState().token).toBe("abc123");
  });

  it("clears the token", () => {
    useAuthStore.getState().setToken("abc123");
    useAuthStore.getState().clearToken();
    expect(useAuthStore.getState().token).toBeNull();
  });
});

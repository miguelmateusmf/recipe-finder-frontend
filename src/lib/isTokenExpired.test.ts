import { describe, it, expect } from "vitest";
import { isTokenExpired } from "./api";

function makeToken(expSeconds: number): string {
  const payload = { exp: expSeconds };
  const base64 = btoa(JSON.stringify(payload));
  return `header.${base64}.signature`;
}

describe("isTokenExpired", () => {
  it("returns true for null token", () => {
    expect(isTokenExpired(null)).toBe(true);
  });

  it("returns true for a malformed token", () => {
    expect(isTokenExpired("not-a-jwt")).toBe(true);
  });

  it("returns true for an expired token", () => {
    const past = Math.floor(Date.now() / 1000) - 3600;
    expect(isTokenExpired(makeToken(past))).toBe(true);
  });

  it("returns false for a valid (future) token", () => {
    const future = Math.floor(Date.now() / 1000) + 3600;
    expect(isTokenExpired(makeToken(future))).toBe(false);
  });
});

import { afterEach, describe, expect, it, vi } from "vitest";
import { apiFetch } from "./api";

describe("apiFetch", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("throws the server error message when JSON error details are returned", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 502,
      statusText: "Bad Gateway",
      headers: new Headers({ "Content-Type": "application/json" }),
      json: async () => ({ error: "Razorpay authentication failed" }),
    } as Response);

    await expect(apiFetch("/orders/create")).rejects.toThrow("Razorpay authentication failed");
  });
});

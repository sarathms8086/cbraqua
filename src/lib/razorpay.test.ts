import { describe, expect, it } from "vitest";
import { getRazorpayKeyId, isPlaceholderRazorpayKey } from "./razorpay";

describe("razorpay config", () => {
  it("rejects placeholder key ids", () => {
    expect(isPlaceholderRazorpayKey("rzp_test_placeholder")).toBe(true);
    expect(() => getRazorpayKeyId({ VITE_RAZORPAY_KEY_ID: "rzp_test_placeholder" })).toThrow(
      "Razorpay key is not configured",
    );
  });

  it("accepts real Razorpay key ids", () => {
    expect(getRazorpayKeyId({ VITE_RAZORPAY_KEY_ID: "rzp_live_12345678901234" })).toBe(
      "rzp_live_12345678901234",
    );
  });
});

import { describe, expect, it } from "vitest";
import { calculateDiscount, normalizeDiscountPercent, normalizeGstPercent } from "./discount";

describe("discount helpers", () => {
  it("clamps admin discount percentages to a safe range", () => {
    expect(normalizeDiscountPercent(-10)).toBe(0);
    expect(normalizeDiscountPercent("12.4")).toBe(12);
    expect(normalizeDiscountPercent(95)).toBe(90);
    expect(normalizeDiscountPercent("not-a-number")).toBe(0);
  });

  it("clamps admin GST percentages to a safe range", () => {
    expect(normalizeGstPercent(-5)).toBe(0);
    expect(normalizeGstPercent("18")).toBe(18);
    expect(normalizeGstPercent(150)).toBe(100);
    expect(normalizeGstPercent("not-a-number")).toBe(0);
  });

  it("calculates the discounted checkout total", () => {
    expect(calculateDiscount(1999, 10)).toEqual({
      discountPercent: 10,
      discountAmount: 200,
      gstPercent: 0,
      gstAmount: 0,
      total: 1799,
    });
  });

  it("applies GST on top of the discounted total", () => {
    expect(calculateDiscount(1999, 10, 18)).toEqual({
      discountPercent: 10,
      discountAmount: 200,
      gstPercent: 18,
      gstAmount: 324,
      total: 2123,
    });
  });
});

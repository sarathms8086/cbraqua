import { describe, expect, it } from "vitest";
import { formatPrice, formatPriceInputValue, parsePriceInput } from "./price";

describe("price helpers", () => {
  it("shows a blank admin input for zero so the placeholder zero is not stuck", () => {
    expect(formatPriceInputValue(0)).toBe("");
  });

  it("parses blank admin price as zero for saves", () => {
    expect(parsePriceInput("")).toBe(0);
  });

  it("formats storefront prices in rupees", () => {
    expect(formatPrice(1999)).toBe("₹1,999");
  });
});

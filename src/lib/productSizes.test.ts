import { describe, expect, it } from "vitest";
import { formatSizesInput, parseSizesInput } from "./productSizes";

describe("product size input", () => {
  it("parses comma-separated admin input only when saving", () => {
    expect(parseSizesInput("XS, S, M,")).toEqual(["XS", "S", "M"]);
  });

  it("formats existing product sizes for editing", () => {
    expect(formatSizesInput(["XS", "S", "M"])).toBe("XS, S, M");
  });
});

import { describe, expect, it } from "vitest";
import {
  getProductMainImageClassName,
  getProductMainImageFrameClassName,
} from "./productImageLayout";

describe("product image layout", () => {
  it("uses contain sizing so full product photos are visible", () => {
    const className = getProductMainImageClassName();

    expect(className).toContain("object-contain");
    expect(className).toContain("h-full");
    expect(className).toContain("absolute");
    expect(className).toContain("inset-0");
    expect(className).toContain("p-2");
    expect(className).not.toContain("object-cover");
  });

  it("uses a consistent product photo frame", () => {
    const className = getProductMainImageFrameClassName();

    expect(className).toContain("relative");
    expect(className).toContain("aspect-[4/5]");
    expect(className).toContain("overflow-hidden");
    expect(className).toContain("rounded-[10px]");
    expect(className).toContain("border");
    expect(className).toContain("shadow-[0_18px_50px_rgba(0,0,0,0.08)]");
    expect(className).toContain("bg-[#fbfaf7]");
  });
});

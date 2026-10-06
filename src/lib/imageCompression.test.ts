import { describe, expect, it } from "vitest";
import { getContainDimensions, shouldCompressImage } from "./imageCompression";

describe("image compression helpers", () => {
  it("fits large images within the maximum dimensions", () => {
    expect(getContainDimensions(3000, 2000)).toEqual({
      width: 2400,
      height: 1600,
    });
  });

  it("does not upscale small images", () => {
    expect(getContainDimensions(900, 600, 1200)).toEqual({
      width: 900,
      height: 600,
    });
  });

  it("compresses only supported website image formats", () => {
    expect(shouldCompressImage(new File(["x"], "photo.png", { type: "image/png" }))).toBe(true);
    expect(shouldCompressImage(new File(["x"], "photo.gif", { type: "image/gif" }))).toBe(false);
  });
});

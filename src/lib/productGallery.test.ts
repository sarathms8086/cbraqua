import { describe, expect, it } from "vitest";
import { getProductGalleryImages, normalizeImageUrl } from "./productGallery";

describe("product gallery images", () => {
  it("shows the primary image followed by additional gallery images", () => {
    expect(
      getProductGalleryImages({
        name: "Brown",
        hex: "#654321",
        image: "/uploads/front.jpg",
        images: ["/uploads/back.jpg", "/uploads/detail.jpg"],
      }),
    ).toEqual(["/uploads/front.jpg", "/uploads/back.jpg", "/uploads/detail.jpg"]);
  });

  it("removes empty and duplicate gallery entries", () => {
    expect(
      getProductGalleryImages({
        name: "Brown",
        hex: "#654321",
        image: "/uploads/front.jpg",
        images: ["", "/uploads/front.jpg", "/uploads/back.jpg"],
      }),
    ).toEqual(["/uploads/front.jpg", "/uploads/back.jpg"]);
  });

  it("converts absolute upload urls to site-relative urls", () => {
    expect(
      normalizeImageUrl(
        "http://www.danywens.com/uploads/front.jpg",
      ),
    ).toBe("/uploads/front.jpg");
  });
});

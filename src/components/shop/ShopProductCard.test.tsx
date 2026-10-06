import { fireEvent, render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import type { Product } from "@/data/products";
import ShopProductCard from "./ShopProductCard";

describe("ShopProductCard", () => {
  it("normalizes the displayed image when switching colours", () => {
    const product: Product = {
      id: "test-product",
      name: "Test Product",
      slug: "test-product",
      price: 100,
      category: "t-shirts",
      sizes: ["M"],
      description: "Test product",
      details: [],
      colors: [
        {
          name: "Black",
          hex: "#000000",
          image: "http://www.danywens.com/uploads/black.jpg",
        },
        {
          name: "Brown",
          hex: "#654321",
          image: "http://www.danywens.com/uploads/brown.jpg",
        },
      ],
    };

    render(
      <BrowserRouter future={{ v7_relativeSplatPath: true, v7_startTransition: true }}>
        <ShopProductCard product={product} />
      </BrowserRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Brown" }));

    expect(screen.getByRole("img", { name: "Test Product in Brown" })).toHaveAttribute(
      "src",
      "/uploads/brown.jpg",
    );
  });
});

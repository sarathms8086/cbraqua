import hoodieBlack from "@/assets/dany-wens/product-hoodie-black.jpg";
import hoodieBrown from "@/assets/dany-wens/product-hoodie-brown.jpg";
import teeCream from "@/assets/dany-wens/product-tee-cream.jpg";
import teeBlack from "@/assets/dany-wens/product-tee-black.jpg";
import cargoOlive from "@/assets/dany-wens/product-cargo-olive.jpg";
import crewGrey from "@/assets/dany-wens/product-crew-grey.jpg";
import crewWhite from "@/assets/dany-wens/product-crew-white.jpg";
import joggerBlack from "@/assets/dany-wens/product-jogger-black.jpg";
import jacketNavy from "@/assets/dany-wens/product-jacket-navy.jpg";
import tankWhite from "@/assets/dany-wens/product-tank-white.jpg";
import shortsBeige from "@/assets/dany-wens/product-shorts-beige.jpg";
import capBlack from "@/assets/dany-wens/product-cap-black.jpg";
import crewNeck1 from "@/assets/dany-wens/crew-neck-1.jpg";
import crewNeck2 from "@/assets/dany-wens/crew-neck-2.jpg";
import crewNeck3 from "@/assets/dany-wens/crew-neck-3.jpg";
import henleyHalf1 from "@/assets/dany-wens/henley-half-1.jpg";
import henleyHalf2 from "@/assets/dany-wens/henley-half-2.jpg";
import henleyHalf3 from "@/assets/dany-wens/henley-half-3.jpg";
import henleyFull1 from "@/assets/dany-wens/henley-full-1.jpg";
import henleyFull2 from "@/assets/dany-wens/henley-full-2.jpg";
import henleyFull3 from "@/assets/dany-wens/henley-full-3.jpg";
import freeSize1 from "@/assets/dany-wens/free-size-1.jpg";
import freeSize2 from "@/assets/dany-wens/free-size-2.jpg";
import freeSize3 from "@/assets/dany-wens/free-size-3.jpg";

export interface ProductColor {
  name: string;
  hex: string;
  image: string;
  images?: string[];
  soldOut?: boolean;
  soldOutSizes?: string[];
  sizeStock?: Record<string, number>;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  category: string;
  productType?: string;
  colors: ProductColor[];
  sizes: string[];
  description: string;
  details: { label: string; value: string }[];
  isNew?: boolean;
  soldOut?: boolean;
  soldOutSizes?: string[];
  collectionId?: string;
}

export const products: Product[] = [
  {
    id: "dw-1",
    name: "Classic Crew Neck",
    slug: "classic-crew-neck",
    price: 85,
    category: "t-shirts",
    colors: [
      { name: "White", hex: "#ffffff", image: crewNeck1 },
      { name: "Black", hex: "#1a1a1a", image: crewNeck2 },
      { name: "Grey", hex: "#9e9e9e", image: crewNeck3 },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Premium cotton crew neck t-shirt. Breathable fabric with a structured fit.",
    details: [
      { label: "Composition", value: "100% Pima Cotton" },
      { label: "Weight", value: "240gsm" },
      { label: "Fit", value: "Regular" },
      { label: "Care", value: "Machine wash cold" },
    ],
    isNew: true,
  },
  {
    id: "dw-2",
    name: "Henley Half Sleeve",
    slug: "henley-half-sleeve",
    price: 95,
    category: "t-shirts",
    colors: [
      { name: "Navy", hex: "#1B2A4A", image: henleyHalf1 },
      { name: "Olive", hex: "#556B2F", image: henleyHalf2 },
      { name: "Charcoal", hex: "#333333", image: henleyHalf3 },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Versatile henley with a three-button placket. Perfect for layering.",
    details: [
      { label: "Composition", value: "95% Cotton, 5% Elastane" },
      { label: "Fit", value: "Slim Fit" },
      { label: "Care", value: "Machine wash cold" },
    ],
    isNew: true,
  },
  {
    id: "dw-3",
    name: "Henley Full Sleeve",
    slug: "henley-full-sleeve",
    price: 110,
    category: "t-shirts",
    colors: [
      { name: "Burgundy", hex: "#800020", image: henleyFull1 },
      { name: "Sand", hex: "#C2B280", image: henleyFull2 },
      { name: "Forest", hex: "#228B22", image: henleyFull3 },
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    description: "Full sleeve henley for cooler days. Soft textured fabric.",
    details: [
      { label: "Composition", value: "100% Organic Cotton" },
      { label: "Fit", value: "Tailored" },
      { label: "Care", value: "Machine wash cold" },
    ],
    isNew: true,
  },
  {
    id: "dw-4",
    name: "Free Size Oversized Tee",
    slug: "free-size-oversized-tee",
    price: 75,
    category: "t-shirts",
    colors: [
      { name: "Off White", hex: "#FAF9F6", image: freeSize1 },
      { name: "Slate", hex: "#708090", image: freeSize2 },
      { name: "Mocha", hex: "#A38068", image: freeSize3 },
    ],
    sizes: ["One Size"],
    description: "Ultra-oversized fit designed for maximum comfort. One size fits most.",
    details: [
      { label: "Composition", value: "100% Heavyweight Cotton" },
      { label: "Weight", value: "300gsm" },
      { label: "Fit", value: "Oversized" },
      { label: "Care", value: "Machine wash cold" },
    ],
    isNew: true,
  },
  {
    id: "1",
    name: "Heavyweight Hoodie",
    slug: "heavyweight-hoodie",
    price: 145,
    category: "hoodies",
    colors: [
      { name: "Black", hex: "#1a1a1a", image: hoodieBlack },
      { name: "Brown", hex: "#8B4513", image: hoodieBrown },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "450gsm heavyweight French terry. Oversized fit with dropped shoulders and kangaroo pocket.",
    details: [
      { label: "Composition", value: "100% Cotton" },
      { label: "Weight", value: "450gsm" },
      { label: "Fit", value: "Oversized" },
      { label: "Care", value: "Machine wash cold" },
    ],
    isNew: true,
  },
  {
    id: "2",
    name: "Oversized T-Shirt",
    slug: "oversized-tshirt",
    price: 65,
    category: "t-shirts",
    colors: [
      { name: "Cream", hex: "#F5F5DC", image: teeCream },
      { name: "Black", hex: "#1a1a1a", image: teeBlack },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "270gsm heavyweight cotton. Boxy oversized fit with reinforced collar.",
    details: [
      { label: "Composition", value: "100% Cotton" },
      { label: "Weight", value: "270gsm" },
      { label: "Fit", value: "Oversized" },
      { label: "Care", value: "Machine wash cold" },
    ],
    isNew: true,
  },
  {
    id: "3",
    name: "Cargo Pant",
    slug: "cargo-pant",
    price: 125,
    category: "bottoms",
    colors: [
      { name: "Olive", hex: "#556B2F", image: cargoOlive },
    ],
    sizes: ["28", "30", "32", "34", "36", "38"],
    description: "Relaxed fit cargo pant with six-pocket design. Durable cotton twill.",
    details: [
      { label: "Composition", value: "100% Cotton Twill" },
      { label: "Weight", value: "320gsm" },
      { label: "Fit", value: "Relaxed" },
      { label: "Care", value: "Machine wash cold" },
    ],
  },
  {
    id: "4",
    name: "Crewneck Sweatshirt",
    slug: "crewneck-sweatshirt",
    price: 120,
    category: "sweatshirts",
    colors: [
      { name: "Grey Marl", hex: "#9e9e9e", image: crewGrey },
      { name: "White", hex: "#ffffff", image: crewWhite },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "400gsm heavyweight French terry crewneck. Regular fit with ribbed cuffs.",
    details: [
      { label: "Composition", value: "80% Cotton, 20% Polyester" },
      { label: "Weight", value: "400gsm" },
      { label: "Fit", value: "Regular" },
      { label: "Care", value: "Machine wash cold" },
    ],
  },
  {
    id: "5",
    name: "Jogger Pant",
    slug: "jogger-pant",
    price: 110,
    category: "bottoms",
    colors: [
      { name: "Black", hex: "#1a1a1a", image: joggerBlack },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "380gsm heavyweight fleece jogger with elastic cuff and drawcord waist.",
    details: [
      { label: "Composition", value: "80% Cotton, 20% Polyester" },
      { label: "Weight", value: "380gsm" },
      { label: "Fit", value: "Regular tapered" },
      { label: "Care", value: "Machine wash cold" },
    ],
  },
  {
    id: "6",
    name: "Track Jacket",
    slug: "track-jacket",
    price: 155,
    category: "jackets",
    colors: [
      { name: "Navy", hex: "#1B2A4A", image: jacketNavy },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "Full-zip track jacket with stand collar and side pockets. Bonded tech fabric.",
    details: [
      { label: "Composition", value: "92% Polyester, 8% Elastane" },
      { label: "Weight", value: "280gsm" },
      { label: "Fit", value: "Regular" },
      { label: "Care", value: "Machine wash cold" },
    ],
    isNew: true,
  },
  {
    id: "7",
    name: "Tank Top",
    slug: "tank-top",
    price: 45,
    category: "t-shirts",
    colors: [
      { name: "White", hex: "#ffffff", image: tankWhite },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "220gsm cotton jersey tank. Dropped armhole, elongated fit.",
    details: [
      { label: "Composition", value: "100% Cotton" },
      { label: "Weight", value: "220gsm" },
      { label: "Fit", value: "Oversized" },
      { label: "Care", value: "Machine wash cold" },
    ],
  },
  {
    id: "8",
    name: "Cargo Short",
    slug: "cargo-short",
    price: 95,
    category: "bottoms",
    colors: [
      { name: "Beige", hex: "#D2B48C", image: shortsBeige },
    ],
    sizes: ["28", "30", "32", "34", "36", "38"],
    description: "Relaxed fit cargo short above the knee. Durable cotton twill.",
    details: [
      { label: "Composition", value: "100% Cotton Twill" },
      { label: "Weight", value: "300gsm" },
      { label: "Fit", value: "Relaxed" },
      { label: "Care", value: "Machine wash cold" },
    ],
    isNew: true,
  },
  {
    id: "9",
    name: "Fitted Cap",
    slug: "fitted-cap",
    price: 40,
    category: "accessories",
    colors: [
      { name: "Black", hex: "#1a1a1a", image: capBlack },
    ],
    sizes: ["S/M", "L/XL"],
    description: "Structured six-panel cap with embroidered logo. Adjustable strap.",
    details: [
      { label: "Composition", value: "100% Cotton Twill" },
      { label: "Fit", value: "Adjustable" },
      { label: "Care", value: "Spot clean only" },
    ],
  },
  {
    id: "10",
    name: "Essential Hoodie",
    slug: "essential-hoodie",
    price: 130,
    category: "hoodies",
    colors: [
      { name: "Brown", hex: "#8B4513", image: hoodieBrown },
      { name: "Black", hex: "#1a1a1a", image: hoodieBlack },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "350gsm midweight French terry hoodie. Relaxed fit with split kangaroo pocket.",
    details: [
      { label: "Composition", value: "100% Cotton" },
      { label: "Weight", value: "350gsm" },
      { label: "Fit", value: "Relaxed" },
      { label: "Care", value: "Machine wash cold" },
    ],
  },
  {
    id: "11",
    name: "Relaxed Tee",
    slug: "relaxed-tee",
    price: 55,
    category: "t-shirts",
    colors: [
      { name: "Black", hex: "#1a1a1a", image: teeBlack },
      { name: "Cream", hex: "#F5F5DC", image: teeCream },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "240gsm cotton jersey tee. Relaxed fit with curved hem.",
    details: [
      { label: "Composition", value: "100% Cotton" },
      { label: "Weight", value: "240gsm" },
      { label: "Fit", value: "Relaxed" },
      { label: "Care", value: "Machine wash cold" },
    ],
  },
  {
    id: "12",
    name: "Essential Crewneck",
    slug: "essential-crewneck",
    price: 105,
    category: "sweatshirts",
    colors: [
      { name: "White", hex: "#ffffff", image: crewWhite },
      { name: "Grey Marl", hex: "#9e9e9e", image: crewGrey },
    ],
    sizes: ["XS", "S", "M", "L", "XL", "XXL"],
    description: "350gsm midweight crewneck. Classic fit with clean neckline.",
    details: [
      { label: "Composition", value: "80% Cotton, 20% Polyester" },
      { label: "Weight", value: "350gsm" },
      { label: "Fit", value: "Classic" },
      { label: "Care", value: "Machine wash cold" },
    ],
    soldOut: true,
  },
];

export const categories = [
  { label: "All", value: "all" },
  { label: "Hoodies", value: "hoodies" },
  { label: "T-Shirts", value: "t-shirts" },
  { label: "Sweatshirts", value: "sweatshirts" },
  { label: "Bottoms", value: "bottoms" },
  { label: "Jackets", value: "jackets" },
  { label: "Accessories", value: "accessories" },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

import collectionSS26 from "@/assets/dany-wens/collection-ss26.jpg";
import collectionAW25 from "@/assets/dany-wens/collection-aw25.jpg";
import mosaic1 from "@/assets/dany-wens/mosaic-1.jpg";
import mosaic4 from "@/assets/dany-wens/mosaic-4.jpg";
import dwCollection from "@/assets/dany-wens/crew-neck-1.jpg";

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  productCount: number;
  visible?: boolean;
}

export const collections: Collection[] = [
  {
    id: "dw-collection",
    name: "DANY WENS 2026",
    slug: "dany-wens-2026",
    description: "The definitive 2026 collection. Premium staples redefined for the modern wardrobe.",
    image: dwCollection,
    productCount: 4,
  },
  {
    id: "1",
    name: "SS26 Collection",
    slug: "ss26",
    description: "Summer essentials designed with intention. Lightweight fabrics meet bold silhouettes for the warmer months ahead.",
    image: collectionSS26,
    productCount: 24,
  },
  {
    id: "2",
    name: "AW25 Collection",
    slug: "aw25",
    description: "Heavyweight layers and structured outerwear. Built for the cold, designed for the streets.",
    image: collectionAW25,
    productCount: 18,
  },
  {
    id: "3",
    name: "Essentials",
    slug: "essentials",
    description: "The foundation of your wardrobe. Timeless basics in premium fabrics.",
    image: mosaic1,
    productCount: 32,
  },
  {
    id: "4",
    name: "Archive",
    slug: "archive",
    description: "Past season favourites brought back by demand. Limited quantities.",
    image: mosaic4,
    productCount: 12,
  },
];

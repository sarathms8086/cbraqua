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
    id: "col-1",
    name: "Live Ornamental Fish",
    slug: "ornamental-fish",
    description: "Hand-selected, quarantined exotic fish including Halfmoon Bettas, imported Japanese Koi, Discus, and vibrant schooling Tetras.",
    image: "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=800&q=80",
    productCount: 42,
  },
  {
    id: "col-2",
    name: "Planted Aquascapes & Flora",
    slug: "aquarium-plants",
    description: "Tissue cultured foreground mats, hardy Anubias, colorful Rotala bunches, and artisanal driftwoods for nature aquariums.",
    image: "https://images.unsplash.com/photo-1584282479905-24d1933a32dc?auto=format&fit=crop&w=800&q=80",
    productCount: 28,
  },
  {
    id: "col-3",
    name: "Filters, Heaters & Tech",
    slug: "hardware",
    description: "Professional UV canister filters, silent air pumps, precision heaters, and wavemakers built for crystalline water clarity.",
    image: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=800&q=80",
    productCount: 35,
  },
  {
    id: "col-4",
    name: "Fish Food & Supplements",
    slug: "fish-food",
    description: "High-protein color enhancers, spirulina wafers, freeze-dried bloodworms, and essential water conditioning chemistry.",
    image: "https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?auto=format&fit=crop&w=800&q=80",
    productCount: 19,
  },
  {
    id: "col-5",
    name: "Turtles & Exotic Pets",
    slug: "turtles",
    description: "Healthy, captive-bred aquatic turtles and amphibians raised in optimal UV basking environments.",
    image: "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=800&q=80",
    productCount: 8,
  },
];

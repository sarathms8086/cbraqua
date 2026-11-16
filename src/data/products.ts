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
  featured?: boolean;
  stock?: number;
  soldOut?: boolean;
  soldOutSizes?: string[];
  collectionId?: string;
  shippingText?: string | null;
  washcareText?: string | null;
}

export const CATEGORIES = [
  { id: "all", label: "All products" },
  { id: "air-pumps", label: "Air Pumps" },
  { id: "aquarium-accessories", label: "Aquarium Accessories" },
  { id: "aquarium-plants", label: "Aquarium Plants" },
  { id: "betta-fish", label: "Betta Fish" },
  { id: "bristlenose-plecos", label: "Bristlenose Plecos" },
  { id: "filters", label: "Filters" },
  { id: "fish-food", label: "Fish Food" },
  { id: "heaters", label: "Heaters" },
  { id: "koi-fish", label: "Koi Fish" },
  { id: "ornamental-fish", label: "Ornamental Fish" },
  { id: "paradise-gourami", label: "Paradise Gourami" },
  { id: "turtles", label: "Turtles" },
];

export const products: Product[] = [
  {
    id: "cbr-1",
    name: "Premium Colour-Enhancing Pellets (250g)",
    slug: "premium-colour-enhancing-pellets",
    price: 490,
    category: "fish-food",
    stock: 60,
    featured: true,
    isNew: true,
    colors: [
      {
        name: "Slow Sinking Pellets",
        hex: "#d97706",
        image: "https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?auto=format&fit=crop&w=800&q=80",
        images: [
          "https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=800&q=80",
        ],
      },
    ],
    sizes: ["100g", "250g", "500g"],
    description: "Formulated with wild-harvested Arctic krill, organic spirulina, and astaxanthin to bring out vivid natural coloration in live ornamental fish within 14 days.",
    details: [
      { label: "Protein Content", value: "48% Crude Marine Protein" },
      { label: "Pellet Size", value: "1.5mm Slow Sinking" },
      { label: "Key Ingredients", value: "Krill, Spirulina, Astaxanthin, Garlic Oil" },
      { label: "Suitable For", value: "Betta, Tetras, Discus, Guppies, Cichlids" },
    ],
    shippingText: "Packed fresh with moisture-seal. Dispatches within 24 hours.",
    washcareText: "Store in a cool, dry place away from direct sunlight.",
  },
  {
    id: "cbr-2",
    name: "Submersible Heater 200W",
    slug: "submersible-heater-200w",
    price: 850,
    category: "heaters",
    stock: 18,
    featured: false,
    colors: [
      {
        name: "Standard Black Quartz",
        hex: "#1e293b",
        image: "https://images.unsplash.com/photo-1584282479905-24d1933a32dc?auto=format&fit=crop&w=800&q=80",
      },
    ],
    sizes: ["100W", "200W", "300W"],
    description: "High-precision thermostatic submersible heater built from explosion-proof quartz glass. Maintains constant water temperatures essential for sensitive tropical fish.",
    details: [
      { label: "Wattage", value: "200W (Ideal for 120L - 250L tanks)" },
      { label: "Temperature Range", value: "18°C – 34°C (±0.5°C accuracy)" },
      { label: "Safety", value: "Automatic dry-burn protection shutoff" },
      { label: "Submersion", value: "IP68 100% Fully Waterproof" },
    ],
    shippingText: "Insulated shockproof bubble packaging.",
    washcareText: "Always unplug and allow to cool for 15 minutes before tank maintenance.",
  },
  {
    id: "cbr-3",
    name: "Silent Air Pump — Dual Outlet",
    slug: "silent-air-pump-dual-outlet",
    price: 1100,
    category: "air-pumps",
    stock: 25,
    featured: false,
    colors: [
      {
        name: "Matte Black",
        hex: "#0f172a",
        image: "https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?auto=format&fit=crop&w=800&q=80",
      },
    ],
    sizes: ["Single Outlet", "Dual Outlet"],
    description: "Ultra-quiet diaphragm air pump operating below 28dB. Delivers high dissolved oxygen levels for dense planted aquascapes and populated community tanks.",
    details: [
      { label: "Flow Rate", value: "4.5 Litres/min (Adjustable dial)" },
      { label: "Noise Level", value: "< 28 dB Ultra-Quiet Acoustic Chamber" },
      { label: "Power", value: "4W Low Energy Consumption" },
      { label: "Included", value: "2x Check Valves, 2m Air Tubing" },
    ],
  },
  {
    id: "cbr-4",
    name: "Sunsun HW-303B Canister Filter",
    slug: "sunsun-hw-303b-canister-filter",
    price: 5800,
    category: "filters",
    stock: 10,
    featured: true,
    colors: [
      {
        name: "Classic White & Grey",
        hex: "#f8fafc",
        image: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=800&q=80",
      },
    ],
    sizes: ["Standard", "With 9W UV Sterilizer"],
    description: "Heavy-duty 3-stage external canister filtration system with integrated 9W UV sterilizer to eliminate green water, pathogens, and suspended algae.",
    details: [
      { label: "Pump Flow Rate", value: "1,400 L/H (For tanks up to 400L)" },
      { label: "UV Clarifier", value: "Built-in 9W Ultraviolet sterilizer bulb" },
      { label: "Baskets", value: "3 Large modular media capacity trays" },
      { label: "Priming", value: "Single-button easy self-priming pump" },
    ],
  },
  {
    id: "cbr-5",
    name: "Anubias Nana — Aquarium Plant",
    slug: "anubias-nana-aquarium-plant",
    price: 250,
    category: "aquarium-plants",
    stock: 40,
    featured: false,
    colors: [
      {
        name: "Lush Green",
        hex: "#15803d",
        image: "https://images.unsplash.com/photo-1584282479905-24d1933a32dc?auto=format&fit=crop&w=800&q=80",
      },
    ],
    sizes: ["Bare Root Bunch", "Wood Mounted"],
    description: "Hardy, slow-growing epiphytic plant with deep green leathery leaves. Thrives in low-tech setups attached to driftwood or dragon stone.",
    details: [
      { label: "Care Level", value: "Very Easy (Beginner Friendly)" },
      { label: "Light Requirement", value: "Low to Moderate" },
      { label: "CO2 Need", value: "Not required" },
      { label: "Placement", value: "Attach rhizome to rock or wood (do not bury rhizome in substrate)" },
    ],
  },
  {
    id: "cbr-6",
    name: "Red-Eared Slider Turtle",
    slug: "red-eared-slider-turtle",
    price: 1200,
    category: "turtles",
    stock: 5,
    featured: false,
    colors: [
      {
        name: "Natural Olive Shell",
        hex: "#4d7c0f",
        image: "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=800&q=80",
      },
    ],
    sizes: ["Hatchling (2-3 inch)", "Juvenile (4 inch)"],
    description: "Playful and active aquatic turtle, captive-bred with high shell symmetry and radiant red ear stripes. Fully acclimated and feeding vigorously on floating pellets.",
    details: [
      { label: "Lifespan", value: "20 - 30+ years with proper basking" },
      { label: "Diet", value: "Commercial turtle sticks, dried shrimp, aquatic greens" },
      { label: "Habitat Needs", value: "Aquarium with basking dock, UVB lamp & filtration" },
      { label: "Live Delivery", value: "100% Live Arrival Guarantee with thermal packs" },
    ],
  },
  {
    id: "cbr-7",
    name: "Halfmoon King Betta — Royal Blue",
    slug: "halfmoon-king-betta-royal-blue",
    price: 650,
    category: "betta-fish",
    stock: 15,
    featured: true,
    isNew: true,
    colors: [
      {
        name: "Royal Blue & Indigo",
        hex: "#1d4ed8",
        image: "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=800&q=80",
      },
    ],
    sizes: ["Show Grade Male", "Selected Female"],
    description: "Exquisite show-grade Halfmoon Betta featuring a 180-degree caudal fin spread. Quarantined for 14 days and feeding enthusiastically on micro-pellets.",
    details: [
      { label: "Fin Spread", value: "180° Perfect Halfmoon D-Form" },
      { label: "Temperature", value: "24°C - 28°C" },
      { label: "Min Tank Size", value: "15 Litres (avoid strong water currents)" },
      { label: "Temperament", value: "Solitary (1 male per aquarium)" },
    ],
  },
  {
    id: "cbr-8",
    name: "Super Red Bristlenose Pleco (L144)",
    slug: "super-red-bristlenose-pleco-l144",
    price: 950,
    category: "bristlenose-plecos",
    stock: 12,
    featured: false,
    colors: [
      {
        name: "Solid Deep Red",
        hex: "#b91c1c",
        image: "https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&w=800&q=80",
      },
    ],
    sizes: ["2.0 inch Juvenile", "3.5 inch Sub-Adult"],
    description: "Vibrant solid red dwarf pleco that stays compact and peaceful. Unmatched workhorse for grazing brown diatom and soft green algae off plants and glass.",
    details: [
      { label: "Maximum Size", value: "4 to 5 inches (Dwarf species)" },
      { label: "Diet", value: "Spirulina wafers, blanched zucchini, driftwood lignin" },
      { label: "Behavior", value: "Peaceful bottom dweller, plant-safe" },
      { label: "Water Parameters", value: "pH 6.5 - 7.5, Temp 23°C - 27°C" },
    ],
  },
  {
    id: "cbr-9",
    name: "Japanese Kohaku Premium Koi (6-8 inch)",
    slug: "japanese-kohaku-koi",
    price: 2400,
    category: "koi-fish",
    stock: 8,
    featured: true,
    colors: [
      {
        name: "Red & Pure White",
        hex: "#ea580c",
        image: "https://images.unsplash.com/photo-1516683037151-9a17603a8dc7?auto=format&fit=crop&w=800&q=80",
      },
    ],
    sizes: ["6-8 inch (Handpicked)", "10-12 inch"],
    description: "Classic two-step Kohaku with porcelain-white Shiroji skin and crimson Hi markings. Selected from certified Japanese bloodlines with vibrant scale sheen.",
    details: [
      { label: "Bloodline", value: "Niigata Lineage Selected" },
      { label: "Pattern", value: "Nidan (2-Step) Kohaku" },
      { label: "Habitat", value: "Outdoor pond or large indoor aquarium (300L+)" },
      { label: "Packaging", value: "Heavy-duty double poly bag with pure oxygen" },
    ],
  },
  {
    id: "cbr-10",
    name: "Neon Tetra School (Pack of 10)",
    slug: "neon-tetra-school",
    price: 450,
    category: "ornamental-fish",
    stock: 50,
    featured: false,
    colors: [
      {
        name: "Neon Blue & Red",
        hex: "#06b6d4",
        image: "https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&w=800&q=80",
      },
    ],
    sizes: ["Pack of 10", "Pack of 20"],
    description: "The quintessential planted tank schooling fish. Vivid iridescent electric-blue horizontal stripes that shimmer brilliantly under aquarium LED lighting.",
    details: [
      { label: "Schooling Size", value: "Pack of 10 healthy acclimated juveniles" },
      { label: "Behavior", value: "Tight schooler, peaceful with all community species" },
      { label: "Water", value: "Soft acidic to neutral water (pH 6.0 - 7.0)" },
    ],
  },
  {
    id: "cbr-11",
    name: "Blue Paradise Gourami (Male)",
    slug: "blue-paradise-gourami",
    price: 420,
    category: "paradise-gourami",
    stock: 20,
    featured: false,
    colors: [
      {
        name: "Blue & Orange Barred",
        hex: "#2563eb",
        image: "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=800&q=80",
      },
    ],
    sizes: ["Single Male", "Pair (M+F)"],
    description: "Vibrant and resilient labyrinth fish with metallic blue body and red-orange tiger striping. Capable of breathing atmospheric air, making it extremely durable.",
    details: [
      { label: "Hardiness", value: "Extremely hardy, room temp tolerant (18°C - 28°C)" },
      { label: "Size", value: "3.0 - 3.5 inches" },
      { label: "Diet", value: "Eats hydra, flatworms, flake food, and live prey" },
    ],
  },
  {
    id: "cbr-12",
    name: "Seachem Prime Water Conditioner 250ml",
    slug: "seachem-prime-water-conditioner-250ml",
    price: 890,
    category: "aquarium-accessories",
    stock: 35,
    featured: false,
    colors: [
      {
        name: "250ml Bottle",
        hex: "#b45309",
        image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=800&q=80",
      },
    ],
    sizes: ["100ml", "250ml", "500ml"],
    description: "The industry standard complete water conditioner. Instantly removes chlorine, chloramine, and detoxifies ammonia, nitrite, and nitrate during water changes.",
    details: [
      { label: "Concentration", value: "5ml treats 200 Litres (Super concentrated)" },
      { label: "Safety", value: "Non-acidic, will not impact pH or over-activate skimmers" },
      { label: "Essential For", value: "Every tap water change and cycling emergency" },
    ],
  },
];

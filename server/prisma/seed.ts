import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const existingCount = await prisma.product.count();
  if (existingCount > 0) {
    console.log(`Database already has ${existingCount} products. Skipping seed.`);
    return;
  }

  console.log("Cleaning database...");
  await prisma.color.deleteMany();
  await prisma.product.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.mosaicTile.deleteMany();
  await prisma.setting.deleteMany();

  console.log("Seeding CBR AQUA CULTURE data...");

  // Seed Settings
  await prisma.setting.createMany({
    data: [
      { key: "brandName", value: "CBR AQUA" },
      { key: "brandSubtitle", value: "CULTURE" },
      { key: "marqueeText", value: "LIVE ARRIVAL GUARANTEE — CURATED ORNAMENTAL FISH & AQUASCAPES — ALL-INDIA OXYGEN PACKED SHIPPING — FREE DELIVERY OVER ₹1,999 — " },
      { key: "footerTagline", value: "CBR AQUA CULTURE curates rare ornamental fish, koi, planted aquascapes, terrariums, and pro-grade aquarium hardware." },
      { key: "shippingText", value: "Packed with medical-grade oxygen in temperature-regulated insulated thermocol boxes with 48h thermal packs. 100% Live Arrival Guaranteed pan-India." },
    ],
  });

  // Seed Collections
  const collectionsData = [
    {
      id: "col-1",
      name: "Live Ornamental Fish",
      slug: "ornamental-fish",
      description: "Hand-selected, quarantined exotic fish including Halfmoon Bettas, imported Japanese Koi, Discus, and vibrant schooling Tetras.",
      image: "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=800&q=80",
      itemCount: 42,
    },
    {
      id: "col-2",
      name: "Planted Aquascapes & Flora",
      slug: "aquarium-plants",
      description: "Tissue cultured foreground mats, hardy Anubias, colorful Rotala bunches, and artisanal driftwoods for nature aquariums.",
      image: "https://images.unsplash.com/photo-1584282479905-24d1933a32dc?auto=format&fit=crop&w=800&q=80",
      itemCount: 28,
    },
    {
      id: "col-3",
      name: "Filters, Heaters & Tech",
      slug: "hardware",
      description: "Professional UV canister filters, silent air pumps, precision heaters, and wavemakers built for crystalline water clarity.",
      image: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=800&q=80",
      itemCount: 35,
    },
    {
      id: "col-4",
      name: "Fish Food & Supplements",
      slug: "fish-food",
      description: "High-protein color enhancers, spirulina wafers, freeze-dried bloodworms, and essential water conditioning chemistry.",
      image: "https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?auto=format&fit=crop&w=800&q=80",
      itemCount: 19,
    },
    {
      id: "col-5",
      name: "Turtles & Exotic Pets",
      slug: "turtles",
      description: "Healthy, captive-bred aquatic turtles and amphibians raised in optimal UV basking environments.",
      image: "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=800&q=80",
      itemCount: 8,
    },
  ];

  for (const col of collectionsData) {
    await prisma.collection.create({ data: { ...col, visible: true } });
  }

  // Seed Products
  const productsToSeed = [
    {
      id: "cbr-1",
      name: "Premium Colour-Enhancing Pellets (250g)",
      slug: "premium-colour-enhancing-pellets",
      price: 490,
      category: "fish-food",
      productType: "Fish Food",
      description: "Formulated with wild-harvested Arctic krill, organic spirulina, and astaxanthin to bring out vivid natural coloration in live ornamental fish within 14 days.",
      sizes: ["100g", "250g", "500g"],
      details: [
        { label: "Protein Content", value: "48% Crude Marine Protein" },
        { label: "Pellet Size", value: "1.5mm Slow Sinking" },
        { label: "Key Ingredients", value: "Krill, Spirulina, Astaxanthin, Garlic Oil" },
        { label: "Suitable For", value: "Betta, Tetras, Discus, Guppies, Cichlids" },
      ],
      isNew: true,
      collectionId: "col-4",
      colors: [
        {
          name: "Standard Jar",
          hex: "#d97706",
          image: "https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?auto=format&fit=crop&w=800&q=80",
          sizeStock: { "100g": 30, "250g": 60, "500g": 20 },
        },
      ],
    },
    {
      id: "cbr-2",
      name: "Submersible Heater 200W",
      slug: "submersible-heater-200w",
      price: 850,
      category: "heaters",
      productType: "Heaters",
      description: "High-precision thermostatic submersible heater built from explosion-proof quartz glass. Maintains constant water temperatures essential for sensitive tropical fish.",
      sizes: ["100W", "200W", "300W"],
      details: [
        { label: "Wattage", value: "200W (Ideal for 120L - 250L tanks)" },
        { label: "Temperature Range", value: "18°C – 34°C (±0.5°C accuracy)" },
        { label: "Safety", value: "Automatic dry-burn protection shutoff" },
      ],
      isNew: false,
      collectionId: "col-3",
      colors: [
        {
          name: "Black Quartz",
          hex: "#1e293b",
          image: "https://images.unsplash.com/photo-1584282479905-24d1933a32dc?auto=format&fit=crop&w=800&q=80",
          sizeStock: { "200W": 18 },
        },
      ],
    },
    {
      id: "cbr-3",
      name: "Silent Air Pump — Dual Outlet",
      slug: "silent-air-pump-dual-outlet",
      price: 1100,
      category: "air-pumps",
      productType: "Air Pumps",
      description: "Ultra-quiet diaphragm air pump operating below 28dB. Delivers high dissolved oxygen levels for dense planted aquascapes and populated community tanks.",
      sizes: ["Single Outlet", "Dual Outlet"],
      details: [
        { label: "Flow Rate", value: "4.5 Litres/min (Adjustable dial)" },
        { label: "Noise Level", value: "< 28 dB Ultra-Quiet Chamber" },
        { label: "Power", value: "4W Low Energy Consumption" },
      ],
      isNew: false,
      collectionId: "col-3",
      colors: [
        {
          name: "Matte Black",
          hex: "#0f172a",
          image: "https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?auto=format&fit=crop&w=800&q=80",
          sizeStock: { "Dual Outlet": 25 },
        },
      ],
    },
    {
      id: "cbr-4",
      name: "Sunsun HW-303B Canister Filter",
      slug: "sunsun-hw-303b-canister-filter",
      price: 5800,
      category: "filters",
      productType: "Filters",
      description: "Heavy-duty 3-stage external canister filtration system with integrated 9W UV sterilizer to eliminate green water, pathogens, and suspended algae.",
      sizes: ["Standard", "With 9W UV"],
      details: [
        { label: "Pump Flow Rate", value: "1,400 L/H (For tanks up to 400L)" },
        { label: "UV Clarifier", value: "Built-in 9W Ultraviolet sterilizer bulb" },
        { label: "Baskets", value: "3 Large modular media capacity trays" },
      ],
      isNew: true,
      collectionId: "col-3",
      colors: [
        {
          name: "White & Grey",
          hex: "#f8fafc",
          image: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=800&q=80",
          sizeStock: { "Standard": 10 },
        },
      ],
    },
    {
      id: "cbr-5",
      name: "Anubias Nana — Aquarium Plant",
      slug: "anubias-nana-aquarium-plant",
      price: 250,
      category: "aquarium-plants",
      productType: "Aquarium Plants",
      description: "Hardy, slow-growing epiphytic plant with deep green leathery leaves. Thrives in low-tech setups attached to driftwood or dragon stone.",
      sizes: ["Bare Root", "Wood Mounted"],
      details: [
        { label: "Care Level", value: "Very Easy (Beginner Friendly)" },
        { label: "Light Requirement", value: "Low to Moderate" },
        { label: "Placement", value: "Attach rhizome to rock or wood" },
      ],
      isNew: false,
      collectionId: "col-2",
      colors: [
        {
          name: "Lush Green",
          hex: "#15803d",
          image: "https://images.unsplash.com/photo-1584282479905-24d1933a32dc?auto=format&fit=crop&w=800&q=80",
          sizeStock: { "Bare Root": 40 },
        },
      ],
    },
    {
      id: "cbr-6",
      name: "Red-Eared Slider Turtle",
      slug: "red-eared-slider-turtle",
      price: 1200,
      category: "turtles",
      productType: "Turtles",
      description: "Playful and active aquatic turtle, captive-bred with high shell symmetry and radiant red ear stripes. Fully acclimated and feeding vigorously on floating pellets.",
      sizes: ["Hatchling (2-3 inch)", "Juvenile (4 inch)"],
      details: [
        { label: "Lifespan", value: "20 - 30+ years with proper basking" },
        { label: "Diet", value: "Commercial turtle sticks, dried shrimp, aquatic greens" },
        { label: "Live Delivery", value: "100% Live Arrival Guarantee with thermal packs" },
      ],
      isNew: false,
      collectionId: "col-5",
      colors: [
        {
          name: "Natural Olive",
          hex: "#4d7c0f",
          image: "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=800&q=80",
          sizeStock: { "Hatchling (2-3 inch)": 5 },
        },
      ],
    },
    {
      id: "cbr-7",
      name: "Halfmoon King Betta — Royal Blue",
      slug: "halfmoon-king-betta-royal-blue",
      price: 650,
      category: "betta-fish",
      productType: "Betta Fish",
      description: "Exquisite show-grade Halfmoon Betta featuring a 180-degree caudal fin spread. Quarantined for 14 days and feeding enthusiastically on micro-pellets.",
      sizes: ["Male (Show Grade)", "Selected Female"],
      details: [
        { label: "Fin Spread", value: "180° Perfect Halfmoon D-Form" },
        { label: "Temperature", value: "24°C - 28°C" },
      ],
      isNew: true,
      collectionId: "col-1",
      colors: [
        {
          name: "Royal Blue",
          hex: "#1d4ed8",
          image: "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=800&q=80",
          sizeStock: { "Male (Show Grade)": 15 },
        },
      ],
    },
    {
      id: "cbr-8",
      name: "Super Red Bristlenose Pleco (L144)",
      slug: "super-red-bristlenose-pleco-l144",
      price: 950,
      category: "bristlenose-plecos",
      productType: "Bristlenose Plecos",
      description: "Vibrant solid red dwarf pleco that stays compact and peaceful. Unmatched workhorse for grazing brown diatom and soft green algae off plants and glass.",
      sizes: ["2.0 inch Juvenile", "3.5 inch Sub-Adult"],
      details: [
        { label: "Maximum Size", value: "4 to 5 inches (Dwarf species)" },
        { label: "Function", value: "Superb algae cleaner" },
      ],
      isNew: false,
      collectionId: "col-1",
      colors: [
        {
          name: "Solid Red",
          hex: "#b91c1c",
          image: "https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&w=800&q=80",
          sizeStock: { "2.0 inch Juvenile": 12 },
        },
      ],
    },
    {
      id: "cbr-9",
      name: "Japanese Kohaku Premium Koi (6-8 inch)",
      slug: "japanese-kohaku-koi",
      price: 2400,
      category: "koi-fish",
      productType: "Koi Fish",
      description: "Classic two-step Kohaku with porcelain-white Shiroji skin and crimson Hi markings. Selected from certified Japanese bloodlines with vibrant scale sheen.",
      sizes: ["6-8 inch", "10-12 inch"],
      details: [
        { label: "Bloodline", value: "Niigata Lineage Selected" },
        { label: "Pattern", value: "Nidan (2-Step) Kohaku" },
      ],
      isNew: true,
      collectionId: "col-1",
      colors: [
        {
          name: "Red & White",
          hex: "#ea580c",
          image: "https://images.unsplash.com/photo-1516683037151-9a17603a8dc7?auto=format&fit=crop&w=800&q=80",
          sizeStock: { "6-8 inch": 8 },
        },
      ],
    },
    {
      id: "cbr-10",
      name: "Neon Tetra School (Pack of 10)",
      slug: "neon-tetra-school",
      price: 450,
      category: "ornamental-fish",
      productType: "Ornamental Fish",
      description: "The quintessential planted tank schooling fish. Vivid iridescent electric-blue horizontal stripes that shimmer brilliantly under aquarium LED lighting.",
      sizes: ["Pack of 10", "Pack of 20"],
      details: [
        { label: "Schooling Size", value: "Pack of 10 healthy juveniles" },
        { label: "Water", value: "pH 6.0 - 7.0, Temp 22-26°C" },
      ],
      isNew: false,
      collectionId: "col-1",
      colors: [
        {
          name: "Electric Blue & Red",
          hex: "#06b6d4",
          image: "https://images.unsplash.com/photo-1535591273668-578e31182c4f?auto=format&fit=crop&w=800&q=80",
          sizeStock: { "Pack of 10": 50 },
        },
      ],
    },
    {
      id: "cbr-11",
      name: "Blue Paradise Gourami (Male)",
      slug: "blue-paradise-gourami",
      price: 420,
      category: "paradise-gourami",
      productType: "Paradise Gourami",
      description: "Vibrant and resilient labyrinth fish with metallic blue body and red-orange tiger striping. Capable of breathing atmospheric air, making it extremely durable.",
      sizes: ["Single Male", "Pair (M+F)"],
      details: [
        { label: "Hardiness", value: "Extremely hardy, room temp tolerant" },
        { label: "Size", value: "3.0 - 3.5 inches" },
      ],
      isNew: false,
      collectionId: "col-1",
      colors: [
        {
          name: "Blue & Orange Barred",
          hex: "#2563eb",
          image: "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=800&q=80",
          sizeStock: { "Single Male": 20 },
        },
      ],
    },
    {
      id: "cbr-12",
      name: "Seachem Prime Water Conditioner 250ml",
      slug: "seachem-prime-water-conditioner-250ml",
      price: 890,
      category: "aquarium-accessories",
      productType: "Aquarium Accessories",
      description: "The industry standard complete water conditioner. Instantly removes chlorine, chloramine, and detoxifies ammonia, nitrite, and nitrate during water changes.",
      sizes: ["100ml", "250ml", "500ml"],
      details: [
        { label: "Concentration", value: "5ml treats 200 Litres (Super concentrated)" },
        { label: "Action", value: "Removes Chlorine & Detoxifies Heavy Metals" },
      ],
      isNew: false,
      collectionId: "col-3",
      colors: [
        {
          name: "250ml Bottle",
          hex: "#b45309",
          image: "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?auto=format&fit=crop&w=800&q=80",
          sizeStock: { "250ml": 35 },
        },
      ],
    },
  ];

  for (const p of productsToSeed) {
    const { colors, ...prodData } = p;
    await prisma.product.create({
      data: {
        ...prodData,
        sizes: JSON.stringify(prodData.sizes),
        details: JSON.stringify(prodData.details),
        colors: {
          create: colors.map(c => ({
            name: c.name,
            hex: c.hex,
            image: c.image,
            sizeStock: c.sizeStock ? JSON.stringify(c.sizeStock) : null,
          })),
        },
      },
    });
  }

  console.log("Database seeded successfully with CBR AQUA CULTURE products!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

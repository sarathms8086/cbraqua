import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Cleaning database...");
  await prisma.color.deleteMany();
  await prisma.product.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.mosaicTile.deleteMany();
  await prisma.setting.deleteMany();

  console.log("Seeding data...");

  // Seed Settings
  await prisma.setting.createMany({
    data: [
      { key: "brandName", value: "DANYWENS" },
      { key: "marqueeText", value: "NEW DROP — FREE SHIPPING ON ORDERS OVER $150 — DANYWENS ARCHIVE — LIMITED EDITION — " },
      { key: "footerTagline", value: "Contemporary streetwear for the modern archive." },
    ]
  });

  // Seed Mosaic Tiles
  const defaultMosaicTiles = [
    { type: "image", label: "HOODIES", image: "/assets/dany-wens/mosaic-1.jpg", colSpan: "md:col-span-2", rowSpan: "md:row-span-2", order: 0 },
    { type: "image", label: "NEW IN", image: "/assets/dany-wens/mosaic-2.jpg", colSpan: "md:col-span-3", rowSpan: "md:row-span-1", order: 1 },
    { type: "image", label: "SWEATSHIRTS", image: "/assets/dany-wens/mosaic-5.jpg", colSpan: "md:col-span-2", rowSpan: "md:row-span-1", order: 2 },
    { type: "cta", subtitle: "SS26 COLLECTION", heading: "THE NEW ARCHIVE", tagline: "Designed with intention. Built to last.", ctaText: "SHOP NOW", ctaLink: "/shop", order: 3 },
    { type: "image", label: "SHOP ALL", image: "/assets/dany-wens/mosaic-4.jpg", colSpan: "md:col-span-2", rowSpan: "md:row-span-2", order: 4 },
    { type: "image", label: "ACCESSORIES", image: "/assets/dany-wens/mosaic-6.jpg", colSpan: "md:col-span-2", rowSpan: "md:row-span-1", order: 5 },
    { type: "image", label: "LOOKBOOK", image: "/assets/dany-wens/mosaic-8.jpg", colSpan: "md:col-span-3", rowSpan: "md:row-span-2", order: 6 },
    { type: "image", label: "COLLECTIONS", image: "/assets/dany-wens/mosaic-7.jpg", colSpan: "md:col-span-4", rowSpan: "md:row-span-1", order: 7 },
    { type: "image", label: "OUR CRAFT", image: "/assets/dany-wens/mosaic-3.jpg", colSpan: "md:col-span-3", rowSpan: "md:row-span-1", order: 8 },
  ];

  for (const tile of defaultMosaicTiles) {
    await prisma.mosaicTile.create({ data: { ...tile, visible: true } });
  }

  // Seed Collections
  const collectionsData = [
    { id: "dw-collection", name: "DANY WENS 2026", slug: "dany-wens-2026", description: "The definitive 2026 collection. Premium staples redefined for the modern wardrobe.", image: "/assets/dany-wens/crew-neck-1.jpg", itemCount: 4 },
    { id: "1", name: "SS26 Collection", slug: "ss26", description: "Summer essentials designed with intention. Lightweight fabrics meet bold silhouettes for the warmer months ahead.", image: "/assets/dany-wens/collection-ss26.jpg", itemCount: 24 },
    { id: "2", name: "AW25 Collection", slug: "aw25", description: "Heavyweight layers and structured outerwear. Built for the cold, designed for the streets.", image: "/assets/dany-wens/collection-aw25.jpg", itemCount: 18 },
    { id: "3", name: "Essentials", slug: "essentials", description: "The foundation of your wardrobe. Timeless basics in premium fabrics.", image: "/assets/dany-wens/mosaic-1.jpg", itemCount: 32 },
    { id: "4", name: "Archive", slug: "archive", description: "Past season favourites brought back by demand. Limited quantities.", image: "/assets/dany-wens/mosaic-4.jpg", itemCount: 12 },
  ];

  for (const col of collectionsData) {
    await prisma.collection.create({ data: { ...col, visible: true } });
  }

  // Seed Products
  const productsToSeed = [
    {
      id: "dw-1",
      name: "Classic Crew Neck",
      slug: "classic-crew-neck",
      price: 85,
      category: "t-shirts",
      colors: [
        { name: "White", hex: "#ffffff", image: "/assets/dany-wens/crew-neck-1.jpg" },
        { name: "Black", hex: "#1a1a1a", image: "/assets/dany-wens/crew-neck-2.jpg" },
        { name: "Grey", hex: "#9e9e9e", image: "/assets/dany-wens/crew-neck-3.jpg" },
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
      collectionId: "dw-collection",
    },
    {
      id: "dw-2",
      name: "Henley Half Sleeve",
      slug: "henley-half-sleeve",
      price: 95,
      category: "t-shirts",
      colors: [
        { name: "Navy", hex: "#1B2A4A", image: "/assets/dany-wens/henley-half-1.jpg" },
        { name: "Olive", hex: "#556B2F", image: "/assets/dany-wens/henley-half-2.jpg" },
        { name: "Charcoal", hex: "#333333", image: "/assets/dany-wens/henley-half-3.jpg" },
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      description: "Versatile henley with a three-button placket. Perfect for layering.",
      details: [
        { label: "Composition", value: "95% Cotton, 5% Elastane" },
        { label: "Fit", value: "Slim Fit" },
        { label: "Care", value: "Machine wash cold" },
      ],
      isNew: true,
      collectionId: "dw-collection",
    },
    {
      id: "dw-3",
      name: "Henley Full Sleeve",
      slug: "henley-full-sleeve",
      price: 110,
      category: "t-shirts",
      colors: [
        { name: "Burgundy", hex: "#800020", image: "/assets/dany-wens/henley-full-1.jpg" },
        { name: "Sand", hex: "#C2B280", image: "/assets/dany-wens/henley-full-2.jpg" },
        { name: "Forest", hex: "#228B22", image: "/assets/dany-wens/henley-full-3.jpg" },
      ],
      sizes: ["S", "M", "L", "XL", "XXL"],
      description: "Full sleeve henley for cooler days. Soft textured fabric.",
      details: [
        { label: "Composition", value: "100% Organic Cotton" },
        { label: "Fit", value: "Tailored" },
        { label: "Care", value: "Machine wash cold" },
      ],
      isNew: true,
      collectionId: "dw-collection",
    },
    {
      id: "dw-4",
      name: "Free Size Oversized Tee",
      slug: "free-size-oversized-tee",
      price: 75,
      category: "t-shirts",
      colors: [
        { name: "Off White", hex: "#FAF9F6", image: "/assets/dany-wens/free-size-1.jpg" },
        { name: "Slate", hex: "#708090", image: "/assets/dany-wens/free-size-2.jpg" },
        { name: "Mocha", hex: "#A38068", image: "/assets/dany-wens/free-size-3.jpg" },
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
      collectionId: "dw-collection",
    },
    {
      id: "1",
      name: "Heavyweight Hoodie",
      slug: "heavyweight-hoodie",
      price: 145,
      category: "hoodies",
      colors: [
        { name: "Black", hex: "#1a1a1a", image: "/assets/dany-wens/product-hoodie-black.jpg" },
        { name: "Brown", hex: "#8B4513", image: "/assets/dany-wens/product-hoodie-brown.jpg" },
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
      collectionId: "1",
    },
    {
      id: "2",
      name: "Oversized T-Shirt",
      slug: "oversized-tshirt",
      price: 65,
      category: "t-shirts",
      colors: [
        { name: "Cream", hex: "#F5F5DC", image: "/assets/dany-wens/product-tee-cream.jpg" },
        { name: "Black", hex: "#1a1a1a", image: "/assets/dany-wens/product-tee-black.jpg" },
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
      collectionId: "1",
    },
    {
      id: "3",
      name: "Cargo Pant",
      slug: "cargo-pant",
      price: 125,
      category: "bottoms",
      colors: [
        { name: "Olive", hex: "#556B2F", image: "/assets/dany-wens/product-cargo-olive.jpg" },
      ],
      sizes: ["28", "30", "32", "34", "36", "38"],
      description: "Relaxed fit cargo pant with six-pocket design. Durable cotton twill.",
      details: [
        { label: "Composition", value: "100% Cotton Twill" },
        { label: "Weight", value: "320gsm" },
        { label: "Fit", value: "Relaxed" },
        { label: "Care", value: "Machine wash cold" },
      ],
      collectionId: "2",
    },
    {
      id: "4",
      name: "Crewneck Sweatshirt",
      slug: "crewneck-sweatshirt",
      price: 120,
      category: "sweatshirts",
      colors: [
        { name: "Grey Marl", hex: "#9e9e9e", image: "/assets/dany-wens/product-crew-grey.jpg" },
        { name: "White", hex: "#ffffff", image: "/assets/dany-wens/product-crew-white.jpg" },
      ],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      description: "400gsm heavyweight French terry crewneck. Regular fit with ribbed cuffs.",
      details: [
        { label: "Composition", value: "80% Cotton, 20% Polyester" },
        { label: "Weight", value: "400gsm" },
        { label: "Fit", value: "Regular" },
        { label: "Care", value: "Machine wash cold" },
      ],
      collectionId: "3",
    },
    {
      id: "5",
      name: "Jogger Pant",
      slug: "jogger-pant",
      price: 110,
      category: "bottoms",
      colors: [
        { name: "Black", hex: "#1a1a1a", image: "/assets/dany-wens/product-jogger-black.jpg" },
      ],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      description: "380gsm heavyweight fleece jogger with elastic cuff and drawcord waist.",
      details: [
        { label: "Composition", value: "80% Cotton, 20% Polyester" },
        { label: "Weight", value: "380gsm" },
        { label: "Fit", value: "Regular tapered" },
        { label: "Care", value: "Machine wash cold" },
      ],
      collectionId: "3",
    },
    {
      id: "6",
      name: "Track Jacket",
      slug: "track-jacket",
      price: 155,
      category: "jackets",
      colors: [
        { name: "Navy", hex: "#1B2A4A", image: "/assets/dany-wens/product-jacket-navy.jpg" },
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
      collectionId: "3",
    },
    {
      id: "7",
      name: "Tank Top",
      slug: "tank-top",
      price: 45,
      category: "t-shirts",
      colors: [
        { name: "White", hex: "#ffffff", image: "/assets/dany-wens/product-tank-white.jpg" },
      ],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      description: "220gsm cotton jersey tank. Dropped armhole, elongated fit.",
      details: [
        { label: "Composition", value: "100% Cotton" },
        { label: "Weight", value: "220gsm" },
        { label: "Fit", value: "Oversized" },
        { label: "Care", value: "Machine wash cold" },
      ],
      collectionId: "3",
    },
    {
      id: "8",
      name: "Cargo Short",
      slug: "cargo-short",
      price: 95,
      category: "bottoms",
      colors: [
        { name: "Beige", hex: "#D2B48C", image: "/assets/dany-wens/product-shorts-beige.jpg" },
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
      collectionId: "1",
    },
    {
      id: "9",
      name: "Fitted Cap",
      slug: "fitted-cap",
      price: 40,
      category: "accessories",
      colors: [
        { name: "Black", hex: "#1a1a1a", image: "/assets/dany-wens/product-cap-black.jpg" },
      ],
      sizes: ["S/M", "L/XL"],
      description: "Structured six-panel cap with embroidered logo. Adjustable strap.",
      details: [
        { label: "Composition", value: "100% Cotton Twill" },
        { label: "Fit", value: "Adjustable" },
        { label: "Care", value: "Spot clean only" },
      ],
      collectionId: "3",
    },
    {
      id: "10",
      name: "Essential Hoodie",
      slug: "essential-hoodie",
      price: 130,
      category: "hoodies",
      colors: [
        { name: "Brown", hex: "#8B4513", image: "/assets/dany-wens/product-hoodie-brown.jpg" },
        { name: "Black", hex: "#1a1a1a", image: "/assets/dany-wens/product-hoodie-black.jpg" },
      ],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      description: "350gsm midweight French terry hoodie. Relaxed fit with split kangaroo pocket.",
      details: [
        { label: "Composition", value: "100% Cotton" },
        { label: "Weight", value: "350gsm" },
        { label: "Fit", value: "Relaxed" },
        { label: "Care", value: "Machine wash cold" },
      ],
      collectionId: "3",
    },
    {
      id: "11",
      name: "Relaxed Tee",
      slug: "relaxed-tee",
      price: 55,
      category: "t-shirts",
      colors: [
        { name: "Black", hex: "#1a1a1a", image: "/assets/dany-wens/product-tee-black.jpg" },
        { name: "Cream", hex: "#F5F5DC", image: "/assets/dany-wens/product-tee-cream.jpg" },
      ],
      sizes: ["XS", "S", "M", "L", "XL", "XXL"],
      description: "240gsm cotton jersey tee. Relaxed fit with curved hem.",
      details: [
        { label: "Composition", value: "100% Cotton" },
        { label: "Weight", value: "240gsm" },
        { label: "Fit", value: "Relaxed" },
        { label: "Care", value: "Machine wash cold" },
      ],
      collectionId: "3",
    },
    {
      id: "12",
      name: "Essential Crewneck",
      slug: "essential-crewneck",
      price: 105,
      category: "sweatshirts",
      colors: [
        { name: "White", hex: "#ffffff", image: "/assets/dany-wens/product-crew-white.jpg" },
        { name: "Grey Marl", hex: "#9e9e9e", image: "/assets/dany-wens/product-crew-grey.jpg" },
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
      collectionId: "3",
    },
  ];

  for (const prod of productsToSeed) {
    const { colors, details, sizes, ...rest } = prod;
    await prisma.product.create({
      data: {
        ...rest,
        details: JSON.stringify(details),
        sizes: JSON.stringify(sizes),
        colors: {
          create: colors,
        },
      },
    });
  }

  console.log("Seed finished.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

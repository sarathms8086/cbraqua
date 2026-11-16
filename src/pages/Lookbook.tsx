import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { useSEO } from "@/hooks/use-seo";

const galleryItems = [
  {
    title: "High-Tech Iwagumi Aquascape (180L)",
    category: "Planted Aquascapes",
    src: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=1200&q=80",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    title: "Showgrade Halfmoon Betta Breeding",
    category: "Live Specimens",
    src: "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=800&q=80",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Rainforest Terrarium with Mist System",
    category: "Terrariums",
    src: "https://images.unsplash.com/photo-1584282479905-24d1933a32dc?auto=format&fit=crop&w=800&q=80",
    span: "md:col-span-1 md:row-span-2",
  },
  {
    title: "Japanese Kohaku Koi Pond (5,000L)",
    category: "Koi Ponds",
    src: "https://images.unsplash.com/photo-1516683037151-9a17603a8dc7?auto=format&fit=crop&w=1200&q=80",
    span: "md:col-span-2 md:row-span-1",
  },
  {
    title: "Anubias & Bucephalandra Hardscape",
    category: "Nature Aquariums",
    src: "https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?auto=format&fit=crop&w=800&q=80",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Captive-Bred Red-Eared Slider Habitat",
    category: "Amphibian Enclosures",
    src: "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=800&q=80",
    span: "md:col-span-2 md:row-span-1",
  },
];

const Lookbook = () => {
  useSEO({
    title: "Aquascapes & Rare Fish Gallery — CBR AQUA CULTURE",
    description: "Explore our living installations: high-tech Iwagumi tanks, rare Betta show strains, Japanese koi ponds, and misting rainforest terrariums.",
    path: "/gallery",
  });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-10">
          <span className="text-[11px] font-bold text-cyan-400 tracking-[0.2em] uppercase block mb-1.5">
            PORTFOLIO
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            Aquascapes &amp; Living Art
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            A visual showcase of turnkey planted aquariums, exotic livestock quarantine facilities, and custom biotope installations curated by CBR AQUA CULTURE.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {galleryItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className={`group relative rounded-2xl overflow-hidden bg-[#0c1622] border border-[#172838] ${item.span}`}
            >
              <div className="w-full h-72 md:h-full min-h-[280px]">
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#070e15] via-[#070e15]/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block mb-1">
                  {item.category}
                </span>
                <h3 className="text-base font-bold text-white leading-tight">
                  {item.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Lookbook;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, MessageSquare, ShieldCheck, HeartHandshake, Truck, Droplets } from "lucide-react";
import Layout from "@/components/layout/Layout";
import ShopProductCard from "@/components/shop/ShopProductCard";
import { products as fallbackProducts, CATEGORIES } from "@/data/products";
import { useAdmin } from "@/contexts/AdminContext";
import { useSEO } from "@/hooks/use-seo";

const heroSlides = [
  {
    image: "https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?auto=format&fit=crop&w=1920&q=85",
    tag: "New arrivals every week",
    h1Part1: "Rare fish, ",
    h1Highlight: "reef-clean",
    h1Part2: "water, done right.",
    subtitle: "CBR AQUA CULTURE curates ornamental fish, koi, planted aquascapes and pro-grade hardware — hand-selected by aquarists, delivered with a live-arrival promise.",
  },
  {
    image: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=1920&q=85",
    tag: "Custom Planted Aquariums",
    h1Part1: "Living art for ",
    h1Highlight: "modern spaces",
    h1Part2: "engineered to thrive.",
    subtitle: "Turnkey nature aquascapes, terrariums, and precision CO2 hardware installed and supported by professional aquarists.",
  },
];

const categoryCards = [
  {
    id: "ornamental-fish",
    name: "Live Ornamental Fish",
    subtitle: "Bettas, Koi, Discus & Tetras",
    image: "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&w=800&q=80",
    link: "/shop?category=ornamental-fish",
  },
  {
    id: "aquarium-plants",
    name: "Planted Aquascapes",
    subtitle: "Anubias, Rotala & Mosses",
    image: "https://images.unsplash.com/photo-1584282479905-24d1933a32dc?auto=format&fit=crop&w=800&q=80",
    link: "/shop?category=aquarium-plants",
  },
  {
    id: "filters",
    name: "Canister Filters & Tech",
    subtitle: "Sunsun, Wavemakers & Heaters",
    image: "https://images.unsplash.com/photo-1546026423-cc4642628d2b?auto=format&fit=crop&w=800&q=80",
    link: "/shop?category=filters",
  },
  {
    id: "turtles",
    name: "Turtles & Amphibians",
    subtitle: "Red-Eared Sliders & Exotic Pets",
    image: "https://images.unsplash.com/photo-1437622368342-7a3d73a34c8f?auto=format&fit=crop&w=800&q=80",
    link: "/shop?category=turtles",
  },
  {
    id: "fish-food",
    name: "Nutrition & Fish Food",
    subtitle: "Color Pellets & Spirulina",
    image: "https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?auto=format&fit=crop&w=800&q=80",
    link: "/shop?category=fish-food",
  },
];

const Index = () => {
  const { adminProducts, isLoading } = useAdmin();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slide = heroSlides[currentSlide];

  // Pick top products
  const products = adminProducts && adminProducts.length > 0 ? adminProducts : fallbackProducts;
  const featuredProducts = products.slice(0, 6);

  useSEO({
    title: "CBR AQUA CULTURE — Rare Fish, Reef-Clean Water, Done Right",
    description: "CBR AQUA CULTURE curates ornamental fish, koi, planted aquascapes, terrariums, and pro-grade aquarium hardware delivered with a live-arrival promise.",
    path: "/",
  });

  return (
    <Layout noPaddingTop>
      {/* Hero Section (Recreated from Screenshot 2) */}
      <section className="relative min-h-[90vh] md:min-h-screen flex items-center overflow-hidden bg-[#070e15]">
        {/* Aquarium Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src={slide.image}
            alt="Planted nature aquarium"
            className="w-full h-full object-cover transition-all duration-700 brightness-[0.78]"
          />
          {/* Deep dark gradient overlays to guarantee text legibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#070e15] via-[#070e15]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#070e15] via-transparent to-[#070e15]/40" />
        </div>

        {/* Hero Content Container */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-16 md:pt-36 md:pb-24 w-full">
          <div className="max-w-2xl">
            {/* Pill Tag (Matches Screenshot 2) */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 mb-6 backdrop-blur-md shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>{slide.tag}</span>
            </div>

            {/* Headline with Cyan Highlight (Matches Screenshot 2) */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-5">
              {slide.h1Part1}
              <span className="text-[#00c8f8]">{slide.h1Highlight}</span>
              <br />
              {slide.h1Part2}
            </h1>

            {/* Subtitle */}
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl mb-8 font-normal">
              {slide.subtitle}
            </p>

            {/* CTA Buttons Row (Matches Screenshot 2) */}
            <div className="flex flex-wrap items-center gap-3.5 sm:gap-4 mb-12">
              <Link
                to="/shop"
                className="bg-[#00c8f8] hover:bg-cyan-300 active:scale-95 text-slate-950 font-bold px-7 py-3 rounded-full text-sm inline-flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/25"
              >
                <span>Shop now</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <button
                type="button"
                onClick={() => {
                  window.open(
                    "https://wa.me/919481816563?text=Hello%20CBR%20AQUA%20team,%20I%20would%20like%20to%20chat%20with%20an%20aquarist%20expert.",
                    "_blank"
                  );
                }}
                className="bg-[#0e1c2a]/80 hover:bg-[#14283c] border border-slate-700/80 hover:border-cyan-400/60 text-white font-medium px-6 py-3 rounded-full text-sm inline-flex items-center gap-2 backdrop-blur-sm transition-all"
              >
                <MessageSquare className="w-4 h-4 text-cyan-400" />
                <span>Chat with an expert</span>
              </button>
            </div>

            {/* Metrics / Stats Row (Matches Screenshot 2) */}
            <div className="flex items-center gap-8 sm:gap-12 pt-6 border-t border-slate-800/80">
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-white block leading-tight">
                  500+
                </span>
                <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">
                  SPECIES
                </span>
              </div>
              <div className="w-[1px] h-8 bg-slate-800" />
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-white block leading-tight">
                  7 yrs
                </span>
                <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">
                  IN BUSINESS
                </span>
              </div>
              <div className="w-[1px] h-8 bg-slate-800" />
              <div>
                <span className="text-2xl sm:text-3xl font-extrabold text-[#00c8f8] block leading-tight">
                  4.9★
                </span>
                <span className="text-[10px] font-bold tracking-[0.2em] text-slate-400 uppercase">
                  RATED
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel Slider Dot Indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
          {heroSlides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`transition-all rounded-full ${
                currentSlide === i
                  ? "w-7 h-2 bg-[#00c8f8]"
                  : "w-2 h-2 bg-slate-600 hover:bg-slate-400"
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </section>

      {/* Featured Categories Section (Recreated from Screenshot 2) */}
      <section className="py-14 sm:py-20 bg-[#070e15] border-t border-[#172838]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Row */}
          <div className="flex items-end justify-between mb-8 sm:mb-10">
            <div>
              <span className="text-[10px] font-extrabold text-cyan-400 tracking-[0.25em] uppercase block mb-1">
                EXPLORE
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Featured categories
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-xs sm:text-sm font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1.5 transition-colors"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Categories Grid (Matches Screenshot 2) */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-5">
            {categoryCards.map((cat) => (
              <Link
                key={cat.id}
                to={cat.link}
                className="group relative rounded-2xl bg-[#0c1622] border border-[#172838] overflow-hidden hover:border-cyan-500/50 hover:shadow-xl hover:shadow-cyan-950/20 transition-all duration-300 flex flex-col"
              >
                <div className="aspect-[4/3] w-full overflow-hidden bg-[#070e15]">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                      {cat.subtitle}
                    </p>
                  </div>
                  <span className="text-[11px] font-semibold text-cyan-400 mt-2.5 inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore items →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section (Matches Screenshot 1 Grid) */}
      <section className="py-14 sm:py-20 bg-[#0a121c] border-t border-[#172838]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8 sm:mb-10">
            <div>
              <span className="text-[10px] font-extrabold text-cyan-400 tracking-[0.25em] uppercase block mb-1">
                TOP PICKS
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Trending in stock
              </h2>
            </div>
            <Link
              to="/shop"
              className="text-xs sm:text-sm font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1.5 transition-colors"
            >
              <span>Explore full shop</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredProducts.map((p) => (
              <ShopProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Why CBR AQUA CULTURE Trust Section */}
      <section className="py-16 sm:py-24 bg-[#070e15] border-t border-[#172838]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-[10px] font-extrabold text-cyan-400 tracking-[0.25em] uppercase block mb-1">
              THE CBR PROMISE
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-3">
              Aquarists first, sellers second
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Every live animal and planted piece is handled with biological precision so your tank stays healthy, balanced, and stunning.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-[#0c1622] border border-[#172838]">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1.5">100% Live Arrival Guarantee</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Oxygen-boosted medical transport bags inside temperature-regulated thermocol boxes with 48h thermal heat/ice packs.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0c1622] border border-[#172838]">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1.5">14-Day Quarantine</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Every fish undergoes prophylactic treatment and behavioral observation before dispatch to guarantee parasite-free delivery.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0c1622] border border-[#172838]">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
                <Droplets className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1.5">Custom Aquascapes</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Turnkey Iwagumi and Nature Aquarium layouts custom built for homes, offices, and luxury spaces.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#0c1622] border border-[#172838]">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
                <Truck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1.5">Pan-India Express</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Fast air-express priority transit ensuring livestock spends the minimum possible hours in transit.
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;

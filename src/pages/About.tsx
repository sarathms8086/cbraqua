import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useSEO } from "@/hooks/use-seo";
import { Sparkles, ShieldCheck, Heart, Award, ArrowRight } from "lucide-react";

const About = () => {
  useSEO({
    title: "About Us — CBR AQUA CULTURE",
    description: "CBR AQUA CULTURE curates rare ornamental fish, imported Japanese koi, nature aquascapes, and professional aquarium supplies.",
    path: "/about",
  });

  return (
    <Layout>
      {/* Hero */}
      <div className="relative h-[50vh] md:h-[60vh] overflow-hidden bg-[#070e15]">
        <img
          src="https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?auto=format&fit=crop&w=1920&q=80"
          alt="CBR AQUA facility"
          className="w-full h-full object-cover brightness-[0.7]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070e15] via-[#070e15]/60 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div>
            <span className="text-[10px] font-bold text-cyan-400 tracking-[0.25em] uppercase block mb-2">
              OUR JOURNEY &amp; VALUES
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">
              CBR AQUA CULTURE
            </h1>
          </div>
        </div>
      </div>

      {/* Story */}
      <div className="px-4 md:px-8 py-16 md:py-20 max-w-4xl mx-auto text-white">
        <div className="space-y-8">
          <div>
            <h2 className="text-[11px] font-bold tracking-[0.25em] uppercase text-cyan-400 mb-3">
              The Mission
            </h2>
            <p className="text-base md:text-lg text-slate-200 leading-relaxed font-medium">
              CBR AQUA CULTURE was founded with a singular conviction: that living aquariums are nature’s finest kinetic art. We bridge the gap between commercial aquaculture and high-end botanical aquascaping, supplying certified healthy livestock, pristine tissue-culture plants, and pro-grade hardware to aquarists across India.
            </p>
          </div>

          <div>
            <h2 className="text-[11px] font-bold tracking-[0.25em] uppercase text-cyan-400 mb-3">
              Quarantine &amp; Biosecurity Standard
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Every live ornamental fish and turtle entering our facilities undergoes a mandatory 14-day observation and prophylactic quarantine in isolated UV-sterilized raceways. Our strict biosecurity prevents pathogens from ever reaching your home display tanks, backing every specimen with our 100% Live Arrival Guarantee.
            </p>
          </div>
        </div>
      </div>

      {/* Values Grid */}
      <div className="px-4 md:px-8 py-14 bg-[#0a121c] border-t border-[#172838]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="p-6 rounded-2xl bg-[#0c1622] border border-[#172838]">
            <Award className="w-6 h-6 text-cyan-400 mb-4" />
            <h3 className="text-sm font-bold text-white mb-2">Species Authenticity</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Certified Japanese bloodline Koi, wild-type dwarf Plecos, and show-grade Halfmoon Bettas with verified strain purity.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0c1622] border border-[#172838]">
            <ShieldCheck className="w-6 h-6 text-cyan-400 mb-4" />
            <h3 className="text-sm font-bold text-white mb-2">100% Live Arrival Promise</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Specially engineered packaging using pure medical-grade oxygen, activated carbon sachets, and seasonal thermal climate packs.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#0c1622] border border-[#172838]">
            <Heart className="w-6 h-6 text-cyan-400 mb-4" />
            <h3 className="text-sm font-bold text-white mb-2">Aquarist Support</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Lifetime guidance for cycling, water parameter testing, algae remediation, and compatible species pairing via direct WhatsApp.
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-[#00c8f8] hover:bg-cyan-300 text-slate-950 px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/20"
          >
            <span>Explore our catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default About;

import Layout from "@/components/layout/Layout";
import { useSEO } from "@/hooks/use-seo";
import { Droplets, Sparkles, ShieldCheck, Wrench, MessageSquare, CheckCircle2 } from "lucide-react";

const services = [
  {
    title: "Turnkey Planted Aquascapes",
    description: "Complete design, custom tank fabrication, hardscape assembly (Seiryu Stone, Dragon Stone, Driftwood), CO2 system installation, and plant planting.",
    icon: Droplets,
    features: [
      "Custom rimless ultra-clear opti-white glass tanks",
      "Precision twin-gauge solenoid CO2 injection",
      "Full spectrum app-controlled RGB LED lighting",
      "1-month complimentary biological stabilization",
    ],
  },
  {
    title: "Bespoke Rainforest Terrariums",
    description: "Automated vivariums and paludariums featuring tropical mosses, bromeliads, automated monsoon misting systems, and mini waterfalls.",
    icon: Sparkles,
    features: [
      "Automated timed ultrasonic misting cycles",
      "Real living tropical moss walls & epiphytes",
      "Integrated waterfall & bio-active drainage layer",
      "Ideal for dart frogs, micro geckos, and rare flora",
    ],
  },
  {
    title: "Aquarium Maintenance & Water Balancing",
    description: "Professional routine maintenance for high-end residential, hotel, and corporate aquariums to ensure zero algae and perfect water chemistry.",
    icon: Wrench,
    features: [
      "Comprehensive digital test parameter report (pH, TDS, NO3, PO4)",
      "Plant trimming, shaping & organic debris vacuuming",
      "Canister filter media backwash and UV replacement",
      "Livestock health screening and prophylactic quarantine",
    ],
  },
  {
    title: "Outdoor Japanese Koi Pond Design",
    description: "Large scale biologically engineered outdoor ponds featuring multi-chamber bottom-drain vortex filtration, drum filters, and certified Japanese koi.",
    icon: ShieldCheck,
    features: [
      "Multi-stage mechanical drum and moving bed bio-filters",
      "Bottom aerated drains to eliminate sludge settling",
      "High volume low-wattage DC circulation pumps",
      "Quarantined Japanese bloodline koi stocking",
    ],
  },
];

const Services = () => {
  useSEO({
    title: "Aquascaping & Maintenance Services — CBR AQUA CULTURE",
    description: "Custom nature aquascapes, rainforest terrariums, routine tank maintenance, and Japanese koi pond construction by CBR AQUA CULTURE.",
    path: "/services",
  });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[11px] font-bold text-cyan-400 tracking-[0.2em] uppercase block mb-1.5">
            OUR EXPERTISE
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
            Aquascaping &amp; Living Architecture
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            From high-tech planted aquariums in private residences to grand Japanese koi ponds, our certified aquatic engineers create balanced ecosystems that thrive for decades.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          {services.map((svc) => {
            const Icon = svc.icon;
            return (
              <div
                key={svc.title}
                className="rounded-2xl bg-[#0c1622] border border-[#172838] p-6 sm:p-7 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="w-11 h-11 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-5">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{svc.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-6">{svc.description}</p>

                  <ul className="space-y-2.5 mb-6">
                    {svc.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    const text = encodeURIComponent(`Hello CBR AQUA team, I am interested in inquiring about ${svc.title}.`);
                    window.open(`https://wa.me/919481816563?text=${text}`, "_blank");
                  }}
                  className="w-full bg-[#111e2c] hover:bg-[#162738] border border-[#1d3347] hover:border-cyan-400 text-cyan-300 hover:text-white py-2.5 rounded-full text-xs font-bold transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Request consultation &amp; quote</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};

export default Services;

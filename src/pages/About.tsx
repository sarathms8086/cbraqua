import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useSEO } from "@/hooks/use-seo";
import aboutHero from "@/assets/dany-wens/about-hero.jpg";
import mosaic3 from "@/assets/dany-wens/mosaic-3.jpg";

const About = () => {
  useSEO({
    title: "Our Story",
    description: "DANYWENS was founded to bridge luxury craftsmanship and everyday wearability — premium fabrics, heavyweight construction, designed to last.",
    path: "/about",
  });

  return (
    <Layout>
      {/* Hero */}
      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <img src={aboutHero} alt="DANYWENS studio" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="text-4xl md:text-6xl font-heading tracking-tight text-background drop-shadow-lg">
            OUR STORY
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 md:px-8 py-16 md:py-24 max-w-4xl mx-auto">
        <div className="space-y-8">
          <div>
            <h2 className="text-[11px] font-semibold tracking-[0.3em] uppercase text-muted-foreground mb-4">The Brand</h2>
            <p className="text-lg md:text-xl leading-relaxed">
              DANYWENS was founded with a singular vision: to create contemporary streetwear that
              bridges the gap between luxury craftsmanship and everyday wearability. Every piece
              in our collection is designed with intention and built to last.
            </p>
          </div>
          <div>
            <h2 className="text-[11px] font-semibold tracking-[0.3em] uppercase text-muted-foreground mb-4">Our Approach</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We work directly with premium fabric mills to source the highest quality materials.
              Our heavyweight cotton is custom-developed, our French terry is brushed in-house,
              and every garment goes through rigorous quality control. We believe in fewer, better
              pieces — not fast fashion cycles.
            </p>
          </div>
        </div>
      </div>

      {/* Full bleed image */}
      <div className="h-[50vh] overflow-hidden">
        <img src={mosaic3} alt="Fabric detail" className="w-full h-full object-cover" />
      </div>

      {/* Values */}
      <div className="px-4 md:px-8 py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          {[
            { title: "Quality First", desc: "Premium fabrics, heavyweight construction. Every detail matters." },
            { title: "Made to Last", desc: "Garments designed to age beautifully, not end up in landfill." },
            { title: "Designed Here", desc: "Conceived and developed in our studio. No shortcuts." },
          ].map((v) => (
            <div key={v.title} className="text-center">
              <h3 className="text-sm font-semibold tracking-[0.15em] uppercase mb-3">{v.title}</h3>
              <p className="text-sm text-muted-foreground">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-primary text-primary-foreground py-16 text-center">
        <h2 className="text-2xl md:text-3xl font-heading tracking-tight mb-4">Explore the Collection</h2>
        <Link
          to="/shop"
          className="inline-block border border-primary-foreground px-10 py-3 text-xs font-semibold tracking-[0.2em] uppercase hover:bg-primary-foreground hover:text-primary transition-colors"
        >
          Shop Now
        </Link>
      </div>
    </Layout>
  );
};

export default About;

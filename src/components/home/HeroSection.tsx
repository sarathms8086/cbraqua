import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="relative h-[85vh] md:h-[90vh] overflow-hidden bg-primary">
      {/* Background image placeholder */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/80 to-primary" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-4 text-center">
        <p
          className="animate-hero-fade text-primary-foreground/60 text-xs tracking-[0.4em] uppercase font-mono mb-6"
        >
          Spring / Summer 2026
        </p>

        <h2
          className="animate-hero-fade text-primary-foreground text-5xl md:text-8xl lg:text-9xl font-heading tracking-tight leading-[0.9] mb-8"
          style={{ animationDelay: "0.2s" }}
        >
          THE NEW
          <br />
          ARCHIVE
        </h2>

        <div className="animate-hero-fade" style={{ animationDelay: "0.5s" }}>
          <Link
            to="/shop"
            className="inline-block bg-primary-foreground text-primary px-12 py-4 text-xs font-semibold tracking-[0.2em] uppercase hover:bg-primary-foreground/90 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

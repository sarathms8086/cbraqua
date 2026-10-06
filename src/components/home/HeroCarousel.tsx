import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import collectionSS26 from "@/assets/dany-wens/collection-ss26.jpg";
import collectionAW25 from "@/assets/dany-wens/collection-aw25.jpg";
import mosaic1 from "@/assets/dany-wens/mosaic-1.jpg";

const slides = [
  {
    image: collectionSS26,
    subtitle: "SS26 COLLECTION",
    heading: "THE NEW ARCHIVE",
    cta: "SHOP NOW",
    link: "/shop?collection=ss26",
  },
  {
    image: collectionAW25,
    subtitle: "AW25 COLLECTION",
    heading: "BUILT FOR THE COLD",
    cta: "SHOP NOW",
    link: "/shop?collection=aw25",
  },
  {
    image: mosaic1,
    subtitle: "ESSENTIALS",
    heading: "TIMELESS BASICS",
    cta: "SHOP NOW",
    link: "/shop",
  },
];

const HeroCarousel = () => {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, 5000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <section className="relative w-full min-h-[100dvh] h-screen overflow-hidden bg-foreground">
      {/* Background slides — stack and cross-fade with CSS transitions */}
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${i === current ? "opacity-100" : "opacity-0"}`}
        >
          <img
            src={s.image}
            alt={s.heading}
            loading={i === 0 ? "eager" : "lazy"}
            // @ts-ignore
            fetchPriority={i === 0 ? "high" : undefined}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-foreground/30" />
        </div>
      ))}

      {/* Content — each slide fades + slides with CSS transition */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-4">
        {slides.map((s, i) => (
          <div
            key={i}
            className={`absolute flex flex-col items-center transition-all duration-500 ease-out ${
              i === current ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5 pointer-events-none"
            }`}
          >
            <p className="text-[10px] md:text-xs tracking-[0.4em] uppercase font-mono text-background/70 mb-4">
              {s.subtitle}
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-8xl font-heading tracking-tight text-background mb-8 leading-[0.9]">
              {s.heading}
            </h1>
            <Link
              to={s.link}
              className="inline-block border border-background text-background px-10 py-4 text-[10px] md:text-xs font-semibold tracking-[0.25em] uppercase hover:bg-background hover:text-foreground transition-colors duration-300"
            >
              {s.cta}
            </Link>
          </div>
        ))}
      </div>

      {/* Slide indicators - min 44px touch target */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`min-w-11 min-h-11 flex items-center justify-center p-2 transition-colors duration-300 ${
              i === current ? "bg-background/20" : "bg-background/5"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          >
            <span
              className={`block w-8 h-0.5 transition-colors duration-300 ${
                i === current ? "bg-background" : "bg-background/30"
              }`}
            />
          </button>
        ))}
      </div>
    </section>
  );
};

export default HeroCarousel;

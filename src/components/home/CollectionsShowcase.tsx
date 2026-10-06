import { useState } from "react";
import { Link } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import mosaic4 from "@/assets/dany-wens/mosaic-4.jpg";

const CollectionsShowcase = () => {
  const { adminCollections } = useAdmin();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-foreground">
      {/* Background image */}
      <img
        src={mosaic4}
        alt="Collections"
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover opacity-30"
      />
      <div className="absolute inset-0 bg-foreground/60" />

      {/* Content */}
      <div className="relative z-10 text-center py-20 px-4 w-full max-w-4xl">
        <p className="text-[10px] md:text-xs tracking-[0.4em] uppercase font-mono text-background/50 mb-12">
          EXPLORE COLLECTIONS
        </p>

        <div className="space-y-3 md:space-y-4 mb-16">
          {adminCollections.filter(c => c.visible).map((col, i) => (
            <Link
              key={col.id}
              to={`/shop?collection=${col.slug}`}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              className={`block text-3xl md:text-6xl lg:text-8xl font-heading tracking-tight uppercase transition-all duration-300 ${
                hoveredIndex === null
                  ? "text-background/80"
                  : hoveredIndex === i
                  ? "text-background scale-105"
                  : "text-background/20"
              }`}
            >
              {col.name}
            </Link>
          ))}
        </div>

        <Link
          to="/collections"
          className="inline-block border border-background text-background px-10 py-4 text-[10px] md:text-xs font-semibold tracking-[0.25em] uppercase hover:bg-background hover:text-foreground transition-colors duration-300"
        >
          DISCOVER
        </Link>
      </div>
    </section>
  );
};

export default CollectionsShowcase;

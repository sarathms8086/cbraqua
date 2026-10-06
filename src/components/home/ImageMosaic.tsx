import { Link } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";

const ImageMosaic = () => {
  const { mosaicTiles } = useAdmin();
  const visibleTiles = mosaicTiles.filter(t => t.visible);

  if (visibleTiles.length === 0) return null;

  return (
    <section className="grid grid-cols-2 md:grid-cols-7 gap-[3px] bg-border">
      {visibleTiles.map((tile, index) => (
        <div
          key={tile.id || index}
          className={`animate-fade-in ${tile.colSpan || "col-span-1"} ${tile.rowSpan || "row-span-1"} ${tile.mobileColSpan || ""} ${tile.mobileRowSpan || ""}`}
          style={{ animationDelay: `${index * 0.08}s` }}
        >
          {tile.type === "image" ? (
            <Link to={tile.link || "/shop"} className="group relative block h-full overflow-hidden aspect-[3/4] md:aspect-auto">
              <img
                src={tile.image}
                alt={tile.alt || ""}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading={index < 3 ? "eager" : "lazy"}
                // @ts-ignore
                fetchPriority={index < 3 ? "high" : undefined}
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/20 transition-colors duration-300" />
              {/* Label */}
              {tile.label && (
                <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                  <span className="text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase text-background drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
                    {tile.label}
                  </span>
                </div>
              )}
            </Link>
          ) : (
            <Link
              to={tile.ctaLink || "/shop"}
              className="group flex flex-col items-center justify-center h-full bg-primary text-primary-foreground p-5 md:p-12 text-center min-h-[280px] md:min-h-[300px]"
            >
              <p className="text-[9px] md:text-[10px] tracking-[0.3em] md:tracking-[0.4em] uppercase font-mono text-primary-foreground/50 mb-3 md:mb-4">
                {tile.subtitle}
              </p>
              <h2 className="text-xl md:text-4xl lg:text-5xl font-heading tracking-tight leading-[0.9] mb-3 md:mb-4">
                {tile.heading}
              </h2>
              <p className="text-xs md:text-sm text-primary-foreground/60 mb-8 max-w-xs">
                {tile.tagline}
              </p>
              <span className="inline-block border border-primary-foreground px-8 py-3 text-[10px] md:text-xs font-semibold tracking-[0.2em] uppercase group-hover:bg-primary-foreground group-hover:text-primary transition-colors duration-300">
                {tile.ctaText}
              </span>
            </Link>
          )}
        </div>
      ))}
    </section>
  );
};

export default ImageMosaic;

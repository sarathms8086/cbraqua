import { Link } from "react-router-dom";

const categories = [
  { label: "T-SHIRTS & TOPS", href: "/shop?category=tshirts", image: "/placeholder.svg" },
  { label: "HOODIES & SWEATS", href: "/shop?category=hoodies", image: "/placeholder.svg" },
  { label: "BOTTOMS", href: "/shop?category=bottoms", image: "/placeholder.svg" },
];

const CategoryBanner = () => {
  return (
    <section className="px-4 md:px-8 py-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {categories.map((cat, index) => (
          <div
            key={cat.label}
            className="animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <Link to={cat.href} className="group relative block aspect-[4/5] overflow-hidden bg-secondary">
              <img
                src={cat.image}
                alt={cat.label}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-primary/40 group-hover:bg-primary/30 transition-colors duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-primary-foreground text-lg md:text-xl font-heading tracking-[0.1em]">
                  {cat.label}
                </h3>
                <span className="inline-block mt-2 text-[10px] text-primary-foreground/70 tracking-[0.2em] uppercase border-b border-primary-foreground/30 pb-0.5">
                  Shop Now
                </span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CategoryBanner;

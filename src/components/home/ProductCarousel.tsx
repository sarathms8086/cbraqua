import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import type { Product } from "@/data/products";
import { formatPrice } from "@/lib/price";

interface ProductCarouselProps {
  products: Product[];
  title?: string;
}

const ProductCarousel = ({ products, title }: ProductCarouselProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - (scrollRef.current?.offsetLeft || 0));
    setScrollLeft(scrollRef.current?.scrollLeft || 0);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    scrollRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <section className="py-10 md:py-16">
      {title && (
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-4xl lg:text-5xl font-heading tracking-tight">
            {title}
          </h2>
        </div>
      )}

      <div
        ref={scrollRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className={`flex gap-3 md:gap-4 overflow-x-auto overscroll-x-contain no-scrollbar px-4 md:px-8 snap-x snap-mandatory ${
          isDragging ? "cursor-grabbing select-none" : "cursor-grab"
        }`}
      >
        {products.map((product) => (
          <ProductCarouselCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};

const ProductCarouselCard = ({ product }: { product: Product }) => {
  const [colorIndex, setColorIndex] = useState(0);
  const currentColor = product.colors[colorIndex];

  if (!currentColor) return null;

  return (
    <div className="flex-shrink-0 w-[200px] md:w-[260px] snap-start">
      <Link
        to={`/product/${product.slug}`}
        className="group block"
        draggable={false}
      >
        {/* Image */}
        <div className="relative aspect-[3/4] bg-secondary overflow-hidden mb-3">
          <img
            src={currentColor.image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            draggable={false}
          />

          {product.isNew && (
            <span className="absolute top-3 left-3 text-[9px] font-semibold tracking-[0.15em] uppercase bg-foreground text-background px-2 py-1">
              NEW
            </span>
          )}

          {product.soldOut && (
            <span className="absolute top-3 left-3 text-[9px] font-semibold tracking-[0.15em] uppercase bg-sold-out text-accent-foreground px-2 py-1">
              SOLD OUT
            </span>
          )}

          {!product.soldOut && (
            <button className="absolute bottom-3 right-3 w-8 h-8 bg-foreground text-background flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <Plus size={14} />
            </button>
          )}
        </div>

        {/* Info */}
        <div className="space-y-1">
          <h3 className="text-xs font-semibold uppercase tracking-[0.05em] truncate">
            {product.name}
          </h3>
          <p className="text-[10px] text-muted-foreground tracking-wider uppercase">
            {currentColor.name}
          </p>
          <p className="text-xs font-mono">{formatPrice(product.price)}</p>
        </div>
      </Link>

      {/* Color swatches */}
      {product.colors.length > 1 && (
        <div className="flex gap-1.5 mt-2">
          {product.colors.map((color, i) => (
            <button
              key={color.name}
              onClick={() => setColorIndex(i)}
              className={`w-3 h-3 rounded-full border transition-all ${
                i === colorIndex
                  ? "border-foreground scale-110"
                  : "border-border"
              }`}
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCarousel;

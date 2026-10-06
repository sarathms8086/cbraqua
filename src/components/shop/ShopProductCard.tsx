import { Link, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Product } from "@/data/products";
import { useState } from "react";
import { formatPrice } from "@/lib/price";
import { normalizeImageUrl } from "@/lib/productGallery";

interface ShopProductCardProps {
  product: Product;
}

const ShopProductCard = ({ product }: ShopProductCardProps) => {
  const [colorIndex, setColorIndex] = useState(0);
  const currentColor = product.colors[colorIndex];
  const navigate = useNavigate();

  if (!currentColor) return null;

  return (
    <div className="group">
      {/* Image */}
      <Link to={`/product/${product.slug}`} className="relative block bg-secondary overflow-hidden aspect-[3/4]">
        <img
          src={normalizeImageUrl(currentColor.image)}
          alt={`${product.name} in ${currentColor.name}`}
          className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
            product.category !== "bottoms" ? "object-top" : "object-center"
          }`}
          style={{ filter: "blur(0.6px) contrast(1.04)" }}
          loading="lazy"
        />
        {product.isNew && (
          <span className="absolute top-3 left-3 bg-foreground text-background text-[9px] font-semibold tracking-[0.15em] uppercase px-2.5 py-1">
            New
          </span>
        )}
        {product.soldOut && (
          <span className="absolute top-3 left-3 bg-sold-out text-background text-[9px] font-semibold tracking-[0.15em] uppercase px-2.5 py-1">
            Sold Out
          </span>
        )}
        {/* Quick add - visible on touch, hover-reveal on desktop */}
        {!product.soldOut && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              navigate(`/product/${product.slug}`);
            }}
            className="absolute bottom-3 right-3 min-w-11 min-h-11 flex items-center justify-center bg-background/90 backdrop-blur-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200 hover:bg-background touch-manipulation"
            aria-label="View product"
          >
            <Plus className="h-4 w-4 text-foreground" />
          </button>
        )}
      </Link>

      {/* Info */}
      <div className="mt-3 space-y-1">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-0.5">
          <Link to={`/product/${product.slug}`} className="text-xs font-semibold uppercase tracking-[0.05em] hover:text-muted-foreground transition-colors leading-tight line-clamp-1 min-w-0">
            {product.name}
          </Link>
          <span className="text-xs font-semibold shrink-0 text-muted-foreground sm:text-foreground">{formatPrice(product.price)}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-muted-foreground">{currentColor.name}</span>
          {product.colors.length > 1 && (
            <>
              <span className="text-[11px] text-muted-foreground">·</span>
              <div className="flex items-center gap-1">
                {product.colors.map((c, i) => (
                  <button
                    key={c.name}
                    onClick={() => setColorIndex(i)}
                    className={`w-3 h-3 rounded-full border transition-all ${
                      i === colorIndex ? "border-foreground scale-110" : "border-border"
                    }`}
                    style={{ backgroundColor: c.hex }}
                    aria-label={c.name}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopProductCard;

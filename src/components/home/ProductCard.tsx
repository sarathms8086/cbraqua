import { Link } from "react-router-dom";
import { formatPrice } from "@/lib/price";
import BlurImage from "@/components/ui/BlurImage";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  image: string;
  hoverImage?: string;
  category?: string;
  soldOut?: boolean;
}

const ProductCard = ({ id, name, price, discountPrice, image, hoverImage, category, soldOut }: ProductCardProps) => {
  return (
    <Link to={`/product/${id}`} className="group block">
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-secondary mb-3">
        <BlurImage
          src={image}
          alt={name}
          className={`absolute inset-0 transition-opacity duration-500 ${hoverImage ? "group-hover:opacity-0" : ""}`}
        />
        {hoverImage && (
          <BlurImage
            src={hoverImage}
            alt={`${name} alternate`}
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
        )}
        
        {soldOut && (
          <div className="absolute top-3 left-3 bg-sold-out text-accent-foreground px-3 py-1 text-[10px] font-bold tracking-[0.15em] uppercase">
            Sold Out
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-1">
        {category && (
          <p className="text-[10px] text-muted-foreground tracking-[0.2em] uppercase">{category}</p>
        )}
        <h3 className="text-sm font-semibold uppercase tracking-[0.05em]">{name}</h3>
        <div className="flex items-center gap-2">
          {discountPrice ? (
            <>
              <span className="text-sm font-mono text-sold-out">{formatPrice(discountPrice)}</span>
              <span className="text-sm font-mono text-muted-foreground line-through">{formatPrice(price)}</span>
            </>
          ) : (
            <span className="text-sm font-mono">{formatPrice(price)}</span>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;

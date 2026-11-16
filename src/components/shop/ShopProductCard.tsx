import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingBag, Check } from "lucide-react";
import { Product } from "@/data/products";
import { useState } from "react";
import { formatPrice } from "@/lib/price";
import { useCart } from "@/components/cart/CartContext";
import { toast } from "sonner";

interface ShopProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
}

const ShopProductCard = ({ product, onQuickView }: ShopProductCardProps) => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const primaryColor = product.colors?.[0];
  const image = primaryColor?.image || "https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?auto=format&fit=crop&w=800&q=80";
  const stockCount = product.stock || 25;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      size: product.sizes?.[0] || "Standard",
      color: primaryColor?.name || "Default",
      image,
    });

    setAdded(true);
    toast.success(`Added ${product.name} to cart`);
    setTimeout(() => setAdded(false), 1500);
  };

  const handleQuickViewClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    } else {
      navigate(`/product/${product.slug}`);
    }
  };

  return (
    <div className="group rounded-2xl bg-[#0c1622] border border-[#172838] p-3 hover:border-cyan-500/40 hover:shadow-xl hover:shadow-cyan-950/20 transition-all duration-300 flex flex-col justify-between">
      <div>
        {/* Product Image Container */}
        <Link
          to={`/product/${product.slug}`}
          className="relative block w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#070e15]"
        >
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />

          {/* Featured Pill Badge (Matches Screenshot) */}
          {product.featured && (
            <span className="absolute top-2.5 left-2.5 bg-[#00c8f8] text-slate-950 text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md">
              FEATURED
            </span>
          )}

          {product.isNew && !product.featured && (
            <span className="absolute top-2.5 left-2.5 bg-emerald-400 text-slate-950 text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md">
              NEW
            </span>
          )}
        </Link>

        {/* Product Info */}
        <div className="mt-3">
          <Link
            to={`/product/${product.slug}`}
            className="text-sm font-semibold text-white group-hover:text-cyan-300 transition-colors line-clamp-1 block"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Price & Stock Row (Matches Screenshot: e.g. "₹490 60 in stock") */}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm sm:text-base font-bold text-white">
              {formatPrice(product.price)}
            </span>
            <span className="text-[11px] sm:text-xs text-slate-400 font-normal">
              {stockCount} in stock
            </span>
          </div>
        </div>
      </div>

      {/* Action Buttons Row (Matches Screenshot) */}
      <div className="mt-3.5 flex items-center gap-2">
        <button
          type="button"
          onClick={handleAddToCart}
          className={`flex-1 h-9 rounded-full text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm ${
            added
              ? "bg-[#00d796] text-slate-950"
              : "bg-[#00c8f8] hover:bg-cyan-300 text-slate-950 active:scale-95 shadow-cyan-500/10"
          }`}
          aria-label={`Add ${product.name} to cart`}
        >
          {added ? (
            <>
              <Check className="w-3.5 h-3.5 stroke-[3]" /> Added
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" /> Add
            </>
          )}
        </button>

        {/* Quick View Button (Magnifying glass in rounded dark pill) */}
        <button
          type="button"
          onClick={handleQuickViewClick}
          className="w-9 h-9 rounded-full bg-[#111e2c] border border-[#1d3347] hover:border-cyan-400 text-slate-300 hover:text-cyan-300 flex items-center justify-center transition-colors shrink-0"
          aria-label={`View ${product.name} details`}
        >
          <Search className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default ShopProductCard;

import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";

// Mock data — will be replaced by Supabase data
const mockProducts = [
  { id: "1", name: "Heavyweight Blank Tee", price: 65, image: "/placeholder.svg", category: "T-Shirts" },
  { id: "2", name: "Archive Hoodie", price: 145, image: "/placeholder.svg", category: "Hoodies" },
  { id: "3", name: "Cargo Utility Pant", price: 185, image: "/placeholder.svg", category: "Bottoms" },
  { id: "4", name: "Washed Logo Cap", price: 45, image: "/placeholder.svg", category: "Accessories" },
  { id: "5", name: "Oversized Crewneck", price: 120, discountPrice: 89, image: "/placeholder.svg", category: "Sweatshirts" },
  { id: "6", name: "Track Jacket", price: 195, image: "/placeholder.svg", category: "Outerwear", soldOut: true },
  { id: "7", name: "Ribbed Tank", price: 55, image: "/placeholder.svg", category: "T-Shirts" },
  { id: "8", name: "Relaxed Short", price: 95, image: "/placeholder.svg", category: "Bottoms" },
];

const FeaturedGrid = () => {
  return (
    <section className="px-4 md:px-8 py-20">
      {/* Section header */}
      <div className="flex items-end justify-between mb-12">
        <div>
          <p className="text-[10px] text-muted-foreground tracking-[0.3em] uppercase mb-2">Featured</p>
          <h2 className="text-3xl md:text-4xl font-heading">NEW ARRIVALS</h2>
        </div>
        <Link
          to="/shop"
          className="text-[11px] font-semibold tracking-[0.15em] uppercase border-b border-foreground pb-0.5 hover:text-muted-foreground hover:border-muted-foreground transition-colors"
        >
          View All
        </Link>
      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-10 md:gap-x-6 md:gap-y-14">
        {mockProducts.map((product, index) => (
          <div
            key={product.id}
            className="animate-fade-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <ProductCard {...product} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedGrid;

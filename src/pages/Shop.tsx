import { useState, useMemo, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { SlidersHorizontal, Search, X, Check, ShoppingBag, Eye } from "lucide-react";
import Layout from "@/components/layout/Layout";
import ShopProductCard from "@/components/shop/ShopProductCard";
import { CATEGORIES, Product, products as fallbackProducts } from "@/data/products";
import { useAdmin } from "@/contexts/AdminContext";
import { useSEO } from "@/hooks/use-seo";
import { formatPrice } from "@/lib/price";
import { useCart } from "@/components/cart/CartContext";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Shop = () => {
  const { adminProducts, isLoading } = useAdmin();
  const [searchParams, setSearchParams] = useSearchParams();
  const { addItem } = useCart();

  const urlCategory = searchParams.get("category") || "all";
  const urlSearch = searchParams.get("search") || "";

  const [selectedCategory, setSelectedCategory] = useState(urlCategory);
  const [searchTerm, setSearchTerm] = useState(urlSearch);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>("");

  // Keep state synced with query params
  useEffect(() => {
    setSelectedCategory(searchParams.get("category") || "all");
    setSearchTerm(searchParams.get("search") || "");
  }, [searchParams]);

  // Use adminProducts if populated, otherwise fallbackProducts
  const allProducts: Product[] = useMemo(() => {
    if (adminProducts && adminProducts.length > 0) {
      // If products exist in admin context, merge with stock & featured flags
      return adminProducts.map((p) => {
        const fallback = fallbackProducts.find((f) => f.slug === p.slug || f.id === p.id);
        return {
          ...p,
          featured: p.isNew || fallback?.featured || false,
          stock: (p as any).stock || fallback?.stock || 25,
        };
      });
    }
    return fallbackProducts;
  }, [adminProducts]);

  // Filter products by category and search query
  const filteredProducts = useMemo(() => {
    let result = [...allProducts];

    // Category filter
    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter(
        (p) =>
          p.category?.toLowerCase() === selectedCategory.toLowerCase() ||
          p.productType?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Search query
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category?.toLowerCase().includes(q)
      );
    }

    return result;
  }, [allProducts, selectedCategory, searchTerm]);

  const handleSelectCategory = (catId: string) => {
    setSelectedCategory(catId);
    const newParams = new URLSearchParams(searchParams);
    if (catId === "all") {
      newParams.delete("category");
    } else {
      newParams.set("category", catId);
    }
    setSearchParams(newParams);
  };

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setSelectedSize(product.sizes?.[0] || "Standard");
  };

  const handleAddQuickViewToCart = () => {
    if (!quickViewProduct) return;
    const color = quickViewProduct.colors?.[0]?.name || "Default";
    const image = quickViewProduct.colors?.[0]?.image || "";
    addItem({
      productId: quickViewProduct.id,
      name: quickViewProduct.name,
      price: quickViewProduct.price,
      size: selectedSize || quickViewProduct.sizes?.[0] || "Standard",
      color,
      image,
    });
    toast.success(`Added ${quickViewProduct.name} to cart`);
    setQuickViewProduct(null);
  };

  const activeCategoryObj = CATEGORIES.find((c) => c.id === selectedCategory) || CATEGORIES[0];

  useSEO({
    title: `${activeCategoryObj.label} — CBR AQUA CULTURE`,
    description: `Shop live ornamental fish, koi, aquatic plants, canister filters and supplies at CBR AQUA CULTURE.`,
    path: "/shop",
  });

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        {/* Breadcrumb & Heading (Matches Screenshot 1) */}
        <div className="mb-8">
          <span className="text-[11px] font-bold text-cyan-400 tracking-[0.2em] uppercase block mb-1.5">
            SHOP
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            All products
          </h1>
        </div>

        {/* Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* Left Column: Filter Sidebar (Matches Screenshot 1) */}
          <aside className="w-full lg:col-span-1 rounded-2xl bg-[#0c1622] border border-[#172838] p-4 lg:sticky lg:top-24">
            {/* Search Input in Sidebar */}
            <div className="relative mb-5">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  const p = new URLSearchParams(searchParams);
                  if (e.target.value) p.set("search", e.target.value);
                  else p.delete("search");
                  setSearchParams(p);
                }}
                placeholder="Search..."
                className="w-full bg-[#070e15] border border-[#1b2c3d] text-white text-xs pl-9 pr-8 py-2 rounded-xl focus:outline-none focus:border-cyan-400 transition-colors placeholder-slate-400"
              />
              {searchTerm && (
                <button
                  onClick={() => {
                    setSearchTerm("");
                    const p = new URLSearchParams(searchParams);
                    p.delete("search");
                    setSearchParams(p);
                  }}
                  className="absolute right-2.5 top-2.5 text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Categories Header with Icon */}
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300 px-2 py-1.5 mb-2 border-b border-[#172838]/80 pb-2">
              <SlidersHorizontal className="w-3.5 h-3.5 text-cyan-400" />
              <span>Categories</span>
            </div>

            {/* Category Navigation Pills List (Matches Screenshot 1) */}
            <nav className="flex flex-col gap-1 max-h-[65vh] overflow-y-auto pr-1 custom-scrollbar">
              {CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat.id)}
                    className={`w-full text-left px-3.5 py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-between ${
                      isSelected
                        ? "bg-[#0d2232] text-cyan-300 font-bold border border-cyan-500/40 shadow-sm shadow-cyan-950"
                        : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    <span>{cat.label}</span>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />}
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Right Column: 3-Columns Product Grid (Matches Screenshot 1) */}
          <main className="w-full lg:col-span-3">
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="h-72 rounded-2xl bg-[#0c1622] border border-[#172838] animate-pulse"
                  />
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-20 rounded-2xl bg-[#0c1622] border border-[#172838] p-8">
                <p className="text-base font-semibold text-white mb-2">No products found</p>
                <p className="text-xs text-slate-400 mb-6">
                  Try adjusting your search query or selecting a different category.
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSearchTerm("");
                    setSearchParams({});
                  }}
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 px-5 py-2 rounded-full text-xs font-bold transition-all"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredProducts.map((product) => (
                  <ShopProductCard
                    key={product.id}
                    product={product}
                    onQuickView={handleQuickView}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <Dialog open={!!quickViewProduct} onOpenChange={() => setQuickViewProduct(null)}>
          <DialogContent className="max-w-2xl bg-[#0c1622] border border-[#172838] text-white p-6 rounded-3xl">
            <DialogHeader className="sr-only">
              <DialogTitle>{quickViewProduct.name}</DialogTitle>
            </DialogHeader>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              {/* Product Image */}
              <div className="aspect-[4/3] rounded-2xl overflow-hidden bg-[#070e15] border border-[#172838]">
                <img
                  src={
                    quickViewProduct.colors?.[0]?.image ||
                    "https://images.unsplash.com/photo-1520302630591-fd1c66edc19d?auto=format&fit=crop&w=800&q=80"
                  }
                  alt={quickViewProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest block mb-1">
                    {quickViewProduct.category?.replace(/-/g, " ")}
                  </span>
                  <h3 className="text-xl font-bold text-white mb-2 leading-snug">
                    {quickViewProduct.name}
                  </h3>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl font-extrabold text-cyan-300">
                      {formatPrice(quickViewProduct.price)}
                    </span>
                    <span className="text-xs text-slate-400">
                      {quickViewProduct.stock || 20} in stock
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed mb-4 line-clamp-3">
                    {quickViewProduct.description}
                  </p>

                  {/* Size / Variant Selector */}
                  {quickViewProduct.sizes && quickViewProduct.sizes.length > 0 && (
                    <div className="mb-5">
                      <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                        Variant / Size
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {quickViewProduct.sizes.map((s) => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setSelectedSize(s)}
                            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all ${
                              selectedSize === s
                                ? "bg-cyan-500 text-slate-950 font-bold"
                                : "bg-[#111e2c] text-slate-300 hover:text-white border border-[#1a2e40]"
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Modal Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={handleAddQuickViewToCart}
                    className="flex-1 bg-[#00c8f8] hover:bg-cyan-300 text-slate-950 font-bold py-2.5 px-4 rounded-full text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-cyan-500/20"
                  >
                    <ShoppingBag className="w-4 h-4" /> Add to cart
                  </button>
                  <Link
                    to={`/product/${quickViewProduct.slug}`}
                    className="bg-[#111e2c] hover:bg-[#162738] border border-[#1b2f44] text-white px-4 py-2.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    Full details
                  </Link>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </Layout>
  );
};

export default Shop;

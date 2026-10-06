import { useState, useMemo, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
import Layout from "@/components/layout/Layout";
import ShopProductCard from "@/components/shop/ShopProductCard";
import ViewToggle from "@/components/shop/ViewToggle";
import FilterDrawer from "@/components/shop/FilterDrawer";
import { useAdmin } from "@/contexts/AdminContext";
import { useSEO } from "@/hooks/use-seo";
import shopHero from "@/assets/dany-wens/shop-hero.jpg";

const ITEMS_PER_PAGE = 8;

const Shop = () => {
  const { adminProducts, adminCollections, isLoading } = useAdmin();
  const [searchParams] = useSearchParams();
  const rawCategory = searchParams.get("category") || "all";
  const initialCategory = rawCategory === "tshirts" ? "t-shirts" : rawCategory;

  const [columns, setColumns] = useState(4);
  const [filterOpen, setFilterOpen] = useState(false);
  const [category, setCategory] = useState(initialCategory);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  // Sync category state with search params
  useEffect(() => {
    const cat = searchParams.get("category") || "all";
    setCategory(cat === "tshirts" ? "t-shirts" : cat);
  }, [searchParams]);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const filtered = useMemo(() => {
    let result = [...adminProducts];
    if (category === "new") {
      result = result.filter((p) => p.isNew);
    } else if (category !== "all") {
      result = result.filter((p) => p.category === category);
    }
    
    const collectionSlug = searchParams.get("collection");
    if (collectionSlug && collectionSlug !== "all") {
      const targetCol = adminCollections.find(c => c.slug === collectionSlug);
      if (targetCol) {
        result = result.filter(p => p.collectionId === targetCol.id);
      }
    }

    if (selectedSizes.length > 0) {
      result = result.filter((p) => p.sizes.some((s: string) => selectedSizes.includes(s)));
    }
    switch (sortBy) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "name-asc": result.sort((a, b) => a.name.localeCompare(b.name)); break;
      default: break;
    }
    return result;
  }, [adminProducts, adminCollections, category, selectedSizes, sortBy, searchParams]);

  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;

  const categoryLabel = category === "all" ? null : category === "new" ? "New Arrivals" : category.replace(/-/g, " ");
  const seoTitle = categoryLabel
    ? `Shop ${categoryLabel[0].toUpperCase()}${categoryLabel.slice(1)}`
    : "Shop All";
  useSEO({
    title: seoTitle,
    description: categoryLabel
      ? `Shop ${categoryLabel} at DANYWENS — contemporary streetwear, premium fabrics, bold design.`
      : "Shop the full DANYWENS collection — hoodies, tees, outerwear, and more contemporary streetwear.",
    path: "/shop",
  });

  if (isLoading) return <div className="h-screen flex items-center justify-center bg-background text-foreground text-xs tracking-widest">LOADING...</div>;

  return (
    <Layout>
      {/* Hero */}
      <div className="relative h-[60vh] md:h-[70vh] overflow-hidden">
        <img src={shopHero} alt="Shop collection" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-foreground/30" />
        <div className="absolute inset-0 flex items-end pb-12 md:pb-16 px-4 md:px-8">
          <div>
            <h1 className="text-4xl md:text-6xl font-heading tracking-tight text-background drop-shadow-lg">
              SHOP ALL
            </h1>
            <p className="text-sm text-background/80 mt-2 max-w-md drop-shadow">
              {filtered.length} Products
            </p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="sticky top-16 z-30 bg-background border-b border-border">
        <div className="flex items-center justify-between px-4 md:px-8 py-3">
          <div className="hidden md:block">
            <ViewToggle columns={columns} setColumns={setColumns} />
          </div>
          <div className="md:hidden text-xs text-muted-foreground">
            {filtered.length} Products
          </div>
          <button
            onClick={() => setFilterOpen(true)}
            className="flex items-center gap-2 text-xs font-semibold tracking-[0.1em] uppercase hover:text-muted-foreground transition-colors"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filter & Sort
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="px-4 md:px-8 py-8">
        <div
          className={`grid gap-x-4 gap-y-8 grid-cols-2 ${
            columns === 3 ? "md:grid-cols-3" : columns === 4 ? "md:grid-cols-4" : "md:grid-cols-2"
          }`}
        >
          {visible.map((product) => (
            <ShopProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Load More */}
        {hasMore && (
          <div className="mt-12 flex flex-col items-center gap-4">
            <div className="w-full max-w-xs">
              <div className="h-0.5 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-foreground transition-all"
                  style={{ width: `${(visibleCount / filtered.length) * 100}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-center mt-2">
                Viewing {visible.length} of {filtered.length} products
              </p>
            </div>
            <button
              onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
              className="border border-foreground px-10 py-3 text-xs font-semibold tracking-[0.2em] uppercase hover:bg-foreground hover:text-background transition-colors"
            >
              Load More
            </button>
          </div>
        )}
      </div>

      {/* Breadcrumb */}
      <div className="px-4 md:px-8 pb-8">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
          <span>/</span>
          <span className="text-foreground">Shop All</span>
        </div>
      </div>

      <FilterDrawer
        open={filterOpen}
        onOpenChange={setFilterOpen}
        selectedCategory={category}
        onCategoryChange={setCategory}
        selectedSizes={selectedSizes}
        onSizeToggle={toggleSize}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />
    </Layout>
  );
};

export default Shop;

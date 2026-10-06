import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { Link } from "react-router-dom";
import { api } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { formatPrice } from "@/lib/price";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ products: any[]; collections: any[] }>({ products: [], collections: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setResults({ products: [], collections: [] });
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await api.search(query);
        setResults(data);
      } catch (err) {
        console.error("Search failed:", err);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setQuery("");
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-background/95 backdrop-blur-md flex flex-col"
        >
          <div className="flex items-center justify-between px-4 md:px-8 h-20 md:h-24 border-b border-border">
            <div className="flex-1 flex items-center gap-4">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                autoFocus
                placeholder="Search products, collections..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full bg-transparent border-none focus:ring-0 text-xl md:text-2xl font-heading uppercase tracking-tight placeholder:text-muted-foreground/30"
              />
            </div>
            <button onClick={onClose} className="p-2 hover:opacity-70 transition-opacity">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 md:px-8 py-12">
            {loading ? (
              <div className="flex items-center justify-center h-40">
                <span className="text-[10px] font-bold tracking-[0.2em] uppercase animate-pulse">Searching...</span>
              </div>
            ) : query.length >= 2 ? (
              <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
                {/* Collections Results */}
                <div className="md:col-span-4">
                  <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-6">Collections</h3>
                  {results.collections.length > 0 ? (
                    <div className="space-y-4">
                      {results.collections.map((c) => (
                        <Link
                          key={c.id}
                          to={`/collections/${c.slug}`}
                          onClick={onClose}
                          className="group block"
                        >
                          <span className="text-lg font-heading uppercase tracking-tight group-hover:text-muted-foreground transition-colors">
                            {c.name}
                          </span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground/50 italic">No collections found</p>
                  )}
                </div>

                {/* Products Results */}
                <div className="md:col-span-8">
                  <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground mb-6">Products</h3>
                  {results.products.length > 0 ? (
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                      {results.products.map((p) => (
                        <Link
                          key={p.id}
                          to={`/product/${p.slug}`}
                          onClick={onClose}
                          className="group block"
                        >
                          <div className="aspect-[3/4] overflow-hidden bg-secondary mb-3">
                            <img
                              src={p.colors[0]?.image}
                              alt={p.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                          </div>
                          <span className="block text-xs font-bold tracking-[0.05em] uppercase mb-1">
                            {p.name}
                          </span>
                          <span className="text-xs text-muted-foreground">{formatPrice(p.price)}</span>
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground/50 italic">No products found</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center py-20">
                <p className="text-muted-foreground/40 font-heading text-lg md:text-xl uppercase tracking-widest">
                  Start typing to search
                </p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

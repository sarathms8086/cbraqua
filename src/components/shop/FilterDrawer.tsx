import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { categories } from "@/data/products";

interface FilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
  selectedSizes: string[];
  onSizeToggle: (size: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

const allSizes = ["XS", "S", "M", "L", "XL", "XXL", "28", "30", "32", "34", "36", "38"];
const sortOptions = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Name A-Z", value: "name-asc" },
];

const FilterDrawer = ({
  open, onOpenChange, selectedCategory, onCategoryChange,
  selectedSizes, onSizeToggle, sortBy, onSortChange,
}: FilterDrawerProps) => {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-sm bg-background p-0">
        <SheetTitle className="sr-only">Filters</SheetTitle>

        <div className="px-6 py-5 border-b border-border">
          <h2 className="text-sm font-semibold tracking-[0.15em] uppercase">Filter & Sort</h2>
        </div>

        <div className="px-6 py-6 space-y-8 overflow-y-auto max-h-[calc(100vh-140px)]">
          {/* Categories */}
          <div>
            <h3 className="text-[11px] font-semibold tracking-[0.15em] uppercase mb-4">Category</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => onCategoryChange(cat.value)}
                  className={`text-xs px-4 py-2 border transition-colors ${
                    selectedCategory === cat.value
                      ? "border-foreground bg-foreground text-background"
                      : "border-border hover:border-foreground"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sizes */}
          <div>
            <h3 className="text-[11px] font-semibold tracking-[0.15em] uppercase mb-4">Size</h3>
            <div className="grid grid-cols-4 gap-2">
              {allSizes.map((size) => (
                <button
                  key={size}
                  onClick={() => onSizeToggle(size)}
                  className={`text-xs py-2 border transition-colors ${
                    selectedSizes.includes(size)
                      ? "border-foreground bg-foreground text-background"
                      : "border-border hover:border-foreground"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div>
            <h3 className="text-[11px] font-semibold tracking-[0.15em] uppercase mb-4">Sort By</h3>
            <div className="space-y-2">
              {sortOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onSortChange(opt.value)}
                  className={`block w-full text-left text-sm py-2 transition-colors ${
                    sortBy === opt.value ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Apply */}
        <div className="absolute bottom-0 left-0 right-0 px-6 py-5 border-t border-border bg-background">
          <button
            onClick={() => onOpenChange(false)}
            className="w-full bg-foreground text-background py-3 text-xs font-semibold tracking-[0.2em] uppercase hover:bg-foreground/90 transition-colors"
          >
            Apply Filters
          </button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FilterDrawer;

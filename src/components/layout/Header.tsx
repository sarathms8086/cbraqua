import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, Search, User, ShoppingBag } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/components/cart/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/contexts/AdminContext";
import SearchOverlay from "./SearchOverlay";

const navLinks = [
  { label: "NEW IN", href: "/shop?category=new" },
  { label: "SHOP ALL", href: "/shop" },
  { label: "COLLECTIONS", href: "/collections" },
  { label: "LOOKBOOK", href: "/lookbook" },
  { label: "ABOUT", href: "/about" },
];

const Header = () => {
  const { totalItems, setIsOpen } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { siteSettings } = useAdmin();
  const [scrolled, setScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const textClass = scrolled
    ? "text-foreground"
    : "text-background drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]";

  const hoverClass = scrolled
    ? "hover:text-muted-foreground"
    : "hover:text-background/70";

  return (
    <header
      className={`fixed left-0 right-0 top-[calc(38px+env(safe-area-inset-top))] z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-md border-b border-border" : "bg-transparent"
      }`}
    >
      <div className="grid grid-cols-3 items-center px-4 md:px-8 h-16">
        {/* Left: mobile menu / desktop nav */}
        <div className="flex items-center overflow-hidden min-w-0">
          {/* Mobile menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button aria-label="Open menu" className="min-w-11 min-h-11 flex items-center justify-center -m-2 touch-manipulation">
                  <Menu className={`h-5 w-5 transition-colors ${textClass}`} />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full max-w-sm bg-background p-0">
                <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                <nav className="flex flex-col pt-20 px-8">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      to={link.href}
                      className="text-2xl font-heading uppercase tracking-tight py-4 border-b border-border hover:text-muted-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <Link
                    to={isAuthenticated ? "/account" : "/login"}
                    className="text-2xl font-heading uppercase tracking-tight py-4 border-b border-border hover:text-muted-foreground transition-colors"
                  >
                    {isAuthenticated ? "Account" : "Sign In"}
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-3 lg:gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className={`text-[9px] lg:text-[11px] font-semibold uppercase tracking-[0.12em] lg:tracking-[0.15em] transition-colors whitespace-nowrap ${textClass} ${hoverClass}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Center: Logo */}
        <div className="flex justify-center">
          <Link to="/">
            <h1
              className={`text-lg md:text-xl lg:text-2xl font-heading tracking-[0.15em] md:tracking-[0.2em] lg:tracking-[0.3em] uppercase transition-colors whitespace-nowrap ${
                scrolled ? "text-foreground" : "text-background drop-shadow-[0_1px_3px_rgba(0,0,0,0.5)]"
              }`}
            >
              {siteSettings.brandName}
            </h1>
          </Link>
        </div>

        {/* Right: icons */}
        <div className="flex items-center justify-end gap-3 md:gap-4">
          <button 
            aria-label="Search" 
            onClick={() => setIsSearchOpen(true)}
            className="hidden md:block hover:opacity-70 transition-opacity"
          >
            <Search className={`h-5 w-5 transition-colors ${textClass}`} />
          </button>
          <Link
            to={isAuthenticated ? "/account" : "/login"}
            aria-label="Account"
            className="hidden md:flex items-center hover:opacity-70 transition-opacity"
          >
            {isAuthenticated && user ? (
              <span className={`w-6 h-6 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center`}>
                {user.firstName[0]?.toUpperCase()}
              </span>
            ) : (
              <User className={`h-5 w-5 transition-colors ${textClass}`} />
            )}
          </Link>
          <button
            aria-label="Cart"
            onClick={() => setIsOpen(true)}
            className="relative min-w-11 min-h-11 flex items-center justify-center -m-2 hover:opacity-70 transition-opacity touch-manipulation"
          >
            <ShoppingBag className={`h-5 w-5 transition-colors ${textClass}`} />
            {totalItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-accent text-accent-foreground text-[10px] font-bold w-4 h-4 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </header>
  );
};

export default Header;

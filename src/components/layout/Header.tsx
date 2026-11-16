import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, Search, ShoppingBag, Sun, Moon, Sparkles } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { useCart } from "@/components/cart/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useAdmin } from "@/contexts/AdminContext";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Gallery", href: "/gallery" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const Header = () => {
  const { totalItems, setIsOpen } = useCart();
  const { isAuthenticated, user } = useAuth();
  const { siteSettings } = useAdmin();
  const location = useLocation();
  const navigate = useNavigate();

  const [scrolled, setScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#070e15]/95 backdrop-blur-md border-b border-[#172838] shadow-lg shadow-black/20"
          : "bg-[#070e15]/80 backdrop-blur-sm border-b border-[#172838]/60"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <div className="flex items-center gap-3">
          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <button
                  aria-label="Open menu"
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#0c1622] border border-[#172838] text-white hover:text-cyan-400 transition-colors"
                >
                  <Menu className="h-5 w-5" />
                </button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80 bg-[#070e15] border-r border-[#172838] p-6 text-white">
                <SheetTitle className="sr-only">CBR AQUA Navigation</SheetTitle>
                <div className="flex items-center gap-2.5 mb-8">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/30">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="text-base font-extrabold tracking-wider block text-white">CBR AQUA</span>
                    <span className="text-[10px] font-bold tracking-[0.25em] text-cyan-400 block -mt-1">CULTURE</span>
                  </div>
                </div>

                <nav className="flex flex-col gap-2">
                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      to={link.href}
                      className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        isActive(link.href)
                          ? "bg-[#0d2232] text-cyan-300 border border-cyan-500/40"
                          : "text-slate-300 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="pt-4 border-t border-[#172838] mt-2">
                    <Link
                      to={isAuthenticated ? "/account" : "/login"}
                      className="px-4 py-2.5 rounded-xl text-sm font-semibold text-cyan-400 block hover:bg-white/5"
                    >
                      {isAuthenticated ? "My Account" : "Sign In"}
                    </Link>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>

          <Link to="/" className="flex items-center gap-2.5 group">
            {/* Logo Badge Icon */}
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-tr from-[#0099ff] via-[#00c8f8] to-[#00e5ff] p-[2px] shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full rounded-full bg-[#070e15] flex items-center justify-center">
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5 text-cyan-400 fill-current"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 16.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.4z" />
                </svg>
              </div>
            </div>

            {/* Brand Title and Subtitle */}
            <div className="flex flex-col">
              <span className="text-sm sm:text-base font-extrabold tracking-wider text-white uppercase leading-tight">
                {siteSettings.brandName || "CBR AQUA"}
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.25em] text-cyan-400 uppercase leading-none">
                CULTURE
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Desktop Navigation Bar */}
        <nav className="hidden lg:flex items-center gap-1.5">
          {navLinks.map((link) => {
            const active = isActive(link.href);
            return (
              <Link
                key={link.label}
                to={link.href}
                className={`transition-all duration-200 ${
                  active
                    ? "bg-[#0d2232] text-cyan-300 border border-cyan-500/40 px-4 py-1.5 rounded-full text-xs font-semibold shadow-sm shadow-cyan-950"
                    : "text-slate-300 hover:text-white px-3.5 py-1.5 rounded-full text-xs font-medium hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: Search, Theme Toggle, Cart, Sign in */}
        <div className="flex items-center gap-2.5 sm:gap-3.5">
          {/* Search Input Bar (Matches Screenshot) */}
          <form onSubmit={handleSearch} className="relative hidden md:block">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search products..."
              className="bg-[#0c1622] border border-[#1b2c3d] text-xs text-white placeholder-slate-400 pl-8 pr-3 py-1.5 rounded-full w-40 sm:w-48 lg:w-56 focus:outline-none focus:border-cyan-400 transition-colors"
            />
          </form>

          {/* Theme Toggle Button */}
          <button
            type="button"
            onClick={() => setIsDark(!isDark)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Toggle theme"
          >
            {isDark ? <Sun className="w-4 h-4 text-slate-300" /> : <Moon className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* Cart Bag Icon with Counter */}
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="relative w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="w-4 h-4" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-cyan-400 text-slate-950 text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                {totalItems}
              </span>
            )}
          </button>

          {/* Sign In / Account Link */}
          <Link
            to={isAuthenticated ? "/account" : "/login"}
            className="text-xs font-semibold text-slate-300 hover:text-cyan-400 transition-colors hidden sm:block ml-1"
          >
            {isAuthenticated && user ? (
              <span className="w-7 h-7 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold flex items-center justify-center text-xs">
                {user.firstName?.[0]?.toUpperCase() || "U"}
              </span>
            ) : (
              "Sign in"
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;

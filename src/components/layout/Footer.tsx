import { Link } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import { useAuth } from "@/contexts/AuthContext";

const Footer = () => {
  const { siteSettings } = useAdmin();
  const { isAuthenticated } = useAuth();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="px-4 md:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h2 className="text-xl md:text-2xl font-heading tracking-[0.15em] md:tracking-[0.3em] mb-4 break-words">{siteSettings.brandName}</h2>
            <p className="text-sm text-primary-foreground/60 leading-relaxed max-w-xs">
              {siteSettings.footerTagline}
            </p>
          </div>

          {/* Client Services */}
          <div>
            <h3 className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-6">Client Services</h3>
            <nav className="flex flex-col gap-3">
              <Link to="/contact" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Contact Us</Link>
              <Link to={isAuthenticated ? "/account" : "/login"} className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                {isAuthenticated ? "My Account" : "Sign In"}
              </Link>
              <Link to="/track-order" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Track Order</Link>
              <Link to="/shipping" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Shipping & Delivery</Link>
              <Link to="/returns" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Returns & Exchanges</Link>
              <Link to="/faq" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">FAQ</Link>
            </nav>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-6">Company</h3>
            <nav className="flex flex-col gap-3">
              <Link to="/about" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">About Us</Link>
              <Link to="/lookbook" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Lookbook</Link>
              <Link to="/collections" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Collections</Link>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-6">Legal</h3>
            <nav className="flex flex-col gap-3">
              <Link to="/privacy" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors">Terms of Service</Link>
            </nav>
          </div>

          {/* Newsletter */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-6">Newsletter</h3>
            <p className="text-sm text-primary-foreground/60 mb-4">
              First access to drops & exclusive offers.
            </p>
            <form className="flex flex-col gap-2 sm:flex-row sm:gap-0 sm:border sm:border-primary-foreground/30" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="EMAIL ADDRESS"
                className="flex-1 min-w-0 bg-transparent border border-primary-foreground/30 sm:border-0 px-4 py-3 text-xs tracking-[0.1em] placeholder:text-primary-foreground/40 focus:outline-none"
              />
              <button
                type="submit"
                className="bg-primary-foreground text-primary px-6 py-3 text-xs font-semibold tracking-[0.1em] uppercase hover:bg-primary-foreground/90 transition-colors shrink-0"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-primary-foreground/40">
            © {new Date().getFullYear()} {siteSettings.brandName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

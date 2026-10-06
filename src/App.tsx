import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { useEffect, lazy, Suspense } from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { CartProvider } from "@/components/cart/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import { AdminProvider } from "@/contexts/AdminContext";
import CartDrawer from "@/components/cart/CartDrawer";
import { buildOrganizationJsonLd } from "@/hooks/use-seo";

// Eagerly loaded — on the critical path for every visitor
import Index from "./pages/Index.tsx";

// Lazy loaded — only fetched when the route is visited
const Shop = lazy(() => import("./pages/Shop.tsx"));
const ProductDetail = lazy(() => import("./pages/ProductDetail.tsx"));
const Collections = lazy(() => import("./pages/Collections.tsx"));
const Lookbook = lazy(() => import("./pages/Lookbook.tsx"));
const About = lazy(() => import("./pages/About.tsx"));
const Contact = lazy(() => import("./pages/Contact.tsx"));
const FAQ = lazy(() => import("./pages/FAQ.tsx"));
const Login = lazy(() => import("./pages/Login.tsx"));
const Account = lazy(() => import("./pages/Account.tsx"));
const Checkout = lazy(() => import("./pages/Checkout.tsx"));
const TrackOrder = lazy(() => import("./pages/TrackOrder.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const Shipping = lazy(() => import("./pages/Policies.tsx").then(m => ({ default: m.Shipping })));
const Returns = lazy(() => import("./pages/Policies.tsx").then(m => ({ default: m.Returns })));
const Privacy = lazy(() => import("./pages/Policies.tsx").then(m => ({ default: m.Privacy })));
const Terms = lazy(() => import("./pages/Policies.tsx").then(m => ({ default: m.Terms })));

// Admin — heaviest chunk, only loaded when /admin/* is visited
const AdminGuard = lazy(() => import("./components/admin/AdminGuard.tsx"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard.tsx"));
const AdminProducts = lazy(() => import("./pages/admin/AdminProducts.tsx"));
const AdminCollections = lazy(() => import("./pages/admin/AdminCollections.tsx"));
const AdminHomepage = lazy(() => import("./pages/admin/AdminHomepage.tsx"));
const AdminSettings = lazy(() => import("./pages/admin/AdminSettings.tsx"));
const AdminMedia = lazy(() => import("./pages/admin/AdminMedia.tsx"));
const AdminOrders = lazy(() => import("./pages/admin/AdminOrders.tsx"));
const AdminCustomers = lazy(() => import("./pages/admin/AdminCustomers.tsx"));
const AdminCategories = lazy(() => import("./pages/admin/AdminCategories.tsx"));
const AdminPages = lazy(() => import("./pages/admin/AdminPages.tsx"));

const queryClient = new QueryClient();

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname]);
  return null;
};

// Injected once — describes the brand itself, independent of route.
const SiteJsonLd = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(buildOrganizationJsonLd());
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);
  return null;
};

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-6 h-6 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
  </div>
);

const AdminRoute = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<PageLoader />}>
    <AdminGuard>{children}</AdminGuard>
  </Suspense>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AdminProvider>
        <AuthProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <SiteJsonLd />
            <BrowserRouter>
              <ScrollToTop />
              <CartDrawer />
              <Suspense fallback={<PageLoader />}>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:slug" element={<ProductDetail />} />
                  <Route path="/collections" element={<Collections />} />
                  <Route path="/lookbook" element={<Lookbook />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Login />} />
                  <Route path="/account" element={<Account />} />
                  <Route path="/shipping" element={<Shipping />} />
                  <Route path="/returns" element={<Returns />} />
                  <Route path="/privacy" element={<Privacy />} />
                  <Route path="/terms" element={<Terms />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/track-order" element={<TrackOrder />} />
                  {/* Admin */}
                  <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                  <Route path="/admin/products" element={<AdminRoute><AdminProducts /></AdminRoute>} />
                  <Route path="/admin/collections" element={<AdminRoute><AdminCollections /></AdminRoute>} />
                  <Route path="/admin/homepage" element={<AdminRoute><AdminHomepage /></AdminRoute>} />
                  <Route path="/admin/settings" element={<AdminRoute><AdminSettings /></AdminRoute>} />
                  <Route path="/admin/media" element={<AdminRoute><AdminMedia /></AdminRoute>} />
                  <Route path="/admin/orders" element={<AdminRoute><AdminOrders /></AdminRoute>} />
                  <Route path="/admin/customers" element={<AdminRoute><AdminCustomers /></AdminRoute>} />
                  <Route path="/admin/categories" element={<AdminRoute><AdminCategories /></AdminRoute>} />
                  <Route path="/admin/pages" element={<AdminRoute><AdminPages /></AdminRoute>} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </AdminProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

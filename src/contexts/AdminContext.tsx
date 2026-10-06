import { createContext, useContext, useState, useEffect, useMemo, ReactNode } from "react";
import { Product } from "@/data/products";
import { Collection } from "@/data/collections";
import { api } from "@/lib/api";

export interface MosaicTileData {
  id: string;
  type: "image" | "cta";
  image?: string;
  alt?: string;
  link?: string;
  label?: string;
  colSpan?: string;
  rowSpan?: string;
  mobileColSpan?: string;
  mobileRowSpan?: string;
  subtitle?: string;
  heading?: string;
  tagline?: string;
  ctaText?: string;
  ctaLink?: string;
  visible: boolean;
}

export interface PolicySection { heading: string; body: string; }
export interface FaqItem { q: string; a: string; }
export interface ContactInfo { subtitle: string; email: string; phone: string; address: string; }

export interface PageContent {
  shipping: PolicySection[];
  returns: PolicySection[];
  privacy: PolicySection[];
  terms: PolicySection[];
  faq: FaqItem[];
  contact: ContactInfo;
}

export const DEFAULT_PAGE_CONTENT: PageContent = {
  shipping: [
    { heading: "Domestic Shipping", body: "We offer free standard shipping on all orders over ₹10,000. Standard delivery takes 3-5 business days." },
    { heading: "Order Processing", body: "Orders are processed within 1-2 business days. You will receive a shipping confirmation with tracking once dispatched." },
  ],
  returns: [
    { heading: "Return Policy", body: "We accept returns within 30 days of delivery. Items must be unworn, unwashed, and in original packaging with all tags attached." },
    { heading: "How to Return", body: "Contact our team at returns@danywens.com with your order number. We will provide a prepaid return label." },
    { heading: "Exchanges", body: "We offer free exchanges for different sizes or colours. Contact us within 30 days of delivery." },
    { heading: "Refunds", body: "Refunds are processed within 5-7 business days of receiving your return to your original payment method." },
  ],
  privacy: [
    { heading: "Information We Collect", body: "We collect personal information you provide when placing an order, creating an account, or subscribing to our newsletter." },
    { heading: "How We Use Your Information", body: "Your information is used to process orders, provide customer service, and send updates about new products (with your consent)." },
    { heading: "Data Protection", body: "We implement appropriate security measures to protect your personal information. Payment data is encrypted and processed through secure gateways." },
    { heading: "Your Rights", body: "You have the right to access, correct, or delete your personal information at any time. Contact privacy@danywens.com for any requests." },
  ],
  terms: [
    { heading: "General", body: "By accessing and using the DANYWENS website, you agree to these terms of service. We reserve the right to modify these terms at any time." },
    { heading: "Products", body: "All products are subject to availability. We reserve the right to limit quantities or cancel orders at our discretion." },
    { heading: "Intellectual Property", body: "All content on this website including images, text, logos, and designs is the property of DANYWENS and protected by copyright laws." },
    { heading: "Limitation of Liability", body: "DANYWENS shall not be liable for any indirect, incidental, or consequential damages arising from your use of our website or products." },
  ],
  faq: [
    { q: "How long does shipping take?", a: "Standard shipping takes 3-5 business days. International orders typically arrive within 7-14 business days." },
    { q: "What is your return policy?", a: "We accept returns within 30 days of delivery. Items must be unworn, unwashed, and in original packaging with tags attached." },
    { q: "Do you offer exchanges?", a: "Yes, we offer free exchanges for different sizes or colours. Contact us within 30 days of delivery." },
    { q: "How do your sizes run?", a: "Our pieces are designed with an oversized fit. We recommend going true to size for our intended silhouette." },
    { q: "What materials do you use?", a: "We use premium heavyweight cotton (270-450gsm), custom French terry, and technical fabrics sourced from certified mills." },
    { q: "Do you ship internationally?", a: "Yes, we ship worldwide. International shipping rates and duties are calculated at checkout." },
  ],
  contact: {
    subtitle: "We'd love to hear from you. Fill out the form below and we'll get back to you within 24 hours.",
    email: "hello@danywens.com",
    phone: "",
    address: "",
  },
};

export interface SiteSettings {
  brandName: string;
  marqueeText: string;
  footerTagline: string;
  offerDiscountPercent: number;
  gstPercent: number;
  sizeChartImage: string;
  sizeChartImages: Record<string, string>;
  categoryTypes: Record<string, string[]>;
  deliveryFee: number;
  categories: string[];
  pageContent: PageContent;
  heroVideoUrl: string;
  shippingText: string;
  washcareText: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  uploadedAt: string;
}

interface AdminContextType {
  isAdmin: boolean;
  adminLogin: (password: string) => boolean;
  adminLogout: () => void;
  isLoading: boolean;
  // Products
  adminProducts: Product[];
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  // Collections
  adminCollections: Collection[];
  addCollection: (collection: Collection) => Promise<void>;
  updateCollection: (id: string, updates: Partial<Collection>) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;
  // Mosaic tiles
  mosaicTiles: MosaicTileData[];
  updateMosaicTile: (id: string, updates: Partial<MosaicTileData>) => Promise<void>;
  reorderMosaicTiles: (tiles: MosaicTileData[]) => void;
  // Media
  mediaItems: MediaItem[];
  fetchMedia: () => Promise<void>;
  addMediaItem: (files: File[]) => Promise<void>;
  deleteMediaItem: (id: string) => Promise<void>;
  // Orders
  adminOrders: any[];
  updateOrderStatus: (id: string, status: string) => Promise<void>;
  // Customers
  adminCustomers: any[];
  // Settings
  siteSettings: SiteSettings;
  updateSiteSettings: (updates: Partial<SiteSettings>) => Promise<void>;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_KEY = "danywens_admin";
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";

function mapProduct(p: any): Product {
  return {
    ...p,
    details: typeof p.details === "string" ? JSON.parse(p.details) : (p.details || []),
    sizes: typeof p.sizes === "string" ? JSON.parse(p.sizes) : (p.sizes || []),
    soldOutSizes: p.soldOutSizes
      ? (typeof p.soldOutSizes === "string" ? JSON.parse(p.soldOutSizes) : p.soldOutSizes)
      : [],
    colors: (typeof p.colors === "string" ? JSON.parse(p.colors) : (p.colors || [])).map((c: any) => ({
      ...c,
      images: c.images
        ? (typeof c.images === "string" ? JSON.parse(c.images) : c.images)
        : [],
      soldOutSizes: c.soldOutSizes
        ? (typeof c.soldOutSizes === "string" ? JSON.parse(c.soldOutSizes) : c.soldOutSizes)
        : [],
      sizeStock: c.sizeStock
        ? (typeof c.sizeStock === "string" ? JSON.parse(c.sizeStock) : c.sizeStock)
        : {},
    })),
  };
}

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem(ADMIN_KEY) === "true");
  const [isLoading, setIsLoading] = useState(true);
  const [adminProducts, setAdminProducts] = useState<Product[]>([]);
  const [adminCollections, setAdminCollections] = useState<Collection[]>([]);
  const [mosaicTiles, setMosaicTiles] = useState<MosaicTileData[]>([]);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [adminOrders, setAdminOrders] = useState<any[]>([]);
  const [adminCustomers, setAdminCustomers] = useState<any[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    brandName: "DANYWENS",
    marqueeText: "NEW DROP — FREE SHIPPING ON ORDERS OVER ₹10,000 — DANYWENS ARCHIVE — LIMITED EDITION — ",
    footerTagline: "Contemporary streetwear for the modern archive.",
    offerDiscountPercent: 0,
    gstPercent: 0,
    sizeChartImage: "",
    sizeChartImages: {},
    categoryTypes: {},
    deliveryFee: 0,
    categories: [],
    pageContent: DEFAULT_PAGE_CONTENT,
    heroVideoUrl: "",
    shippingText: "Packed within 24 hours. Free delivery pan-India. Dispatches next day for in-stock products.",
    washcareText: "Dry clean recommended. Wash dark colors separately and avoid direct ironing on prints.",
  });

  useEffect(() => {
    async function loadData() {
      try {
        // Always fetch storefront data (products, collections, mosaic, settings)
        const [fetchedProducts, fetchedCollections, mosaic, settings] = await Promise.all([
          api.products.getAll(),
          api.collections.getAll(),
          api.mosaic.getAll(),
          api.settings.get(),
        ]);

        const mappedProducts = fetchedProducts.map(mapProduct);
        const mappedCollections = fetchedCollections.map((c: any) => ({
          ...c,
          productCount: mappedProducts.filter((p: any) => p.collectionId === c.id).length,
        }));

        setAdminProducts(mappedProducts);
        setAdminCollections(mappedCollections);
        setMosaicTiles(mosaic);

        if (Object.keys(settings).length > 0) {
          setSiteSettings(prev => ({ ...prev, ...settings }));
        }

        // Only fetch admin-only data if logged in as admin
        if (isAdmin) {
          const [orders, customers, media] = await Promise.all([
            api.orders.getAll(),
            api.customers.getAll(),
            api.media.getAll(),
          ]);
          setAdminOrders(orders);
          setAdminCustomers(customers);
          setMediaItems(media);
        }
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [isAdmin]);

  const fetchMedia = async () => {
    try {
      const media = await api.media.getAll();
      setMediaItems(media);
    } catch (err) {
      console.error("Failed to fetch media:", err);
    }
  };

  const adminLogin = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      localStorage.setItem(ADMIN_KEY, "true");
      return true;
    }
    return false;
  };

  const adminLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem(ADMIN_KEY);
  };

  const displayCollections = useMemo(() => {
    return adminCollections.map(c => ({
      ...c,
      productCount: adminProducts.filter(p => p.collectionId === c.id).length,
    }));
  }, [adminCollections, adminProducts]);

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        adminLogin,
        adminLogout,
        isLoading,
        adminProducts,
        addProduct: async (p) => {
          const newProduct = await api.products.create(p);
          setAdminProducts((prev) => [...prev, mapProduct(newProduct)]);
        },
        updateProduct: async (id, updates) => {
          const updated = await api.products.update(id, updates);
          setAdminProducts((prev) => prev.map((p) => (p.id === id ? mapProduct({ ...p, ...updated }) : p)));
        },
        deleteProduct: async (id) => {
          await api.products.delete(id);
          setAdminProducts((prev) => prev.filter((p) => p.id !== id));
        },
        adminCollections: displayCollections,
        addCollection: async (c) => {
          const newCol = await api.collections.create(c);
          setAdminCollections((prev) => [...prev, newCol]);
        },
        updateCollection: async (id, updates) => {
          const updated = await api.collections.update(id, updates);
          setAdminCollections((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
        },
        deleteCollection: async (id) => {
          await api.collections.delete(id);
          setAdminCollections((prev) => prev.filter((c) => c.id !== id));
        },
        mosaicTiles,
        updateMosaicTile: async (id, updates) => {
          const updated = await api.mosaic.update(id, updates);
          setMosaicTiles((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));
        },
        reorderMosaicTiles: (tiles) => {
          setMosaicTiles(tiles);
          // Persist new order in the background
          tiles.forEach((tile, index) => {
            api.mosaic.update(tile.id, { order: index }).catch(console.error);
          });
        },
        updateSiteSettings: async (updates) => {
          await api.settings.update(updates);
          setSiteSettings((prev) => ({ ...prev, ...updates }));
        },
        siteSettings,
        mediaItems,
        fetchMedia,
        addMediaItem: async (files: File[]) => {
          await api.upload(files);
          await fetchMedia();
        },
        deleteMediaItem: async (id: string) => {
          try {
            await api.media.delete(id);
            setMediaItems((prev) => prev.filter((item) => item.id !== id));
          } catch (err) {
            console.error("Failed to delete media:", err);
          }
        },
        adminOrders,
        updateOrderStatus: async (id, status) => {
          await api.orders.updateStatus(id, status);
          setAdminOrders(prev => prev.map(o => o.id === id ? { ...o, shippingStatus: status } : o));
        },
        adminCustomers,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
}

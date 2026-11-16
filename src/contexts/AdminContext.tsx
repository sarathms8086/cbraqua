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
    { heading: "100% Live Arrival Guarantee", body: "Every live ornamental fish, koi, and aquatic animal is packed in medical-grade oxygen bags inside insulated thermocol containers with 48-hour thermal heat/ice packs. We guarantee 100% live arrival across India." },
    { heading: "Transit & Dispatch", body: "Orders dispatch Mondays through Thursdays to avoid weekend transit delays. Consignment tracking is shared via SMS and WhatsApp immediately upon airport handover." },
  ],
  returns: [
    { heading: "Dead-On-Arrival (DOA) Claim Policy", body: "In the unlikely event a fish arrives non-viable, take a clear unboxing video within 2 hours of delivery showing the unopened bag. We issue an immediate replacement or full refund." },
    { heading: "Hardware Returns", body: "Canister filters, heaters, and air pumps can be returned or exchanged within 10 days in original packaging with intact warranty cards." },
  ],
  privacy: [
    { heading: "Information We Collect", body: "We collect shipping details and phone numbers exclusively to coordinate express air transit and WhatsApp tracking updates." },
    { heading: "Data Protection", body: "All payment transactions are encrypted and secured through Razorpay." },
  ],
  terms: [
    { heading: "Live Livestock Agreement", body: "Livestock deliveries require recipient availability upon first courier delivery attempt to maintain warranty validity." },
    { heading: "Custom Aquascape Projects", body: "Custom tank installations and planted projects require a 50% advance for hardscape fabrication and botanical procurement." },
  ],
  faq: [
    { q: "How do live fish survive during courier transit?", a: "Fish are packed in heavy-duty triple bags injected with pure medical oxygen, treated with gentle water calmative, and housed inside thick EPS insulated thermocol boxes with 48h climate packs." },
    { q: "What should I do when my fish box arrives?", a: "Float the sealed bag in your aquarium for 15-20 minutes to equalize water temperature, then gradually drip acclimate with your tank water before netting the fish into the tank. Never pour transport water into your aquarium." },
    { q: "Do you ship across India?", a: "Yes, we ship to all major pincodes across India via express air cargo routes with live arrival assurance." },
    { q: "Are the plants pest and snail free?", a: "Yes, our plants are grown in sterile tissue-culture laboratory conditions or treated in clean holding tanks free of planaria, hydra, and nuisance snails." },
    { q: "Can I get custom aquascaping design for my home?", a: "Yes! Our certified aquascaping team designs bespoke nature aquariums and terrariums. Contact us via WhatsApp for a consultation." },
  ],
  contact: {
    subtitle: "Have questions about species compatibility, live shipping, or custom aquascapes? Our certified aquarists are here to assist.",
    email: "hello@cbraqua.com",
    phone: "+91 94818 16563",
    address: "CBR AQUA CULTURE Studio & Quarantine Facility, Hyderabad & Bangalore, India",
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
    brandName: "CBR AQUA",
    marqueeText: "LIVE ARRIVAL GUARANTEE — CURATED ORNAMENTAL FISH & AQUASCAPES — ALL-INDIA OXYGEN PACKED SHIPPING — FREE DELIVERY OVER ₹1,999 — ",
    footerTagline: "CBR AQUA CULTURE curates rare ornamental fish, koi, planted aquascapes, terrariums, and pro-grade aquarium hardware.",
    offerDiscountPercent: 0,
    gstPercent: 0,
    sizeChartImage: "",
    sizeChartImages: {},
    categoryTypes: {},
    deliveryFee: 0,
    categories: [],
    pageContent: DEFAULT_PAGE_CONTENT,
    heroVideoUrl: "",
    shippingText: "Packed with medical-grade oxygen in temperature-regulated insulated thermocol boxes with 48h thermal packs. 100% Live Arrival Guaranteed pan-India.",
    washcareText: "Acclimate livestock by floating bags for 20 mins and slow drip transfer before introducing to tank.",
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

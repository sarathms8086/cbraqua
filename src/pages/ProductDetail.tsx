import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { Bookmark, Ruler, ChevronLeft, ChevronRight, ZoomIn, X } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useAdmin } from "@/contexts/AdminContext";
import { useCart } from "@/components/cart/CartContext";
import ShopProductCard from "@/components/shop/ShopProductCard";
import { getProductGalleryImages, normalizeImageUrl } from "@/lib/productGallery";
import {
  getProductMainImageFrameClassName,
  getProductMainImageClassName,
  getProductThumbnailFrameClassName,
  getProductThumbnailImageClassName,
} from "@/lib/productImageLayout";
import { formatPrice } from "@/lib/price";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { useSEO, buildProductJsonLd, buildBreadcrumbJsonLd, SITE_URL } from "@/hooks/use-seo";

const ProductDetail = () => {
  const { adminProducts, isLoading, siteSettings } = useAdmin();
  const { slug } = useParams<{ slug: string }>();
  const product = adminProducts.find((p) => p.slug === slug);
  const { addItem, items } = useCart();

  const [colorIndex, setColorIndex] = useState(0);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [sizeError, setSizeError] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const dragRef = useRef<{ startX: number; startY: number; panX: number; panY: number } | null>(null);
  const pinchRef = useRef<number | null>(null);

  const resetZoom = useCallback(() => { setZoom(1); setPan({ x: 0, y: 0 }); }, []);

  const openLightbox = () => { resetZoom(); setLightboxOpen(true); };
  const closeLightbox = () => { setLightboxOpen(false); resetZoom(); };

  // Reset image selection when colour changes
  useEffect(() => {
    setSelectedImageIndex(0);
  }, [colorIndex]);

  const seoColor = product?.colors[colorIndex] ?? product?.colors[0];
  const seoImageRaw = seoColor?.image;
  const seoImage = seoImageRaw
    ? seoImageRaw.startsWith("http")
      ? seoImageRaw
      : `${SITE_URL}${seoImageRaw.startsWith("/") ? "" : "/"}${seoImageRaw}`
    : undefined;

  useSEO({
    title: product ? product.name : "Product",
    description: product
      ? `${product.description.slice(0, 155)}${product.description.length > 155 ? "…" : ""} — ${formatPrice(product.price)} at DANYWENS.`
      : "Product not found",
    path: `/product/${slug ?? ""}`,
    image: seoImage,
    type: "product",
    noindex: !product,
    jsonLd: product
      ? [
          buildProductJsonLd(product, seoImage ?? ""),
          buildBreadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Shop", path: "/shop" },
            { name: product.name, path: `/product/${product.slug}` },
          ]),
        ]
      : undefined,
  });

  if (isLoading) return (
    <div className="h-screen flex items-center justify-center bg-background text-foreground text-xs tracking-widest">
      LOADING...
    </div>
  );

  if (!product) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Product not found</p>
        </div>
      </Layout>
    );
  }

  const currentColor = product.colors[colorIndex];

  if (!currentColor) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">Product images coming soon</p>
        </div>
      </Layout>
    );
  }

  const galleryImages = getProductGalleryImages(currentColor);
  const hasManyImages = galleryImages.length > 1;

  const prevImage = () =>
    setSelectedImageIndex((i) => (i - 1 + galleryImages.length) % galleryImages.length);
  const nextImage = () =>
    setSelectedImageIndex((i) => (i + 1) % galleryImages.length);

  const handleAddToBag = () => {
    if (currentColor.soldOut) return;
    if (!selectedSize) {
      setSizeError(true);
      return;
    }
    // Don't let the bag exceed available stock for this colour + size.
    const sizeQty = currentColor.sizeStock?.[selectedSize];
    if (sizeQty != null) {
      const inBag = items
        .filter((i) => i.productId === product.id && i.color === currentColor.name && i.size === selectedSize)
        .reduce((sum, i) => sum + i.quantity, 0);
      if (inBag >= sizeQty) {
        toast.error(sizeQty <= 0 ? "This size is sold out." : `Only ${sizeQty} left in ${selectedSize}.`);
        return;
      }
    }
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      color: currentColor.name,
      image: currentColor.image,
    });
  };

  const related = adminProducts
    .filter((p) => p.id !== product.id && p.category === product.category)
    .slice(0, 4);

  const details = product.details || [];

  return (
    <Layout>
      <div className="min-h-screen bg-[#f8f6f2] pt-[96px] md:pt-24">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-4 px-3 py-3 sm:gap-5 sm:px-4 md:px-6 md:py-6 lg:grid-cols-[minmax(0,1.62fr)_minmax(360px,0.82fr)] lg:items-start">

          {/* Gallery */}
          <div className="min-w-0 lg:sticky lg:top-24">
            <div className="flex flex-col gap-3 lg:flex-row lg:gap-3">

              {/* Thumbnail rail — horizontal on mobile, vertical on desktop */}
              {hasManyImages && (
                <div className="order-2 flex gap-2 overflow-x-auto pb-1 lg:order-1 lg:w-[76px] lg:flex-col lg:overflow-x-visible lg:overflow-y-auto lg:pb-0 lg:h-[78vh] scrollbar-hide">
                  {galleryImages.map((img, i) => (
                    <button
                      key={`${img}-${i}`}
                      onClick={() => setSelectedImageIndex(i)}
                      className={`flex-none w-[62px] lg:w-full ${getProductThumbnailFrameClassName(i === selectedImageIndex)}`}
                      aria-label={`View image ${i + 1}`}
                    >
                      <img
                        src={img}
                        alt=""
                        loading="lazy"
                        className={getProductThumbnailImageClassName()}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Main image */}
              <div
                className={`order-1 lg:order-2 cursor-zoom-in ${getProductMainImageFrameClassName()}`}
                onClick={() => openLightbox()}
              >
                <img
                  key={`${galleryImages[selectedImageIndex]}-${selectedImageIndex}`}
                  src={galleryImages[selectedImageIndex]}
                  alt={`${product.name} in ${currentColor.name}`}
                  loading="eager"
                  decoding="async"
                  className={getProductMainImageClassName()}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src =
                      "/placeholder.svg";
                  }}
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxOpen(true);
                  }}
                  className="absolute right-3 top-3 inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/85 shadow-sm backdrop-blur"
                  aria-label="Open full-screen image"
                >
                  <ZoomIn className="h-4 w-4" />
                </button>

                {/* Prev / Next arrows — only on mobile when multiple images */}
                {hasManyImages && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        prevImage();
                      }}
                      className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 shadow-sm backdrop-blur lg:hidden"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        nextImage();
                      }}
                      className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 shadow-sm backdrop-blur lg:hidden"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>

                    {/* Dot indicators on mobile */}
                    <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-white/70 px-2 py-1 backdrop-blur lg:hidden">
                      {galleryImages.map((_, i) => (
                        <button
                          key={i}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImageIndex(i);
                          }}
                          className={`h-1.5 rounded-full transition-all duration-200 ${
                            i === selectedImageIndex ? "w-4 bg-black" : "w-1.5 bg-black/30"
                          }`}
                          aria-label={`Go to image ${i + 1}`}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          <Dialog open={lightboxOpen} onOpenChange={(open) => { if (!open) closeLightbox(); }}>
            <DialogContent className="flex h-[100dvh] w-screen max-w-none items-center justify-center border-none bg-black/95 p-0 sm:rounded-none overflow-hidden">
              <DialogTitle className="sr-only">{product.name} — {currentColor.name}</DialogTitle>

              {/* Close */}
              <button
                onClick={closeLightbox}
                className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Zoom hint */}
              {zoom === 1 && (
                <span className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 text-[11px] text-white/50 pointer-events-none select-none">
                  Scroll or pinch to zoom
                </span>
              )}

              {/* Reset zoom button */}
              {zoom > 1 && (
                <button
                  onClick={resetZoom}
                  className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 text-[11px] text-white/70 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur hover:bg-white/20"
                >
                  Reset zoom
                </button>
              )}

              {/* Zoomable image container */}
              <div
                className="absolute inset-0 flex items-center justify-center"
                style={{ cursor: zoom > 1 ? "grab" : "zoom-in" }}
                onWheel={(e) => {
                  e.preventDefault();
                  const delta = e.deltaY > 0 ? -0.15 : 0.15;
                  setZoom((z) => Math.min(5, Math.max(1, z + delta)));
                  if (zoom + delta <= 1) setPan({ x: 0, y: 0 });
                }}
                onMouseDown={(e) => {
                  if (zoom <= 1) return;
                  dragRef.current = { startX: e.clientX, startY: e.clientY, panX: pan.x, panY: pan.y };
                }}
                onMouseMove={(e) => {
                  if (!dragRef.current) return;
                  setPan({
                    x: dragRef.current.panX + (e.clientX - dragRef.current.startX),
                    y: dragRef.current.panY + (e.clientY - dragRef.current.startY),
                  });
                }}
                onMouseUp={() => { dragRef.current = null; }}
                onMouseLeave={() => { dragRef.current = null; }}
                onTouchStart={(e) => {
                  if (e.touches.length === 2) {
                    const dx = e.touches[0].clientX - e.touches[1].clientX;
                    const dy = e.touches[0].clientY - e.touches[1].clientY;
                    pinchRef.current = Math.sqrt(dx * dx + dy * dy);
                  } else if (e.touches.length === 1 && zoom > 1) {
                    dragRef.current = { startX: e.touches[0].clientX, startY: e.touches[0].clientY, panX: pan.x, panY: pan.y };
                  }
                }}
                onTouchMove={(e) => {
                  if (e.touches.length === 2 && pinchRef.current !== null) {
                    e.preventDefault();
                    const dx = e.touches[0].clientX - e.touches[1].clientX;
                    const dy = e.touches[0].clientY - e.touches[1].clientY;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const scale = dist / pinchRef.current;
                    setZoom((z) => Math.min(5, Math.max(1, z * scale)));
                    pinchRef.current = dist;
                  } else if (e.touches.length === 1 && dragRef.current) {
                    setPan({
                      x: dragRef.current.panX + (e.touches[0].clientX - dragRef.current.startX),
                      y: dragRef.current.panY + (e.touches[0].clientY - dragRef.current.startY),
                    });
                  }
                }}
                onTouchEnd={() => { dragRef.current = null; pinchRef.current = null; }}
                onClick={() => {
                  if (zoom === 1) setZoom(2.5);
                  else resetZoom();
                }}
              >
                <img
                  src={galleryImages[selectedImageIndex]}
                  alt={`${product.name} in ${currentColor.name}`}
                  draggable={false}
                  style={{
                    transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
                    transition: dragRef.current ? "none" : "transform 0.15s ease",
                    maxHeight: "90vh",
                    maxWidth: "92vw",
                    objectFit: "contain",
                    userSelect: "none",
                  }}
                />
              </div>

              {/* Prev / Next — hidden when zoomed */}
              {hasManyImages && zoom === 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); prevImage(); }}
                    className="absolute left-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); nextImage(); }}
                    className="absolute right-4 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur hover:bg-white/20"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}
            </DialogContent>
          </Dialog>

          <Dialog open={sizeChartOpen} onOpenChange={setSizeChartOpen}>
            <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
              <DialogTitle>Size Guide{product.productType ? ` — ${product.productType}` : ""}</DialogTitle>
              {(() => {
                const typeKey = product.productType
                  ? `${product.category}:${product.productType.toLowerCase().replace(/\s+/g, "-")}`
                  : null;
                const chartUrl =
                  (typeKey && siteSettings.sizeChartImages?.[typeKey]) ||
                  siteSettings.sizeChartImages?.[product.category] ||
                  siteSettings.sizeChartImage;
                return chartUrl ? (
                  <img
                    src={normalizeImageUrl(chartUrl)}
                    alt="Size chart"
                    className="w-full h-auto rounded-md"
                  />
                ) : null;
              })()}
            </DialogContent>
          </Dialog>

          {/* Info */}
          <aside className="lg:sticky lg:top-24">
            <div className="rounded-2xl border border-[#172838] bg-[#0c1622] p-5 shadow-xl md:p-6 text-white">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <div className="mb-2 flex items-center gap-2 text-[11px] text-cyan-400 font-semibold tracking-wider uppercase">
                    <Link to="/" className="hover:text-cyan-300 transition-colors">Home</Link>
                    <span>/</span>
                    <Link to="/shop" className="hover:text-cyan-300 transition-colors">Shop</Link>
                    <span>/</span>
                    <span className="text-slate-400 capitalize">{product.category?.replace(/-/g, " ")}</span>
                  </div>
                  <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-tight">
                    {product.name}
                  </h1>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-2xl font-extrabold text-[#00c8f8]">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-xs text-slate-400">
                      {(product as any).stock || 25} in stock
                    </span>
                  </div>
                </div>
              </div>

              {/* Sizes / Options */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-5">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-slate-300 mb-2">
                    Select Variant / Option
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => {
                          setSelectedSize(size);
                          setSizeError(false);
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                          selectedSize === size
                            ? "bg-[#00c8f8] text-slate-950 font-bold shadow-md shadow-cyan-500/20"
                            : "bg-[#111e2c] border border-[#1d3347] text-slate-300 hover:text-white hover:border-cyan-400/50"
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 mt-4">
                <button
                  onClick={handleAddToBag}
                  className="min-h-12 rounded-full bg-[#00c8f8] hover:bg-cyan-300 active:scale-95 text-slate-950 text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2"
                >
                  Add to Cart
                </button>
                <button
                  onClick={() => {
                    handleAddToBag();
                    window.location.href = "/checkout";
                  }}
                  className="min-h-12 rounded-full bg-[#111e2c] hover:bg-[#162738] border border-[#1d3347] hover:border-cyan-400 text-white text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2"
                >
                  Buy Now
                </button>
              </div>

              {/* Live Arrival Guarantee Callout */}
              <div className="mt-5 p-3.5 rounded-xl bg-[#08121c] border border-[#172838] flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#00d796]/10 border border-[#00d796]/30 flex items-center justify-center shrink-0">
                  <span className="w-2 h-2 rounded-full bg-[#00d796]" />
                </div>
                <div className="text-xs">
                  <span className="font-bold text-white block">100% Live Arrival Guaranteed</span>
                  <span className="text-slate-400 text-[11px]">Shipped in insulated thermocol with medical-grade oxygen.</span>
                </div>
              </div>
            </div>

            <Tabs
              defaultValue="details"
              className="mt-4 rounded-2xl border border-[#172838] bg-[#0c1622] p-4 shadow-xl text-white"
            >
              <TabsList className="grid h-auto w-full grid-cols-3 rounded-none border-b border-[#172838] bg-transparent p-0">
                <TabsTrigger
                  value="details"
                  className="rounded-none border-b-2 border-transparent py-3 text-xs font-bold text-slate-400 data-[state=active]:border-[#00c8f8] data-[state=active]:text-white data-[state=active]:bg-transparent"
                >
                  Specifications
                </TabsTrigger>
                <TabsTrigger
                  value="care"
                  className="rounded-none border-b-2 border-transparent py-3 text-xs font-bold text-slate-400 data-[state=active]:border-[#00c8f8] data-[state=active]:text-white data-[state=active]:bg-transparent"
                >
                  Acclimation
                </TabsTrigger>
                <TabsTrigger
                  value="shipping"
                  className="rounded-none border-b-2 border-transparent py-3 text-xs font-bold text-slate-400 data-[state=active]:border-[#00c8f8] data-[state=active]:text-white data-[state=active]:bg-transparent"
                >
                  Live Delivery
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-4 px-2 pb-2 text-xs space-y-3">
                {details.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {details.map((d) => (
                      <div key={d.label} className="p-2.5 rounded-xl bg-[#070e15] border border-[#172838]">
                        <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block">{d.label}</span>
                        <span className="text-xs text-slate-200 mt-0.5 block">{d.value}</span>
                      </div>
                    ))}
                  </div>
                )}
                {product.description ? (
                  <div className="mt-3">
                    <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider block mb-1">Description</span>
                    <p className="leading-relaxed text-slate-300 whitespace-pre-line">{product.description}</p>
                  </div>
                ) : null}
              </TabsContent>

              <TabsContent value="care" className="mt-4 px-2 pb-2 text-xs text-slate-300 space-y-2">
                <p className="font-semibold text-white">Acclimation Protocol for Live Animals &amp; Plants:</p>
                <ol className="list-decimal list-inside space-y-1.5 text-slate-400 text-xs">
                  <li>Float unopened transport bag in your aquarium for 15-20 minutes to equalize temperature.</li>
                  <li>Gradually add 1/4 cup of tank water into the transport bag every 5 minutes over 30 minutes (drip acclimation recommended).</li>
                  <li>Net the livestock into your aquarium. Never pour transport water into your display tank.</li>
                </ol>
              </TabsContent>

              <TabsContent value="shipping" className="mt-4 px-2 pb-2 text-xs text-slate-300 space-y-2">
                <p className="font-semibold text-white">Live Arrival Guarantee (Pan-India):</p>
                <p className="leading-relaxed text-slate-400">
                  {product.shippingText || siteSettings.shippingText || "Packed with medical-grade oxygen in temperature-regulated insulated thermocol boxes with 48h thermal packs. 100% Live Arrival Guaranteed pan-India."}
                </p>
              </TabsContent>
            </Tabs>
          </aside>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="px-4 py-16 md:px-8 border-t border-border">
            <h2 className="mb-8 text-sm font-semibold uppercase tracking-[0.15em]">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {related.map((p) => (
                <ShopProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
};

export default ProductDetail;

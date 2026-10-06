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
            <div className="rounded-[10px] border border-black/10 bg-white p-4 shadow-sm md:p-5">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <div className="mb-2 flex items-center gap-2 text-[11px] text-muted-foreground">
                    <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
                    <span>/</span>
                    <Link to="/shop" className="hover:text-foreground transition-colors">Shop</Link>
                  </div>
                  <h1 className="flex items-center gap-1.5 text-lg font-bold leading-tight tracking-tight">
                    {product.name}
                    <Bookmark className="h-4 w-4 fill-muted text-muted" />
                  </h1>
                  <p className="mt-1 text-sm font-semibold text-muted-foreground">
                    {formatPrice(product.price)}
                  </p>
                </div>
                {(() => {
                  const typeKey = product.productType
                    ? `${product.category}:${product.productType.toLowerCase().replace(/\s+/g, "-")}`
                    : null;
                  const hasChart =
                    (typeKey && siteSettings.sizeChartImages?.[typeKey]) ||
                    siteSettings.sizeChartImages?.[product.category] ||
                    siteSettings.sizeChartImage;
                  return hasChart;
                })() && (
                  <button
                    onClick={() => setSizeChartOpen(true)}
                    className="inline-flex items-center gap-1 rounded-md bg-black/5 px-3 py-1.5 text-[11px] font-semibold hover:bg-black/10"
                  >
                    <Ruler className="h-3.5 w-3.5" />
                    Size Guide
                  </button>
                )}
              </div>

              {product.colors.length > 1 && (
                <div className="mb-4">
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                    Colour — {currentColor.name}
                    {currentColor.soldOut && (
                      <span className="ml-1.5 text-[10px] font-semibold text-red-500">Sold Out</span>
                    )}
                  </p>
                  <div className="flex gap-2">
                    {product.colors.map((c, i) => (
                      <button
                        key={c.name}
                        onClick={() => setColorIndex(i)}
                        className={`relative h-8 w-8 rounded-full border-2 transition-all duration-300 hover:scale-110 active:scale-95 ${
                          i === colorIndex ? "border-foreground" : "border-white"
                        } ${c.soldOut ? "opacity-50" : ""}`}
                        style={{ backgroundColor: c.hex }}
                        aria-label={`${c.name}${c.soldOut ? " (Sold Out)" : ""}`}
                      >
                        {c.soldOut && (
                          <span className="absolute inset-0 flex items-center justify-center">
                            <span className="block w-[1.5px] h-full rotate-45 bg-white/80 rounded-full" />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-4">
                <p className="sr-only">Size</p>
                {sizeError && (
                  <p className="mb-2 text-xs font-semibold text-sold-out">
                    Please select a size
                  </p>
                )}
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-2">
                  {product.sizes.map((size) => {
                    const sizeQty = currentColor.sizeStock?.[size];
                    const hasStockInfo = sizeQty != null;
                    const isSizeSoldOut =
                      currentColor.soldOutSizes?.includes(size) || (hasStockInfo && sizeQty <= 0);
                    const isLowStock = hasStockInfo && sizeQty > 0 && sizeQty <= 3;
                    return (
                      <div key={size} className="flex flex-col items-center gap-0.5">
                        <button
                          onClick={() => {
                            if (isSizeSoldOut) return;
                            setSelectedSize(size);
                            setSizeError(false);
                          }}
                          disabled={isSizeSoldOut}
                          className={`w-full min-h-12 rounded-full border text-sm font-semibold transition-all duration-300 ${
                            isSizeSoldOut
                              ? "cursor-not-allowed border-black/10 bg-muted text-muted-foreground/40 relative overflow-hidden"
                              : selectedSize === size
                              ? "border-black bg-black text-white shadow-lg hover:scale-[1.02] active:scale-[0.98]"
                              : "border-black/10 bg-white hover:border-black hover:scale-[1.02] active:scale-[0.98]"
                          }`}
                        >
                          {isSizeSoldOut ? (
                            <span className="flex flex-col items-center leading-tight">
                              <span className="line-through text-xs">{size}</span>
                            </span>
                          ) : size}
                        </button>
                        {isSizeSoldOut && (
                          <span className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/60">Sold Out</span>
                        )}
                        {!isSizeSoldOut && isLowStock && (
                          <span className="text-[9px] font-semibold uppercase tracking-widest text-destructive/80">Only {sizeQty} left</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {(() => {
                  const isColorSoldOut = currentColor.soldOut;
                  const isSoldOut = product.soldOut || isColorSoldOut;
                  return (
                    <>
                      <button
                        onClick={handleAddToBag}
                        disabled={isSoldOut}
                        className={`min-h-14 rounded-full border border-black/10 text-xs font-semibold uppercase tracking-[0.12em] transition-all duration-300 active:scale-[0.98] ${
                          isSoldOut
                            ? "bg-muted text-muted-foreground cursor-not-allowed"
                            : "bg-white text-black hover:border-black"
                        }`}
                      >
                        {isSoldOut ? "Sold Out" : "Add to Bag"}
                      </button>
                      <button
                        onClick={handleAddToBag}
                        disabled={isSoldOut}
                        className="min-h-14 rounded-full bg-black text-xs font-semibold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:bg-black/85 active:scale-[0.98] disabled:bg-muted disabled:text-muted-foreground"
                      >
                        {isSoldOut ? "Sold Out" : "Buy Now"}
                      </button>
                    </>
                  );
                })()}
              </div>
            </div>

            <Tabs
              defaultValue="details"
              className="mt-4 rounded-[10px] border border-black/10 bg-white p-4 shadow-sm md:p-5"
            >
              <TabsList className="grid h-auto w-full grid-cols-3 rounded-none border-b border-black/20 bg-transparent p-0">
                <TabsTrigger
                  value="details"
                  className="rounded-none border-b-2 border-transparent py-3 text-xs font-bold data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  Details & Description
                </TabsTrigger>
                <TabsTrigger
                  value="washcare"
                  className="rounded-none border-b-2 border-transparent py-3 text-xs font-bold data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  Washcare
                </TabsTrigger>
                <TabsTrigger
                  value="shipping"
                  className="rounded-none border-b-2 border-transparent py-3 text-xs font-bold data-[state=active]:border-black data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                >
                  Shipping
                </TabsTrigger>
              </TabsList>

              <TabsContent value="details" className="mt-4 max-h-[360px] overflow-y-auto px-3 pb-2 text-sm">
                {details.length > 0 && (
                  <div className="mb-4 space-y-1">
                    <h2 className="text-xs font-bold">Details</h2>
                    {details.map((d) => (
                      <p key={d.label} className="text-muted-foreground">
                        {d.value}
                      </p>
                    ))}
                  </div>
                )}
                {product.description ? (
                  <>
                    <h2 className="mb-2 text-xs font-bold">Description</h2>
                    <p className="leading-relaxed text-muted-foreground whitespace-pre-line">{product.description}</p>
                  </>
                ) : null}
              </TabsContent>

              <TabsContent value="washcare" className="mt-4 px-3 pb-2 text-sm text-muted-foreground">
                <p className="whitespace-pre-line">{siteSettings.washcareText || "Dry clean recommended. Wash dark colors separately and avoid direct ironing on prints."}</p>
              </TabsContent>

              <TabsContent value="shipping" className="mt-4 px-3 pb-2 text-sm text-muted-foreground">
                <p className="whitespace-pre-line">{siteSettings.shippingText || "Packed within 24 hours. Free delivery pan-India. Dispatches next day for in-stock products."}</p>
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

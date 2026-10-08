import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdmin } from "@/contexts/AdminContext";
import { Product, ProductColor } from "@/data/products";
import { Plus, Pencil, Trash2, X, ImagePlus, Palette, Upload, GripVertical, CheckCircle, AlertCircle } from "lucide-react";
import { api } from "@/lib/api";
import { formatSizesInput, parseSizesInput } from "@/lib/productSizes";
import { createClientId } from "@/lib/clientId";
import { formatPrice, formatPriceInputValue, parsePriceInput } from "@/lib/price";
import { normalizeImageUrl } from "@/lib/productGallery";
import { compressImagesForWebsite } from "@/lib/imageCompression";
import { UploadZone } from "@/components/admin/UploadZone";

const emptyProduct: Omit<Product, "id"> = {
  name: "", slug: "", price: 0, category: "", colors: [], sizes: [],
  description: "", details: [],
};
const emptyColor: ProductColor = { name: "", hex: "#1a1a1a", image: "", images: [] };

type UploadState = "idle" | "uploading" | "done" | "error";

interface ColorUploadStatus {
  primary: UploadState;
  gallery: UploadState;
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function AdminProducts() {
  const { adminProducts, adminCollections, siteSettings, addProduct, updateProduct, deleteProduct } = useAdmin();

  const [editing, setEditing] = useState<Product | null>(null);
  const [sizesInput, setSizesInput] = useState("");
  const [isNew, setIsNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<Record<number, ColorUploadStatus>>({});
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null);

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok });
    setTimeout(() => setToast(null), 3500);
  };

  const setColorUpload = (colorIdx: number, slot: "primary" | "gallery", state: UploadState) => {
    setUploadStatus((prev) => ({
      ...prev,
      [colorIdx]: { ...(prev[colorIdx] ?? { primary: "idle", gallery: "idle" }), [slot]: state },
    }));
  };

  const openNew = () => {
    setEditing({ id: createClientId(), ...emptyProduct } as Product);
    setSizesInput("");
    setIsNew(true);
    setUploadStatus({});
  };

  const openEdit = (p: Product) => {
    setEditing({ ...p, colors: p.colors.map((c) => ({ ...c, images: c.images || [] })) });
    setSizesInput(formatSizesInput(p.sizes));
    setIsNew(false);
    setUploadStatus({});
  };

  const close = () => { setEditing(null); setUploadStatus({}); };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      const sizes = parseSizesInput(sizesInput);
      const product = {
        ...editing,
        sizes,
        soldOutSizes: (editing.soldOutSizes || []).filter((s) => sizes.includes(s)),
      };
      if (isNew) await addProduct(product);
      else await updateProduct(product.id, product);
      showToast(isNew ? "Product added." : "Changes saved.");
      close();
    } catch {
      showToast("Failed to save. Please try again.", false);
    } finally {
      setSaving(false);
    }
  };

  const toggleSizeSoldOut = (size: string) => {
    if (!editing) return;
    const current = editing.soldOutSizes || [];
    setEditing({
      ...editing,
      soldOutSizes: current.includes(size)
        ? current.filter((s) => s !== size)
        : [...current, size],
    });
  };

  const handlePrimaryUpload = async (files: FileList, colorIdx: number) => {
    if (!editing) return;
    setColorUpload(colorIdx, "primary", "uploading");
    try {
      const compressed = await compressImagesForWebsite([files[0]]);
      const results = await api.upload(compressed);
      const url = normalizeImageUrl(results[0].url);
      setEditing((prev) => prev && ({
        ...prev,
        colors: prev.colors.map((c, i) => i === colorIdx ? { ...c, image: url } : c),
      }));
      setColorUpload(colorIdx, "primary", "done");
      showToast("Primary image uploaded.");
    } catch {
      setColorUpload(colorIdx, "primary", "error");
      showToast("Upload failed. Check your connection.", false);
    }
  };

  const handleGalleryUpload = async (files: FileList, colorIdx: number) => {
    if (!editing) return;
    setColorUpload(colorIdx, "gallery", "uploading");
    try {
      const compressed = await compressImagesForWebsite(Array.from(files));
      const results = await api.upload(compressed);
      const newUrls = results.map((r) => normalizeImageUrl(r.url));
      setEditing((prev) => prev && ({
        ...prev,
        colors: prev.colors.map((c, i) =>
          i === colorIdx ? { ...c, images: [...(c.images || []), ...newUrls] } : c
        ),
      }));
      setColorUpload(colorIdx, "gallery", "done");
      showToast(`${results.length} photo${results.length !== 1 ? "s" : ""} added.`);
    } catch {
      setColorUpload(colorIdx, "gallery", "error");
      showToast("Gallery upload failed.", false);
    }
  };

  const removeGalleryImage = (colorIdx: number, imgIdx: number) => {
    if (!editing) return;
    setEditing((prev) => prev && ({
      ...prev,
      colors: prev.colors.map((c, i) =>
        i === colorIdx ? { ...c, images: (c.images || []).filter((_, j) => j !== imgIdx) } : c
      ),
    }));
  };

  const addColor = () => {
    if (!editing) return;
    setEditing({ ...editing, colors: [...editing.colors, { ...emptyColor }] });
  };

  const removeColor = (idx: number) => {
    if (!editing) return;
    setEditing({ ...editing, colors: editing.colors.filter((_, i) => i !== idx) });
  };

  const updateColor = (idx: number, field: keyof ProductColor, value: string) => {
    if (!editing) return;
    setEditing({
      ...editing,
      colors: editing.colors.map((c, i) => i === idx ? { ...c, [field]: value } : c),
    });
  };

  const totalPhotos = editing
    ? editing.colors.reduce((n, c) => n + (c.image ? 1 : 0) + (c.images?.length || 0), 0)
    : 0;

  return (
    <AdminLayout>
      {/* Toast notification */}
      {toast && (
        <div className={`fixed top-5 right-5 z-[100] flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-xl text-sm font-medium animate-in slide-in-from-top-2 duration-300 ${
          toast.ok ? "bg-foreground text-background" : "bg-destructive text-white"
        }`}>
          {toast.ok
            ? <CheckCircle className="h-4 w-4 shrink-0" />
            : <AlertCircle className="h-4 w-4 shrink-0" />}
          {toast.msg}
        </div>
      )}

      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-heading tracking-tight">Products</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{adminProducts.length} product{adminProducts.length !== 1 ? "s" : ""} total</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 text-xs font-semibold tracking-[0.1em] uppercase rounded-lg hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      {/* Products table */}
      <div className="bg-background border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-secondary/40">
                <th className="text-left px-4 py-3 text-xs font-semibold tracking-[0.1em] uppercase text-muted-foreground">Image</th>
                <th className="text-left px-4 py-3 text-xs font-semibold tracking-[0.1em] uppercase text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 text-xs font-semibold tracking-[0.1em] uppercase text-muted-foreground hidden md:table-cell">Category</th>
                <th className="text-left px-4 py-3 text-xs font-semibold tracking-[0.1em] uppercase text-muted-foreground">Price</th>
                <th className="text-left px-4 py-3 text-xs font-semibold tracking-[0.1em] uppercase text-muted-foreground hidden md:table-cell">Colors</th>
                <th className="text-left px-4 py-3 text-xs font-semibold tracking-[0.1em] uppercase text-muted-foreground hidden md:table-cell">Status</th>
                <th className="text-right px-4 py-3 text-xs font-semibold tracking-[0.1em] uppercase text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {adminProducts.map((p) => (
                <tr key={p.id} className="border-b border-border last:border-0 hover:bg-secondary/20 transition-colors">
                  <td className="px-4 py-3">
                    {p.colors[0]?.image ? (
                      <img
                        src={normalizeImageUrl(p.colors[0].image)}
                        alt={p.name}
                        className="w-12 h-14 object-cover rounded-lg border border-border"
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/placeholder.svg"; }}
                      />
                    ) : (
                      <div className="w-12 h-14 bg-secondary rounded-lg border border-border flex items-center justify-center">
                        <ImagePlus className="h-4 w-4 text-muted-foreground/50" />
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-xs text-muted-foreground font-mono mt-0.5">{p.slug}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell capitalize">{p.category}</td>
                  <td className="px-4 py-3 font-semibold">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    <div className="flex gap-1.5 items-center">
                      {p.colors.map((c, i) => (
                        <span
                          key={i}
                          title={c.name}
                          className="w-4 h-4 rounded-full border border-border/60 shadow-sm"
                          style={{ backgroundColor: c.hex }}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell">
                    {p.soldOut ? (
                      <span className="text-[11px] font-semibold bg-destructive/10 text-destructive px-2.5 py-1 rounded-full">Sold Out</span>
                    ) : p.isNew ? (
                      <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full">New</span>
                    ) : (
                      <span className="text-[11px] font-semibold bg-secondary text-muted-foreground px-2.5 py-1 rounded-full">Active</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEdit(p)}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors"
                        title="Edit product"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="p-2 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {adminProducts.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-20 text-center">
                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                      <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center">
                        <ImagePlus className="h-6 w-6 opacity-50" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">No products yet</p>
                        <p className="text-xs mt-0.5 opacity-70">Click "Add Product" to create your first listing</p>
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ════ Full-screen side panel ════ */}
      {editing && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="hidden md:block flex-1 bg-black/40 backdrop-blur-sm"
            onClick={close}
          />

          {/* Panel */}
          <div className="w-full md:max-w-3xl bg-background flex flex-col h-full overflow-hidden shadow-2xl border-l border-border">

            {/* ── Header ── */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-border shrink-0 bg-background/95 backdrop-blur">
              <div>
                <h3 className="text-base font-bold tracking-tight">
                  {isNew ? "New Product" : `Editing — ${editing.name || "Untitled"}`}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isNew ? "Add details and photos to create a new product." : "Update product info and manage photos."}
                </p>
              </div>
              <button onClick={close} className="p-2 hover:bg-secondary rounded-lg transition-colors ml-4 shrink-0">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* ── Scrollable body ── */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-6 py-6 space-y-8">

                {/* ── Section 1: Product Info ── */}
                <section>
                  <div className="flex items-center gap-2 mb-5">
                    <span className="w-6 h-6 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center shrink-0">1</span>
                    <h4 className="text-sm font-bold">Product Info</h4>
                  </div>

                  <div className="space-y-4">
                    {/* Name */}
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-1.5">
                        Product Name <span className="text-destructive">*</span>
                      </label>
                      <input
                        value={editing.name}
                        onChange={(e) => setEditing({
                          ...editing,
                          name: e.target.value,
                          slug: e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
                        })}
                        className="w-full border border-border bg-transparent px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/60 transition-colors"
                        placeholder="e.g. Classic Crew Neck"
                      />
                      {editing.slug && (
                        <p className="mt-1 text-[11px] text-muted-foreground font-mono">
                          /product/<span className="text-foreground">{editing.slug}</span>
                        </p>
                      )}
                    </div>

                    {/* Price + Category */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-1.5">
                          Price (₹) <span className="text-destructive">*</span>
                        </label>
                        <input
                          type="number"
                          value={formatPriceInputValue(editing.price)}
                          onChange={(e) => setEditing({ ...editing, price: parsePriceInput(e.target.value) })}
                          className="w-full border border-border bg-transparent px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/60 transition-colors"
                          placeholder="1999"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-1.5">Category</label>
                        {(() => {
                          const productCats = [...new Set(adminProducts.map((p) => p.category).filter(Boolean))];
                          const settingsCats: string[] = siteSettings.categories ?? [];
                          // Normalize product categories against settings (case-insensitive match)
                          const normalizedProductCats = productCats.map((pc) => {
                            const match = settingsCats.find((sc) => sc.toLowerCase() === pc.toLowerCase());
                            return match ?? pc;
                          });
                          const allCats = [...new Set([...settingsCats, ...normalizedProductCats])].sort();
                          // Find the display value — match current category case-insensitively
                          const selectedCat = allCats.find((c) => c.toLowerCase() === (editing.category ?? "").toLowerCase()) ?? editing.category;
                          return allCats.length > 0 ? (
                            <select
                              value={selectedCat}
                              onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                              className="w-full border border-border bg-background px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/60 transition-colors"
                            >
                              <option value="">Select a category…</option>
                              {allCats.map((c) => (
                                <option key={c} value={c}>{c}</option>
                              ))}
                            </select>
                          ) : (
                            <input
                              value={editing.category}
                              onChange={(e) => setEditing({ ...editing, category: e.target.value })}
                              className="w-full border border-border bg-transparent px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/60 transition-colors"
                              placeholder="hoodies, t-shirts, bottoms…"
                            />
                          );
                        })()}
                        <p className="mt-1 text-[11px] text-muted-foreground">
                          Manage categories in{" "}
                          <a href="/admin/categories" className="underline hover:text-foreground">Admin → Categories</a>
                        </p>
                      </div>
                    </div>

                    {/* Product Type — shown when category has defined types */}
                    {(() => {
                      const catKey = Object.keys(siteSettings.categoryTypes ?? {}).find(
                        (k) => k.toLowerCase() === (editing.category ?? "").toLowerCase()
                      );
                      const types = catKey ? (siteSettings.categoryTypes![catKey] ?? []) : [];
                      if (types.length === 0) return null;
                      return (
                        <div>
                          <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-1.5">Product Type</label>
                          <select
                            value={editing.productType || ""}
                            onChange={(e) => setEditing({ ...editing, productType: e.target.value || undefined })}
                            className="w-full border border-border bg-background px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/60 transition-colors"
                          >
                            <option value="">No specific type</option>
                            {types.map((t) => (
                              <option key={t} value={t}>{t}</option>
                            ))}
                          </select>
                          <p className="mt-1 text-[11px] text-muted-foreground">Selects the size chart shown on the product page.</p>
                        </div>
                      );
                    })()}

                    {/* Collection + Sizes */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-1.5">Collection</label>
                        <select
                          value={editing.collectionId || ""}
                          onChange={(e) => setEditing({ ...editing, collectionId: e.target.value || undefined })}
                          className="w-full border border-border bg-background px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/60 transition-colors"
                        >
                          <option value="">No Collection</option>
                          {adminCollections.map((c) => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-1.5">Sizes</label>
                        <input
                          value={sizesInput}
                          onChange={(e) => setSizesInput(e.target.value)}
                          className="w-full border border-border bg-transparent px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/60 transition-colors"
                          placeholder="XS, S, M, L, XL"
                        />
                      </div>
                    </div>

                    {/* Per-size sold out */}
                    {parseSizesInput(sizesInput).length > 0 && (
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-1.5">
                          Sold Out Sizes
                          <span className="ml-1 normal-case font-normal opacity-60 tracking-normal">— tap a size to mark it out of stock</span>
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {parseSizesInput(sizesInput).map((size) => {
                            const isOut = (editing.soldOutSizes || []).includes(size);
                            return (
                              <button
                                key={size}
                                type="button"
                                onClick={() => toggleSizeSoldOut(size)}
                                className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors ${
                                  isOut
                                    ? "border-destructive/30 bg-destructive/10 text-destructive line-through"
                                    : "border-border bg-transparent hover:border-foreground/40"
                                }`}
                              >
                                {size}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Description */}
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-1.5">Description</label>
                      <textarea
                        value={editing.description}
                        onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                        rows={3}
                        className="w-full border border-border bg-transparent px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/60 transition-colors resize-none"
                        placeholder="Describe the product — fabric, fit, feel…"
                      />
                    </div>

                    {/* Washcare override */}
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-1.5">Washcare</label>
                      <textarea
                        value={editing.washcareText || ""}
                        onChange={(e) => setEditing({ ...editing, washcareText: e.target.value })}
                        rows={2}
                        className="w-full border border-border bg-transparent px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/60 transition-colors resize-none"
                        placeholder={siteSettings.washcareText || "Leave blank to use the default from Settings"}
                      />
                      <p className="text-xs text-muted-foreground mt-1">Leave blank to use the site-wide text from Settings.</p>
                    </div>

                    {/* Shipping override */}
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-1.5">Shipping</label>
                      <textarea
                        value={editing.shippingText || ""}
                        onChange={(e) => setEditing({ ...editing, shippingText: e.target.value })}
                        rows={2}
                        className="w-full border border-border bg-transparent px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/60 transition-colors resize-none"
                        placeholder={siteSettings.shippingText || "Leave blank to use the default from Settings"}
                      />
                      <p className="text-xs text-muted-foreground mt-1">Leave blank to use the site-wide text from Settings.</p>
                    </div>

                    {/* Details */}
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-[0.08em]">Details</label>
                        <button
                          type="button"
                          onClick={() => setEditing({ ...editing, details: [...(editing.details || []), { label: "", value: "" }] })}
                          className="flex items-center gap-1 text-xs font-semibold uppercase tracking-widest border border-border px-2.5 py-1 rounded-lg hover:bg-secondary transition-colors"
                        >
                          <Plus className="h-3 w-3" /> Add
                        </button>
                      </div>
                      <div className="space-y-2">
                        {(editing.details || []).map((detail, i) => (
                          <div key={i} className="flex gap-2 items-center">
                            <input
                              value={detail.label}
                              onChange={(e) => {
                                const updated = [...(editing.details || [])];
                                updated[i] = { ...updated[i], label: e.target.value };
                                setEditing({ ...editing, details: updated });
                              }}
                              placeholder="Label (e.g. Material)"
                              className="w-[38%] border border-border bg-transparent px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/60 transition-colors"
                            />
                            <input
                              value={detail.value}
                              onChange={(e) => {
                                const updated = [...(editing.details || [])];
                                updated[i] = { ...updated[i], value: e.target.value };
                                setEditing({ ...editing, details: updated });
                              }}
                              placeholder="Value (e.g. 100% Cotton)"
                              className="flex-1 border border-border bg-transparent px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/60 transition-colors"
                            />
                            <button
                              type="button"
                              onClick={() => setEditing({ ...editing, details: (editing.details || []).filter((_, j) => j !== i) })}
                              className="text-muted-foreground hover:text-destructive transition-colors p-1"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                        {(editing.details || []).length === 0 && (
                          <p className="text-xs text-muted-foreground py-1">No details yet — click Add to insert a row.</p>
                        )}
                      </div>
                    </div>

                    {/* Toggles */}
                    <div className="flex items-center gap-8 pt-1">
                      {[
                        { label: "Mark as New", field: "isNew" as const, color: "bg-emerald-600" },
                        { label: "Sold Out", field: "soldOut" as const, color: "bg-destructive" },
                      ].map(({ label, field, color }) => (
                        <button
                          key={field}
                          type="button"
                          onClick={() => setEditing({ ...editing, [field]: !editing[field] })}
                          className="flex items-center gap-3 select-none"
                        >
                          <div className={`w-10 h-6 rounded-full transition-colors duration-200 relative ${editing[field] ? color : "bg-border"}`}>
                            <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${editing[field] ? "translate-x-5" : "translate-x-1"}`} />
                          </div>
                          <span className="text-sm font-medium">{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </section>

                {/* ── Section 2: Colors & Photos ── */}
                <section>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-foreground text-background text-xs font-bold flex items-center justify-center shrink-0">2</span>
                      <h4 className="text-sm font-bold flex items-center gap-1.5">
                        <Palette className="h-4 w-4" />
                        Colors &amp; Photos
                      </h4>
                    </div>
                    <button
                      onClick={addColor}
                      className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest border border-border px-3 py-1.5 rounded-lg hover:bg-secondary transition-colors"
                    >
                      <Plus className="h-3.5 w-3.5" /> Add Color
                    </button>
                  </div>

                  {editing.colors.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-border rounded-xl text-muted-foreground">
                      <Palette className="h-10 w-10 mx-auto mb-3 opacity-30" />
                      <p className="text-sm font-semibold">No color variants yet</p>
                      <p className="text-xs mt-1 opacity-60">Click "Add Color" to set up your first variant with photos</p>
                    </div>
                  )}

                  <div className="space-y-6">
                    {editing.colors.map((color, colorIdx) => {
                      const status = uploadStatus[colorIdx] ?? { primary: "idle", gallery: "idle" };

                      return (
                        <div key={colorIdx} className="border border-border rounded-2xl overflow-hidden bg-background shadow-sm">
                          {/* Color card header */}
                          <div className="flex items-center gap-3 px-4 py-3 bg-secondary/20 border-b border-border">
                            <GripVertical className="h-4 w-4 text-muted-foreground/40 shrink-0" />
                            <div
                              className="w-5 h-5 rounded-full border-2 border-white shadow-sm shrink-0"
                              style={{ backgroundColor: color.hex }}
                            />
                            <span className="text-sm font-bold flex-1 min-w-0 truncate">
                              {color.name || <em className="font-normal text-muted-foreground not-italic">Unnamed color</em>}
                            </span>
                            <span className="text-xs text-muted-foreground font-mono shrink-0">
                              {(color.images?.length || 0) + (color.image ? 1 : 0)} photo{(color.images?.length || 0) + (color.image ? 1 : 0) !== 1 ? "s" : ""}
                            </span>
                            <button
                              onClick={() => removeColor(colorIdx)}
                              className="p-1.5 hover:bg-destructive/10 text-destructive rounded-lg transition-colors shrink-0"
                              title="Remove this color"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>

                          <div className="p-5 space-y-6">
                            {/* Name + Hex row */}
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-1.5">Color Name</label>
                                <input
                                  value={color.name}
                                  onChange={(e) => updateColor(colorIdx, "name", e.target.value)}
                                  className="w-full border border-border bg-transparent px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/60"
                                  placeholder="e.g. Black, Olive, Cream…"
                                />
                              </div>
                              <div>
                                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-1.5">Swatch Color</label>
                                <div className="flex items-center gap-2">
                                  <input
                                    type="color"
                                    value={color.hex}
                                    onChange={(e) => updateColor(colorIdx, "hex", e.target.value)}
                                    className="w-10 h-10 rounded-lg border border-border cursor-pointer bg-transparent p-0.5 shrink-0"
                                  />
                                  <input
                                    value={color.hex}
                                    onChange={(e) => updateColor(colorIdx, "hex", e.target.value)}
                                    className="flex-1 border border-border bg-transparent px-3 py-2 text-sm rounded-lg font-mono focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/60"
                                    placeholder="#1a1a1a"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Primary image */}
                            <div>
                              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-3">
                                Primary Photo <span className="text-destructive">*</span>
                                <span className="ml-1 normal-case font-normal opacity-60 tracking-normal">— shown on product cards</span>
                              </label>
                              <div className="flex items-start gap-4">
                                {/* Current primary preview */}
                                <div className="shrink-0 w-32 h-40 rounded-xl overflow-hidden border border-border bg-secondary/30 relative group">
                                  {color.image ? (
                                    <>
                                      <img
                                        src={normalizeImageUrl(color.image)}
                                        alt={color.name || "Primary"}
                                        className="w-full h-full object-cover"
                                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/placeholder.svg"; }}
                                      />
                                      <button
                                        onClick={() => updateColor(colorIdx, "image", "")}
                                        className="absolute top-1.5 right-1.5 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                                        title="Remove photo"
                                      >
                                        <X className="h-3 w-3" />
                                      </button>
                                    </>
                                  ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                                      <ImagePlus className="h-7 w-7 opacity-40" />
                                      <span className="text-[10px] font-medium opacity-60">No photo</span>
                                    </div>
                                  )}
                                </div>

                                {/* Upload zone */}
                                <UploadZone
                                  onFiles={(files) => handlePrimaryUpload(files, colorIdx)}
                                  disabled={status.primary === "uploading"}
                                  className="flex-1 h-40"
                                >
                                  <div className="h-full flex flex-col items-center justify-center gap-2 p-4 text-center">
                                    {status.primary === "uploading" ? (
                                      <>
                                        <div className="w-7 h-7 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
                                        <span className="text-xs text-muted-foreground font-medium">Uploading…</span>
                                      </>
                                    ) : status.primary === "done" ? (
                                      <>
                                        <CheckCircle className="h-7 w-7 text-emerald-600" />
                                        <span className="text-xs text-emerald-700 font-semibold">Uploaded!</span>
                                        <span className="text-[10px] text-muted-foreground">Drop or click to replace</span>
                                      </>
                                    ) : status.primary === "error" ? (
                                      <>
                                        <AlertCircle className="h-6 w-6 text-destructive" />
                                        <span className="text-xs text-destructive font-semibold">Upload failed</span>
                                        <span className="text-[10px] text-muted-foreground">Click to retry</span>
                                      </>
                                    ) : (
                                      <>
                                        <Upload className="h-7 w-7 text-muted-foreground opacity-50" />
                                        <span className="text-xs font-semibold text-foreground">Drop photo here</span>
                                        <span className="text-[10px] text-muted-foreground">or click to browse files</span>
                                        <span className="text-[10px] text-muted-foreground opacity-70">JPG · PNG · WEBP</span>
                                        <span className="text-[10px] text-muted-foreground opacity-50 mt-0.5">Best size: 1200 × 1500 px</span>
                                      </>
                                    )}
                                  </div>
                                </UploadZone>
                              </div>
                            </div>

                            {/* Gallery images */}
                            <div>
                              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-[0.08em] mb-3">
                                Gallery Photos
                                <span className="ml-1 normal-case font-normal opacity-60 tracking-normal">— extra views shown in product gallery</span>
                              </label>

                              <div className="flex flex-wrap gap-2.5">
                                {(color.images || []).map((img, imgIdx) => (
                                  <div
                                    key={imgIdx}
                                    className="group relative w-24 h-28 rounded-xl overflow-hidden border border-border bg-secondary/30 shrink-0"
                                  >
                                    <img
                                      src={normalizeImageUrl(img)}
                                      alt={`View ${imgIdx + 1}`}
                                      className="w-full h-full object-cover"
                                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/placeholder.svg"; }}
                                    />
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors rounded-xl" />
                                    <button
                                      onClick={() => removeGalleryImage(colorIdx, imgIdx)}
                                      className="absolute top-1.5 right-1.5 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                                      title="Remove"
                                    >
                                      <X className="h-2.5 w-2.5" />
                                    </button>
                                    <span className="absolute bottom-1.5 left-2 text-[9px] font-bold text-white/90 bg-black/40 px-1.5 py-0.5 rounded-full">
                                      #{imgIdx + 1}
                                    </span>
                                  </div>
                                ))}

                                {/* Add gallery zone */}
                                <UploadZone
                                  onFiles={(files) => handleGalleryUpload(files, colorIdx)}
                                  multiple
                                  disabled={status.gallery === "uploading"}
                                  className="w-24 h-28 shrink-0"
                                >
                                  <div className="h-full flex flex-col items-center justify-center gap-1.5">
                                    {status.gallery === "uploading" ? (
                                      <div className="w-5 h-5 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
                                    ) : (
                                      <>
                                        <Plus className="h-5 w-5 text-muted-foreground opacity-50" />
                                        <span className="text-[9px] font-semibold text-muted-foreground text-center leading-tight px-1">Add Photos</span>
                                        <span className="text-[8px] text-muted-foreground opacity-60">multi-select ok</span>
                                      </>
                                    )}
                                  </div>
                                </UploadZone>
                              </div>

                              {(color.images || []).length === 0 && (
                                <p className="mt-2 text-[11px] text-muted-foreground/50 italic">
                                  No gallery photos yet. These appear as thumbnails in the product viewer.
                                </p>
                              )}
                            </div>

                            {/* Colour-level sold out */}
                            <div className="mt-1 flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => setEditing((prev) => prev && ({
                                  ...prev,
                                  colors: prev.colors.map((c, i) =>
                                    i === colorIdx ? { ...c, soldOut: !c.soldOut } : c
                                  ),
                                }))}
                                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-colors ${
                                  color.soldOut
                                    ? "bg-black text-white border-black"
                                    : "bg-transparent text-muted-foreground border-border hover:border-foreground/40"
                                }`}
                              >
                                  {color.soldOut ? "● Sold Out" : "Mark colour as Sold Out"}
                              </button>
                            </div>

                            {/* Per-colour, per-size stock quantity (0 = sold out) */}
                            {!color.soldOut && parseSizesInput(sizesInput).length > 0 && (
                              <div className="px-4 pb-4">
                                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-muted-foreground mb-2">
                                  Stock per Size for {color.name || "this colour"}
                                  <span className="ml-1 normal-case font-normal opacity-60 tracking-normal">— set quantity, 0 = sold out</span>
                                </p>
                                <div className="flex flex-wrap gap-3">
                                  {parseSizesInput(sizesInput).map((size) => {
                                    const qty = color.sizeStock?.[size] ?? 0;
                                    return (
                                      <div key={size} className="flex flex-col items-center gap-1">
                                        <span className={`text-[11px] font-semibold uppercase ${qty <= 0 ? "text-destructive line-through" : ""}`}>{size}</span>
                                        <input
                                          type="number"
                                          min="0"
                                          value={qty}
                                          onChange={(e) => {
                                            const n = Math.max(0, parseInt(e.target.value, 10) || 0);
                                            setEditing((prev) => prev && ({
                                              ...prev,
                                              colors: prev.colors.map((c, i) => i === colorIdx ? {
                                                ...c,
                                                sizeStock: { ...(c.sizeStock || {}), [size]: n },
                                              } : c),
                                            }));
                                          }}
                                          className="w-16 border border-border rounded-md px-2 py-1 text-sm text-center bg-transparent focus:outline-none focus:border-foreground"
                                        />
                                        {qty <= 0 && <span className="text-[9px] font-semibold uppercase text-destructive">Sold out</span>}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              </div>
            </div>

            {/* ── Footer ── */}
            <div className="shrink-0 border-t border-border px-6 py-4 flex items-center justify-between bg-background/95 backdrop-blur">
              <p className="text-xs text-muted-foreground hidden sm:block">
                {editing.colors.length} color{editing.colors.length !== 1 ? "s" : ""}
                {" · "}
                {totalPhotos} photo{totalPhotos !== 1 ? "s" : ""}
              </p>
              <div className="flex items-center gap-3 ml-auto">
                <button
                  onClick={close}
                  className="px-5 py-2.5 border border-border text-xs font-semibold uppercase tracking-[0.08em] rounded-lg hover:bg-secondary transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={save}
                  disabled={saving}
                  className="px-6 py-2.5 bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-[0.08em] rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center gap-2 shadow-sm"
                >
                  {saving && (
                    <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  )}
                  {saving ? "Saving…" : isNew ? "Add Product" : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdmin } from "@/contexts/AdminContext";
import { Plus, Trash2, Tag, ChevronDown, ChevronUp, X, Upload, ImagePlus } from "lucide-react";
import { UploadZone } from "@/components/admin/UploadZone";
import { api } from "@/lib/api";
import { normalizeImageUrl } from "@/lib/productGallery";
import { compressImagesForWebsite } from "@/lib/imageCompression";
import { toast } from "@/hooks/use-toast";

type UploadState = "idle" | "uploading" | "done" | "error";

function typeKey(category: string, typeName: string) {
  return `${category}:${typeName.toLowerCase().replace(/\s+/g, "-")}`;
}

export default function AdminCategories() {
  const { adminProducts, siteSettings, updateSiteSettings } = useAdmin();
  const [newName, setNewName] = useState("");
  const [adding, setAdding] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [newTypeInput, setNewTypeInput] = useState<Record<string, string>>({});
  const [categoryUploadStatus, setCategoryUploadStatus] = useState<Record<string, UploadState>>({});
  const [typeUploadStatus, setTypeUploadStatus] = useState<Record<string, UploadState>>({});

  const settingsCategories: string[] = siteSettings.categories ?? [];
  const productCategories = [...new Set(adminProducts.map((p) => p.category).filter(Boolean))];
  // Normalize product categories against settings (case-insensitive match), then merge
  const normalizedProductCats = productCategories.map((pc) => {
    const match = settingsCategories.find((sc) => sc.toLowerCase() === pc.toLowerCase());
    return match ?? pc;
  });
  const allCategories = [...new Set([...settingsCategories, ...normalizedProductCats])].sort();

  const productCount = (cat: string) =>
    adminProducts.filter((p) => p.category.toLowerCase() === cat.toLowerCase()).length;

  const handleAdd = async () => {
    const name = newName.trim().toLowerCase();
    if (!name || allCategories.some((c) => c.toLowerCase() === name)) return;
    setAdding(true);
    await updateSiteSettings({ categories: [...settingsCategories, name] });
    setNewName("");
    setAdding(false);
    setExpanded(name);
    toast({ title: `"${name}" added`, description: "Category saved. Now add a size chart or product types." });
  };

  const handleDelete = async (cat: string) => {
    const count = productCount(cat);
    if (count > 0 && !confirm(`"${cat}" is used by ${count} product${count !== 1 ? "s" : ""}. Remove from category list?`)) return;
    await updateSiteSettings({ categories: settingsCategories.filter((c) => c !== cat) });
    if (expanded === cat) setExpanded(null);
    toast({ title: `"${cat}" removed` });
  };

  // ── Category size chart upload ──────────────────────────────────────────────
  const handleCategoryChartUpload = async (category: string, files: FileList) => {
    setCategoryUploadStatus((prev) => ({ ...prev, [category]: "uploading" }));
    try {
      const compressed = await compressImagesForWebsite([files[0]]);
      const results = await api.upload(compressed);
      const url = normalizeImageUrl(results[0].url);
      await updateSiteSettings({
        sizeChartImages: { ...(siteSettings.sizeChartImages ?? {}), [category]: url },
      });
      setCategoryUploadStatus((prev) => ({ ...prev, [category]: "done" }));
      toast({ title: "Size chart saved", description: `Size chart for "${category}" is live.` });
    } catch {
      setCategoryUploadStatus((prev) => ({ ...prev, [category]: "error" }));
      toast({ title: "Upload failed", description: "Check your connection and try again.", variant: "destructive" });
    }
  };

  const removeCategoryChart = async (category: string) => {
    const updated = { ...(siteSettings.sizeChartImages ?? {}) };
    delete updated[category];
    await updateSiteSettings({ sizeChartImages: updated });
  };

  // ── Product types ───────────────────────────────────────────────────────────
  const addType = async (category: string) => {
    const name = (newTypeInput[category] ?? "").trim();
    if (!name) return;
    const existing: string[] = siteSettings.categoryTypes?.[category] ?? [];
    if (existing.includes(name)) return;
    await updateSiteSettings({
      categoryTypes: {
        ...(siteSettings.categoryTypes ?? {}),
        [category]: [...existing, name],
      },
    });
    setNewTypeInput((prev) => ({ ...prev, [category]: "" }));
  };

  const removeType = async (category: string, typeName: string) => {
    const key = typeKey(category, typeName);
    const existing: string[] = siteSettings.categoryTypes?.[category] ?? [];
    const updatedImages = { ...(siteSettings.sizeChartImages ?? {}) };
    delete updatedImages[key];
    await updateSiteSettings({
      categoryTypes: {
        ...(siteSettings.categoryTypes ?? {}),
        [category]: existing.filter((t) => t !== typeName),
      },
      sizeChartImages: updatedImages,
    });
  };

  // ── Type size chart upload ──────────────────────────────────────────────────
  const handleTypeChartUpload = async (category: string, typeName: string, files: FileList) => {
    const key = typeKey(category, typeName);
    setTypeUploadStatus((prev) => ({ ...prev, [key]: "uploading" }));
    try {
      const compressed = await compressImagesForWebsite([files[0]]);
      const results = await api.upload(compressed);
      const url = normalizeImageUrl(results[0].url);
      await updateSiteSettings({
        sizeChartImages: { ...(siteSettings.sizeChartImages ?? {}), [key]: url },
      });
      setTypeUploadStatus((prev) => ({ ...prev, [key]: "done" }));
      toast({ title: "Size chart saved", description: `Size chart for "${typeName}" saved.` });
    } catch {
      setTypeUploadStatus((prev) => ({ ...prev, [key]: "error" }));
      toast({ title: "Upload failed", description: "Check your connection and try again.", variant: "destructive" });
    }
  };

  const removeTypeChart = async (category: string, typeName: string) => {
    const key = typeKey(category, typeName);
    const updated = { ...(siteSettings.sizeChartImages ?? {}) };
    delete updated[key];
    await updateSiteSettings({ sizeChartImages: updated });
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-heading tracking-tight">Categories</h2>
          <p className="text-sm text-muted-foreground mt-0.5">{allCategories.length} categor{allCategories.length !== 1 ? "ies" : "y"}</p>
        </div>
      </div>

      {/* Add new category */}
      <div className="bg-background border border-border rounded-xl p-5 mb-6 shadow-sm">
        <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">New Category</h3>
        <div className="flex gap-3">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder="e.g. hoodies, t-shirts, bottoms…"
            className="flex-1 border border-border bg-transparent px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/60 transition-colors"
          />
          <button
            onClick={handleAdd}
            disabled={adding || !newName.trim()}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2.5 text-xs font-semibold tracking-[0.1em] uppercase rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 shadow-sm"
          >
            <Plus className="h-4 w-4" /> Add
          </button>
        </div>
      </div>

      {/* Category list */}
      {allCategories.length === 0 ? (
        <div className="bg-background border border-border rounded-xl py-20 text-center shadow-sm">
          <Tag className="h-10 w-10 mx-auto mb-3 text-muted-foreground/30" />
          <p className="text-sm font-semibold text-muted-foreground">No categories yet</p>
          <p className="text-xs mt-1 text-muted-foreground/60">Add a category above or create products with categories</p>
        </div>
      ) : (
        <div className="space-y-3">
          {allCategories.map((cat) => {
            const count = productCount(cat);
            const inSettings = settingsCategories.includes(cat);
            const isExpanded = expanded === cat;
            const types: string[] = siteSettings.categoryTypes?.[cat] ?? [];
            const categoryChartUrl = siteSettings.sizeChartImages?.[cat] ?? "";
            const catUploadStatus = categoryUploadStatus[cat] ?? "idle";

            return (
              <div key={cat} className="bg-background border border-border rounded-xl overflow-hidden shadow-sm">
                {/* Category header row */}
                <div className="flex items-center gap-3 px-4 py-3">
                  <button
                    className="flex-1 flex items-center gap-3 text-left"
                    onClick={() => setExpanded(isExpanded ? null : cat)}
                  >
                    {isExpanded ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0" /> : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0" />}
                    <span className="font-semibold capitalize">{cat}</span>
                    <span className="text-xs text-muted-foreground">{count} product{count !== 1 ? "s" : ""}</span>
                    {types.length > 0 && (
                      <span className="text-[10px] bg-secondary px-2 py-0.5 rounded-full text-muted-foreground">{types.length} type{types.length !== 1 ? "s" : ""}</span>
                    )}
                    {categoryChartUrl && (
                      <span className="text-[10px] bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full">size chart ✓</span>
                    )}
                  </button>
                  {!inSettings ? (
                    <button
                      onClick={() => updateSiteSettings({ categories: [...settingsCategories, cat] })}
                      className="text-[10px] font-semibold text-muted-foreground hover:text-foreground border border-border px-2.5 py-1 rounded-full transition-colors shrink-0"
                    >
                      Save to list
                    </button>
                  ) : (
                    <button
                      onClick={() => handleDelete(cat)}
                      className="p-1.5 hover:bg-destructive/10 text-destructive rounded-lg transition-colors shrink-0"
                      title="Remove category"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {/* Expanded panel */}
                {isExpanded && (
                  <div className="border-t border-border px-4 py-5 space-y-6 bg-secondary/10">

                    {/* Category-level size chart */}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                        Size Chart — <span className="capitalize">{cat}</span>
                        <span className="ml-1 normal-case font-normal tracking-normal opacity-60">shown on all {cat} products unless a type-specific chart overrides it</span>
                      </p>
                      <div className="flex items-start gap-4">
                        <div className="shrink-0 w-24 h-32 rounded-xl overflow-hidden border border-border bg-secondary/30 relative group">
                          {categoryChartUrl ? (
                            <>
                              <img src={normalizeImageUrl(categoryChartUrl)} alt="Size chart" className="w-full h-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/placeholder.svg"; }} />
                              <button onClick={() => removeCategoryChart(cat)} className="absolute top-1.5 right-1.5 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm" title="Remove">
                                <X className="h-3 w-3" />
                              </button>
                            </>
                          ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-1">
                              <ImagePlus className="h-6 w-6 opacity-40" />
                              <span className="text-[9px] font-medium opacity-60">None</span>
                            </div>
                          )}
                        </div>
                        <UploadZone onFiles={(files) => handleCategoryChartUpload(cat, files)} disabled={catUploadStatus === "uploading"} className="flex-1 h-32">
                          <div className="h-full flex flex-col items-center justify-center gap-1.5 p-3 text-center">
                            {catUploadStatus === "uploading" ? (
                              <><div className="w-5 h-5 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" /><span className="text-[10px] text-muted-foreground">Uploading…</span></>
                            ) : catUploadStatus === "done" ? (
                              <span className="text-[10px] text-emerald-600 font-semibold">Uploaded ✓ — drop to replace</span>
                            ) : catUploadStatus === "error" ? (
                              <span className="text-[10px] text-destructive font-semibold">Failed — click to retry</span>
                            ) : (
                              <><Upload className="h-5 w-5 text-muted-foreground opacity-50" /><span className="text-[10px] font-semibold text-foreground">Drop or click</span><span className="text-[9px] text-muted-foreground opacity-70">JPG · PNG · WEBP</span></>
                            )}
                          </div>
                        </UploadZone>
                      </div>
                    </div>

                    {/* Product types */}
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-3">
                        Product Types
                        <span className="ml-1 normal-case font-normal tracking-normal opacity-60">each type can have its own size chart</span>
                      </p>

                      {/* Add type */}
                      <div className="flex gap-2 mb-4">
                        <input
                          value={newTypeInput[cat] ?? ""}
                          onChange={(e) => setNewTypeInput((prev) => ({ ...prev, [cat]: e.target.value }))}
                          onKeyDown={(e) => e.key === "Enter" && addType(cat)}
                          className="flex-1 border border-border bg-background px-3 py-2 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/60 transition-colors"
                          placeholder="e.g. Round Neck, V-Neck, Polo…"
                        />
                        <button
                          onClick={() => addType(cat)}
                          disabled={!(newTypeInput[cat] ?? "").trim()}
                          className="px-3 py-2 bg-foreground text-background text-xs font-semibold rounded-lg hover:bg-foreground/80 transition-colors disabled:opacity-40"
                        >
                          Add
                        </button>
                      </div>

                      {/* Types list */}
                      {types.length === 0 ? (
                        <p className="text-[11px] text-muted-foreground/60 italic">No types yet. Products in this category share one size chart.</p>
                      ) : (
                        <div className="space-y-3">
                          {types.map((typeName) => {
                            const key = typeKey(cat, typeName);
                            const chartUrl = siteSettings.sizeChartImages?.[key] ?? "";
                            const tUploadStatus = typeUploadStatus[key] ?? "idle";
                            return (
                              <div key={typeName} className="rounded-xl border border-border/60 bg-background p-3">
                                <div className="flex items-center justify-between mb-3">
                                  <span className="text-sm font-semibold">{typeName}</span>
                                  <button onClick={() => removeType(cat, typeName)} className="p-1 hover:bg-destructive/10 rounded text-destructive transition-colors" title="Remove type">
                                    <X className="h-3.5 w-3.5" />
                                  </button>
                                </div>
                                <div className="flex items-start gap-3">
                                  <div className="shrink-0 w-16 h-20 rounded-lg overflow-hidden border border-border bg-secondary/30 relative group">
                                    {chartUrl ? (
                                      <>
                                        <img src={normalizeImageUrl(chartUrl)} alt={`${typeName} chart`} className="w-full h-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/placeholder.svg"; }} />
                                        <button onClick={() => removeTypeChart(cat, typeName)} className="absolute top-0.5 right-0.5 bg-black/60 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity" title="Remove chart">
                                          <X className="h-2.5 w-2.5" />
                                        </button>
                                      </>
                                    ) : (
                                      <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-1">
                                        <ImagePlus className="h-4 w-4 opacity-40" />
                                        <span className="text-[8px] font-medium opacity-60">No chart</span>
                                      </div>
                                    )}
                                  </div>
                                  <UploadZone onFiles={(files) => handleTypeChartUpload(cat, typeName, files)} disabled={tUploadStatus === "uploading"} className="flex-1 h-20">
                                    <div className="h-full flex flex-col items-center justify-center gap-1 p-2 text-center">
                                      {tUploadStatus === "uploading" ? (
                                        <><div className="w-4 h-4 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" /><span className="text-[9px] text-muted-foreground">Uploading…</span></>
                                      ) : tUploadStatus === "done" ? (
                                        <span className="text-[9px] text-emerald-600 font-semibold">Uploaded ✓</span>
                                      ) : tUploadStatus === "error" ? (
                                        <span className="text-[9px] text-destructive font-semibold">Failed — retry</span>
                                      ) : (
                                        <><Upload className="h-4 w-4 text-muted-foreground opacity-50" /><span className="text-[9px] font-semibold">Size chart</span><span className="text-[8px] text-muted-foreground opacity-70">Drop or click</span></>
                                      )}
                                    </div>
                                  </UploadZone>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </AdminLayout>
  );
}

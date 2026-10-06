import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdmin } from "@/contexts/AdminContext";
import { toast } from "@/hooks/use-toast";
import { normalizeDiscountPercent, normalizeGstPercent } from "@/lib/discount";
import { UploadZone } from "@/components/admin/UploadZone";
import { api } from "@/lib/api";
import { normalizeImageUrl } from "@/lib/productGallery";
import { compressImagesForWebsite } from "@/lib/imageCompression";
import { Upload, ImagePlus, X } from "lucide-react";

type UploadState = "idle" | "uploading" | "done" | "error";

export default function AdminSettings() {
  const { siteSettings, updateSiteSettings, isLoading } = useAdmin();
  const [form, setForm] = useState(siteSettings);
  const [discountInput, setDiscountInput] = useState(String(siteSettings.offerDiscountPercent));
  const [gstInput, setGstInput] = useState(String(siteSettings.gstPercent));
  const [deliveryFeeInput, setDeliveryFeeInput] = useState(String(siteSettings.deliveryFee ?? 0));
  const [formSynced, setFormSynced] = useState(false);
  const [chartUploadStatus, setChartUploadStatus] = useState<UploadState>("idle");

  // Sync form once after API data finishes loading
  useEffect(() => {
    if (!isLoading && !formSynced) {
      setForm(siteSettings);
      setDiscountInput(String(siteSettings.offerDiscountPercent));
      setGstInput(String(siteSettings.gstPercent));
      setDeliveryFeeInput(String(siteSettings.deliveryFee ?? 0));
      setFormSynced(true);
    }
  }, [isLoading, formSynced, siteSettings]);

  const save = async () => {
    try {
      await updateSiteSettings({
        ...form,
        offerDiscountPercent: normalizeDiscountPercent(discountInput),
        gstPercent: normalizeGstPercent(gstInput),
        deliveryFee: Math.max(0, Number(deliveryFeeInput) || 0),
      });
      toast({ title: "Settings saved", description: "Your changes are live on the storefront." });
    } catch {
      toast({ title: "Save failed", description: "Could not save settings. Please try again.", variant: "destructive" });
    }
  };

  const handleSizeChartUpload = async (files: FileList) => {
    setChartUploadStatus("uploading");
    try {
      const compressed = await compressImagesForWebsite([files[0]]);
      const results = await api.upload(compressed);
      const url = normalizeImageUrl(results[0].url);
      setForm((prev) => ({ ...prev, sizeChartImage: url }));
      setChartUploadStatus("done");
    } catch {
      setChartUploadStatus("error");
      toast({ title: "Upload failed", description: "Please check your connection and try again.", variant: "destructive" });
    }
  };

  return (
    <AdminLayout>
      <h2 className="text-2xl font-heading tracking-tight mb-8">Site Settings</h2>

      <div className="max-w-xl space-y-6">

        <div className="bg-background border border-border rounded-lg p-6 space-y-4">
          <h3 className="text-sm font-semibold tracking-[0.1em] uppercase">Brand</h3>
          <div>
            <label className="block text-xs font-semibold tracking-[0.1em] uppercase mb-1.5">Brand Name</label>
            <input value={form.brandName} onChange={(e) => setForm({ ...form, brandName: e.target.value })} className="w-full border border-border bg-transparent px-3 py-2 text-sm rounded-md focus:outline-none focus:border-foreground" />
          </div>
        </div>

        <div className="bg-background border border-border rounded-lg p-6 space-y-4">
          <h3 className="text-sm font-semibold tracking-[0.1em] uppercase">Marquee Banner</h3>
          <div>
            <label className="block text-xs font-semibold tracking-[0.1em] uppercase mb-1.5">Banner Text</label>
            <textarea value={form.marqueeText} onChange={(e) => setForm({ ...form, marqueeText: e.target.value })} rows={2} className="w-full border border-border bg-transparent px-3 py-2 text-sm rounded-md focus:outline-none focus:border-foreground resize-none" />
            <p className="text-xs text-muted-foreground mt-1">This text scrolls across the top of the site.</p>
          </div>
        </div>

        <div className="bg-background border border-border rounded-lg p-6 space-y-4">
          <h3 className="text-sm font-semibold tracking-[0.1em] uppercase">Footer</h3>
          <div>
            <label className="block text-xs font-semibold tracking-[0.1em] uppercase mb-1.5">Tagline</label>
            <input value={form.footerTagline} onChange={(e) => setForm({ ...form, footerTagline: e.target.value })} className="w-full border border-border bg-transparent px-3 py-2 text-sm rounded-md focus:outline-none focus:border-foreground" />
          </div>
        </div>

        <div className="bg-background border border-border rounded-lg p-6 space-y-4">
          <h3 className="text-sm font-semibold tracking-[0.1em] uppercase">Offer Discount</h3>
          <div>
            <label className="block text-xs font-semibold tracking-[0.1em] uppercase mb-1.5">Storewide Discount (%)</label>
            <input type="number" min="0" max="90" value={discountInput} onChange={(e) => setDiscountInput(e.target.value)} className="w-full border border-border bg-transparent px-3 py-2 text-sm rounded-md focus:outline-none focus:border-foreground" />
            <p className="text-xs text-muted-foreground mt-1">Applied automatically in the bag, checkout, and Razorpay payment amount.</p>
          </div>
        </div>

        <div className="bg-background border border-border rounded-lg p-6 space-y-4">
          <h3 className="text-sm font-semibold tracking-[0.1em] uppercase">Tax</h3>
          <div>
            <label className="block text-xs font-semibold tracking-[0.1em] uppercase mb-1.5">GST (%)</label>
            <input type="number" min="0" max="100" step="0.01" value={gstInput} onChange={(e) => setGstInput(e.target.value)} className="w-full border border-border bg-transparent px-3 py-2 text-sm rounded-md focus:outline-none focus:border-foreground" />
            <p className="text-xs text-muted-foreground mt-1">GST is inclusive — extracted from the price, not added on top.</p>
          </div>
        </div>

        <div className="bg-background border border-border rounded-lg p-6 space-y-4">
          <h3 className="text-sm font-semibold tracking-[0.1em] uppercase">Delivery Fee</h3>
          <div>
            <label className="block text-xs font-semibold tracking-[0.1em] uppercase mb-1.5">Flat Delivery Fee (₹)</label>
            <input type="number" min="0" step="1" value={deliveryFeeInput} onChange={(e) => setDeliveryFeeInput(e.target.value)} className="w-full border border-border bg-transparent px-3 py-2 text-sm rounded-md focus:outline-none focus:border-foreground" />
            <p className="text-xs text-muted-foreground mt-1">Set to 0 for free shipping. Shown as a line item in bag and checkout.</p>
          </div>
        </div>

        <div className="bg-background border border-border rounded-lg p-6 space-y-4">
          <h3 className="text-sm font-semibold tracking-[0.1em] uppercase">Product Tabs</h3>
          <div>
            <label className="block text-xs font-semibold tracking-[0.1em] uppercase mb-1.5">Shipping Text</label>
            <textarea value={form.shippingText ?? ""} onChange={(e) => setForm({ ...form, shippingText: e.target.value })} rows={3} className="w-full border border-border bg-transparent px-3 py-2 text-sm rounded-md focus:outline-none focus:border-foreground resize-none" placeholder="Shipping info shown on every product page…" />
          </div>
          <div>
            <label className="block text-xs font-semibold tracking-[0.1em] uppercase mb-1.5">Washcare Text</label>
            <textarea value={form.washcareText ?? ""} onChange={(e) => setForm({ ...form, washcareText: e.target.value })} rows={3} className="w-full border border-border bg-transparent px-3 py-2 text-sm rounded-md focus:outline-none focus:border-foreground resize-none" placeholder="Wash care instructions shown on every product page…" />
          </div>
        </div>

        <div className="bg-background border border-border rounded-lg p-6 space-y-4">
          <h3 className="text-sm font-semibold tracking-[0.1em] uppercase">Size Chart — Default</h3>
          <div>
            <p className="text-xs text-muted-foreground mb-3">
              Global fallback shown when no category-specific chart is set.{" "}
              <a href="/admin/categories" className="underline hover:text-foreground">Manage per-category charts →</a>
            </p>
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-32 h-40 rounded-xl overflow-hidden border border-border bg-secondary/30 relative group">
                {form.sizeChartImage ? (
                  <>
                    <img src={normalizeImageUrl(form.sizeChartImage)} alt="Size chart" className="w-full h-full object-cover" onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/placeholder.svg"; }} />
                    <button onClick={() => setForm({ ...form, sizeChartImage: "" })} className="absolute top-1.5 right-1.5 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm" title="Remove">
                      <X className="h-3 w-3" />
                    </button>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground gap-2">
                    <ImagePlus className="h-7 w-7 opacity-40" />
                    <span className="text-[10px] font-medium opacity-60">No chart</span>
                  </div>
                )}
              </div>
              <UploadZone onFiles={handleSizeChartUpload} disabled={chartUploadStatus === "uploading"} className="flex-1 h-40">
                <div className="h-full flex flex-col items-center justify-center gap-2 p-4 text-center">
                  {chartUploadStatus === "uploading" ? (
                    <><div className="w-7 h-7 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" /><span className="text-xs text-muted-foreground font-medium">Uploading…</span></>
                  ) : chartUploadStatus === "done" ? (
                    <span className="text-xs text-emerald-600 font-semibold">Uploaded ✓ — drop to replace</span>
                  ) : chartUploadStatus === "error" ? (
                    <span className="text-xs text-destructive font-semibold">Upload failed — click to retry</span>
                  ) : (
                    <><Upload className="h-7 w-7 text-muted-foreground opacity-50" /><span className="text-xs font-semibold text-foreground">Drop image here</span><span className="text-[10px] text-muted-foreground">or click to browse · JPG · PNG · WEBP</span></>
                  )}
                </div>
              </UploadZone>
            </div>
          </div>
        </div>

        <button onClick={save} className="w-full bg-primary text-primary-foreground py-3 text-xs font-semibold tracking-[0.1em] uppercase rounded-md hover:bg-primary/90 transition-colors">
          Save Settings
        </button>
      </div>
    </AdminLayout>
  );
}

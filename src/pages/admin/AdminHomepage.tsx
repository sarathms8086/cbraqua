import AdminLayout from "@/components/admin/AdminLayout";
import { useAdmin, MosaicTileData } from "@/contexts/AdminContext";
import { GripVertical, Eye, EyeOff, Pencil, X, Upload, CheckCircle, AlertCircle, ImagePlus, Video } from "lucide-react";
import { useState, useRef } from "react";
import { api } from "@/lib/api";
import { normalizeImageUrl } from "@/lib/productGallery";
import { compressImagesForWebsite } from "@/lib/imageCompression";
import { toast } from "@/hooks/use-toast";

type UploadState = "idle" | "uploading" | "done" | "error";

export default function AdminHomepage() {
  const { mosaicTiles, updateMosaicTile, reorderMosaicTiles, siteSettings, updateSiteSettings } = useAdmin();
  const [videoUploadState, setVideoUploadState] = useState<UploadState>("idle");
  const videoInputRef = useRef<HTMLInputElement>(null);

  const handleVideoUpload = async (files: FileList | null) => {
    if (!files || !files[0]) return;
    setVideoUploadState("uploading");
    try {
      const results = await api.upload([files[0]]);
      const url = results[0].url.replace(/^https?:\/\/[^/]+/, "");
      await updateSiteSettings({ heroVideoUrl: url });
      setVideoUploadState("done");
      toast({ title: "Hero video updated", description: "The homepage video is now live." });
    } catch {
      setVideoUploadState("error");
      toast({ title: "Upload failed", description: "Please try again.", variant: "destructive" });
    }
  };
  const [editing, setEditing] = useState<MosaicTileData | null>(null);
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragStart = (index: number) => setDragIndex(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;
    const reordered = [...mosaicTiles];
    const [moved] = reordered.splice(dragIndex, 1);
    reordered.splice(index, 0, moved);
    reorderMosaicTiles(reordered);
    setDragIndex(index);
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || !files[0] || !editing) return;
    setUploadState("uploading");
    try {
      const compressed = await compressImagesForWebsite([files[0]]);
      const results = await api.upload(compressed);
      const url = normalizeImageUrl(results[0].url);
      setEditing((prev) => prev ? { ...prev, image: url } : prev);
      setUploadState("done");
    } catch {
      setUploadState("error");
    }
  };

  const openEdit = (tile: MosaicTileData) => {
    setEditing({ ...tile });
    setUploadState("idle");
  };

  const save = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      await updateMosaicTile(editing.id, editing);
      setEditing(null);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <h2 className="text-2xl font-heading tracking-tight mb-2">Homepage Editor</h2>
      <p className="text-sm text-muted-foreground mb-8">Drag to reorder tiles. Click edit to change content.</p>

      {/* Hero Video */}
      <div className="bg-background border border-border rounded-xl p-5 mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Video className="h-4 w-4 text-muted-foreground" />
          <div>
            <p className="text-sm font-semibold">Hero Video</p>
            <p className="text-xs text-muted-foreground">Upload a full-quality MP4 (up to 200MB). Replaces the homepage background video.</p>
          </div>
        </div>
        {siteSettings.heroVideoUrl && (
          <video src={siteSettings.heroVideoUrl} className="w-full max-h-40 object-cover rounded-lg mb-3 bg-black" muted />
        )}
        <input ref={videoInputRef} type="file" accept="video/mp4,video/webm,video/mov" className="hidden" onChange={(e) => handleVideoUpload(e.target.files)} />
        <button
          onClick={() => videoInputRef.current?.click()}
          disabled={videoUploadState === "uploading"}
          className="flex items-center gap-2 border border-dashed border-border px-4 py-3 rounded-lg text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground hover:border-foreground/40 transition-colors w-full justify-center disabled:opacity-60"
        >
          {videoUploadState === "uploading" ? (
            <><Upload className="h-3.5 w-3.5 animate-bounce" /> Uploading…</>
          ) : videoUploadState === "done" ? (
            <><CheckCircle className="h-3.5 w-3.5 text-green-500" /> Video updated</>
          ) : videoUploadState === "error" ? (
            <><AlertCircle className="h-3.5 w-3.5 text-destructive" /> Failed — try again</>
          ) : (
            <><Upload className="h-3.5 w-3.5" /> {siteSettings.heroVideoUrl ? "Replace video" : "Upload video"}</>
          )}
        </button>
      </div>

      <div className="space-y-2">
        {mosaicTiles.map((tile, index) => (
          <div
            key={tile.id}
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={(e) => handleDragOver(e, index)}
            className={`flex items-center gap-4 bg-background border border-border rounded-lg p-4 cursor-move transition-opacity ${!tile.visible ? "opacity-50" : ""}`}
          >
            <GripVertical className="h-5 w-5 text-muted-foreground shrink-0" />
            {tile.type === "image" && tile.image ? (
              <img src={normalizeImageUrl(tile.image)} alt={tile.alt || ""} className="w-16 h-12 object-cover rounded shrink-0" onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/placeholder.svg"; }} />
            ) : (
              <div className="w-16 h-12 bg-primary rounded shrink-0 flex items-center justify-center text-primary-foreground text-[10px] font-semibold">CTA</div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{tile.type === "cta" ? tile.heading : tile.label}</p>
              <p className="text-xs text-muted-foreground">{tile.type} • {tile.colSpan} {tile.rowSpan}</p>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={() => updateMosaicTile(tile.id, { visible: !tile.visible })} className="p-1.5 hover:bg-secondary rounded transition-colors">
                {tile.visible ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              </button>
              <button onClick={() => openEdit(tile)} className="p-1.5 hover:bg-secondary rounded transition-colors">
                <Pencil className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50 p-4">
          <div className="bg-background border border-border rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-border sticky top-0 bg-background/95 backdrop-blur z-10">
              <h3 className="text-base font-bold tracking-tight">Edit Tile</h3>
              <button onClick={() => setEditing(null)} className="p-2 hover:bg-secondary rounded-lg transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4">
              {editing.type === "image" ? (
                <>
                  <div>
                    <label className="block text-xs font-semibold tracking-[0.1em] uppercase mb-1.5 text-muted-foreground">Label</label>
                    <input value={editing.label || ""} onChange={(e) => setEditing({ ...editing, label: e.target.value })} className="w-full border border-border bg-transparent px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/60 transition-colors" placeholder="e.g. New Collection" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold tracking-[0.1em] uppercase mb-1.5 text-muted-foreground">Link</label>
                    <input value={editing.link || ""} onChange={(e) => setEditing({ ...editing, link: e.target.value })} className="w-full border border-border bg-transparent px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/60 transition-colors" placeholder="/collections or /shop" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold tracking-[0.1em] uppercase mb-1.5 text-muted-foreground">Image</label>

                    {/* Current image preview */}
                    {editing.image && (
                      <div className="relative mb-3 rounded-xl overflow-hidden border border-border group">
                        <img
                          src={normalizeImageUrl(editing.image)}
                          alt="Current"
                          className="w-full h-48 object-cover"
                          onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/placeholder.svg"; }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                        <button
                          onClick={() => { setEditing({ ...editing, image: "" }); setUploadState("idle"); }}
                          className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                          title="Remove image"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                        <span className="absolute bottom-2 left-3 text-[10px] font-semibold text-white/90 bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm">Current image</span>
                      </div>
                    )}

                    {/* Upload zone */}
                    <div
                      className={`border-2 border-dashed rounded-xl transition-colors cursor-pointer ${uploadState === "error" ? "border-destructive/40 bg-destructive/5" : uploadState === "done" ? "border-emerald-400/60 bg-emerald-50/40" : "border-border hover:border-foreground/30 hover:bg-secondary/30"}`}
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => { e.preventDefault(); handleImageUpload(e.dataTransfer.files); }}
                    >
                      <div className="flex flex-col items-center justify-center gap-2 py-8 px-4 text-center">
                        {uploadState === "uploading" ? (
                          <>
                            <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
                            <span className="text-xs font-medium text-muted-foreground">Uploading…</span>
                          </>
                        ) : uploadState === "done" ? (
                          <>
                            <CheckCircle className="h-8 w-8 text-emerald-600" />
                            <span className="text-xs font-semibold text-emerald-700">Uploaded!</span>
                            <span className="text-[11px] text-muted-foreground">Drop or click to replace</span>
                          </>
                        ) : uploadState === "error" ? (
                          <>
                            <AlertCircle className="h-7 w-7 text-destructive" />
                            <span className="text-xs font-semibold text-destructive">Upload failed — click to retry</span>
                          </>
                        ) : (
                          <>
                            {editing.image ? <Upload className="h-7 w-7 text-muted-foreground/50" /> : <ImagePlus className="h-7 w-7 text-muted-foreground/50" />}
                            <span className="text-xs font-semibold">{editing.image ? "Replace image" : "Upload image"}</span>
                            <span className="text-[11px] text-muted-foreground">Drop here or click to browse · JPG, PNG, WEBP</span>
                          </>
                        )}
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload(e.target.files)}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-xs font-semibold tracking-[0.1em] uppercase mb-1.5 text-muted-foreground">Subtitle</label>
                    <input value={editing.subtitle || ""} onChange={(e) => setEditing({ ...editing, subtitle: e.target.value })} className="w-full border border-border bg-transparent px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/60 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold tracking-[0.1em] uppercase mb-1.5 text-muted-foreground">Heading</label>
                    <input value={editing.heading || ""} onChange={(e) => setEditing({ ...editing, heading: e.target.value })} className="w-full border border-border bg-transparent px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/60 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold tracking-[0.1em] uppercase mb-1.5 text-muted-foreground">Tagline</label>
                    <input value={editing.tagline || ""} onChange={(e) => setEditing({ ...editing, tagline: e.target.value })} className="w-full border border-border bg-transparent px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/60 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold tracking-[0.1em] uppercase mb-1.5 text-muted-foreground">CTA Text</label>
                    <input value={editing.ctaText || ""} onChange={(e) => setEditing({ ...editing, ctaText: e.target.value })} className="w-full border border-border bg-transparent px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/60 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold tracking-[0.1em] uppercase mb-1.5 text-muted-foreground">CTA Link</label>
                    <input value={editing.ctaLink || ""} onChange={(e) => setEditing({ ...editing, ctaLink: e.target.value })} className="w-full border border-border bg-transparent px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/60 transition-colors" />
                  </div>
                </>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold tracking-[0.1em] uppercase mb-1.5 text-muted-foreground">Col Span</label>
                  <input value={editing.colSpan || ""} onChange={(e) => setEditing({ ...editing, colSpan: e.target.value })} className="w-full border border-border bg-transparent px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/60 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-[0.1em] uppercase mb-1.5 text-muted-foreground">Row Span</label>
                  <input value={editing.rowSpan || ""} onChange={(e) => setEditing({ ...editing, rowSpan: e.target.value })} className="w-full border border-border bg-transparent px-3 py-2.5 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-foreground/10 focus:border-foreground/60 transition-colors" />
                </div>
              </div>
            </div>

            <div className="flex gap-3 px-6 py-4 border-t border-border">
              <button
                onClick={save}
                disabled={saving}
                className="flex-1 bg-primary text-primary-foreground py-2.5 text-xs font-semibold tracking-[0.1em] uppercase rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                {saving && <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                {saving ? "Saving…" : "Save Changes"}
              </button>
              <button onClick={() => setEditing(null)} className="px-6 py-2.5 border border-border text-xs font-semibold tracking-[0.1em] uppercase rounded-lg hover:bg-secondary transition-colors">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

import AdminLayout from "@/components/admin/AdminLayout";
import { useAdmin } from "@/contexts/AdminContext";
import { Upload, Trash2 } from "lucide-react";

export default function AdminMedia() {
  const { mediaItems, addMediaItem, deleteMediaItem } = useAdmin();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      await addMediaItem(Array.from(files));
    } catch (err) {
      console.error("Upload failed:", err);
    }
    e.target.value = "";
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-heading tracking-tight">Media Library</h2>
        <label className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-xs font-semibold tracking-[0.1em] uppercase rounded-md hover:bg-primary/90 transition-colors cursor-pointer">
          <Upload className="h-4 w-4" /> Upload
          <input type="file" accept="image/*" multiple onChange={handleUpload} className="hidden" />
        </label>
      </div>

      {mediaItems.length === 0 ? (
        <div className="bg-background border border-border rounded-lg p-12 text-center">
          <p className="text-sm text-muted-foreground">No media files yet. Upload images to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {mediaItems.map((item) => (
            <div key={item.id} className="group relative bg-background border border-border rounded-lg overflow-hidden">
              <img src={item.url} alt={item.name} className="w-full aspect-square object-cover" />
              <div className="p-2">
                <p className="text-xs truncate">{item.name}</p>
              </div>
              <button
                onClick={() => deleteMediaItem(item.id)}
                className="absolute top-2 right-2 p-1.5 bg-background/80 rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}

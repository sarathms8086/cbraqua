import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdmin } from "@/contexts/AdminContext";
import { Collection } from "@/data/collections";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { api } from "@/lib/api";
import { createClientId } from "@/lib/clientId";

export default function AdminCollections() {
  const { adminCollections, addCollection, updateCollection, deleteCollection } = useAdmin();
  const [editing, setEditing] = useState<Collection | null>(null);
  const [isNew, setIsNew] = useState(false);

  const openNew = () => {
    setEditing({ id: createClientId(), name: "", slug: "", description: "", image: "", productCount: 0 });
    setIsNew(true);
  };

  const save = async () => {
    if (!editing) return;
    if (isNew) await addCollection(editing);
    else await updateCollection(editing.id, editing);
    setEditing(null);
  };

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editing) return;
    try {
      const results = await api.upload([file]);
      setEditing({ ...editing, image: results[0].url });
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-heading tracking-tight">Collections</h2>
        <button onClick={openNew} className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-xs font-semibold tracking-[0.1em] uppercase rounded-md hover:bg-primary/90 transition-colors">
          <Plus className="h-4 w-4" /> Add Collection
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {adminCollections.map((c) => (
          <div key={c.id} className="bg-background border border-border rounded-lg overflow-hidden">
            {c.image && <img src={c.image} alt={c.name} className="w-full h-40 object-cover" />}
            <div className="p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold">{c.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{c.description}</p>
                  <p className="text-xs text-muted-foreground mt-2">{c.productCount} products</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setEditing({ ...c }); setIsNew(false); }} className="p-1.5 hover:bg-secondary rounded transition-colors">
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button onClick={() => deleteCollection(c.id)} className="p-1.5 hover:bg-destructive/10 text-destructive rounded transition-colors">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/50">
          <div className="bg-background border border-border rounded-lg w-full max-w-lg m-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-heading">{isNew ? "Add Collection" : "Edit Collection"}</h3>
              <button onClick={() => setEditing(null)}><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold tracking-[0.1em] uppercase mb-1.5">Name</label>
                <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} className="w-full border border-border bg-transparent px-3 py-2 text-sm rounded-md focus:outline-none focus:border-foreground" />
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-[0.1em] uppercase mb-1.5">Description</label>
                <textarea value={editing.description} onChange={(e) => setEditing({ ...editing, description: e.target.value })} rows={3} className="w-full border border-border bg-transparent px-3 py-2 text-sm rounded-md focus:outline-none focus:border-foreground resize-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-[0.1em] uppercase mb-1.5">Cover Image</label>
                <input type="file" accept="image/*" onChange={handleImage} className="w-full text-sm" />
                {editing.image && <img src={editing.image} alt="Preview" className="mt-2 w-full h-32 object-cover rounded" />}
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-xs font-semibold tracking-[0.1em] uppercase mb-1.5">Product Count</label>
                  <input type="number" value={editing.productCount} onChange={(e) => setEditing({ ...editing, productCount: Number(e.target.value) })} className="w-full border border-border bg-transparent px-3 py-2 text-sm rounded-md focus:outline-none focus:border-foreground" />
                </div>
                <label className="flex items-center gap-2 text-sm mt-6">
                  <input type="checkbox" checked={editing.visible !== false} onChange={(e) => setEditing({ ...editing, visible: e.target.checked })} />
                  Visible
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <button onClick={save} className="flex-1 bg-primary text-primary-foreground py-2.5 text-xs font-semibold tracking-[0.1em] uppercase rounded-md hover:bg-primary/90 transition-colors">
                  {isNew ? "Add" : "Save"}
                </button>
                <button onClick={() => setEditing(null)} className="px-6 py-2.5 border border-border text-xs font-semibold tracking-[0.1em] uppercase rounded-md hover:bg-secondary transition-colors">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

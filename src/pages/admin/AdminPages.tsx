import { useState } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { useAdmin } from "@/contexts/AdminContext";
import { PageContent, PolicySection, FaqItem } from "@/contexts/AdminContext";
import { Plus, Trash2, GripVertical, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type Tab = "shipping" | "returns" | "privacy" | "terms" | "faq" | "contact";

const TABS: { key: Tab; label: string }[] = [
  { key: "shipping", label: "Shipping & Delivery" },
  { key: "returns", label: "Returns & Exchanges" },
  { key: "privacy", label: "Privacy Policy" },
  { key: "terms", label: "Terms of Service" },
  { key: "faq", label: "FAQ" },
  { key: "contact", label: "Contact Info" },
];

function SectionsEditor({
  sections,
  onChange,
}: {
  sections: PolicySection[];
  onChange: (s: PolicySection[]) => void;
}) {
  const [expanded, setExpanded] = useState<number | null>(0);

  const update = (i: number, field: keyof PolicySection, val: string) => {
    onChange(sections.map((s, idx) => (idx === i ? { ...s, [field]: val } : s)));
  };

  const add = () => {
    onChange([...sections, { heading: "", body: "" }]);
    setExpanded(sections.length);
  };

  const remove = (i: number) => {
    onChange(sections.filter((_, idx) => idx !== i));
    setExpanded(null);
  };

  const move = (i: number, dir: -1 | 1) => {
    const next = [...sections];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
    setExpanded(j);
  };

  return (
    <div className="space-y-2">
      {sections.map((s, i) => (
        <div key={i} className="border border-border rounded-xl overflow-hidden bg-background">
          <div className="flex items-center gap-2 px-4 py-3 bg-secondary/20">
            <GripVertical className="h-4 w-4 text-muted-foreground/40 shrink-0" />
            <button
              className="flex-1 text-left text-sm font-semibold truncate"
              onClick={() => setExpanded(expanded === i ? null : i)}
            >
              {s.heading || <span className="text-muted-foreground italic font-normal">Untitled section</span>}
            </button>
            <button onClick={() => move(i, -1)} disabled={i === 0} className="p-1 hover:bg-secondary rounded disabled:opacity-30"><ChevronUp className="h-3.5 w-3.5" /></button>
            <button onClick={() => move(i, 1)} disabled={i === sections.length - 1} className="p-1 hover:bg-secondary rounded disabled:opacity-30"><ChevronDown className="h-3.5 w-3.5" /></button>
            <button onClick={() => remove(i)} className="p-1 hover:bg-destructive/10 text-destructive rounded"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
          {expanded === i && (
            <div className="px-4 py-4 space-y-3 border-t border-border">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Heading</label>
                <input
                  value={s.heading}
                  onChange={(e) => update(i, "heading", e.target.value)}
                  className="w-full border border-border bg-transparent px-3 py-2 text-sm rounded-lg focus:outline-none focus:border-foreground"
                  placeholder="e.g. Return Policy"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Body</label>
                <textarea
                  value={s.body}
                  onChange={(e) => update(i, "body", e.target.value)}
                  rows={4}
                  className="w-full border border-border bg-transparent px-3 py-2 text-sm rounded-lg focus:outline-none focus:border-foreground resize-none"
                  placeholder="Paragraph text…"
                />
              </div>
            </div>
          )}
        </div>
      ))}
      <button
        onClick={add}
        className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground border border-dashed border-border px-4 py-3 rounded-xl w-full justify-center hover:border-foreground/40 transition-colors"
      >
        <Plus className="h-3.5 w-3.5" /> Add Section
      </button>
    </div>
  );
}

function FaqEditor({ items, onChange }: { items: FaqItem[]; onChange: (f: FaqItem[]) => void }) {
  const [expanded, setExpanded] = useState<number | null>(0);

  const update = (i: number, field: keyof FaqItem, val: string) => {
    onChange(items.map((item, idx) => (idx === i ? { ...item, [field]: val } : item)));
  };

  const add = () => {
    onChange([...items, { q: "", a: "" }]);
    setExpanded(items.length);
  };

  const remove = (i: number) => {
    onChange(items.filter((_, idx) => idx !== i));
    setExpanded(null);
  };

  const move = (i: number, dir: -1 | 1) => {
    const next = [...items];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
    setExpanded(j);
  };

  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="border border-border rounded-xl overflow-hidden bg-background">
          <div className="flex items-center gap-2 px-4 py-3 bg-secondary/20">
            <GripVertical className="h-4 w-4 text-muted-foreground/40 shrink-0" />
            <button
              className="flex-1 text-left text-sm font-semibold truncate"
              onClick={() => setExpanded(expanded === i ? null : i)}
            >
              {item.q || <span className="text-muted-foreground italic font-normal">Untitled question</span>}
            </button>
            <button onClick={() => move(i, -1)} disabled={i === 0} className="p-1 hover:bg-secondary rounded disabled:opacity-30"><ChevronUp className="h-3.5 w-3.5" /></button>
            <button onClick={() => move(i, 1)} disabled={i === items.length - 1} className="p-1 hover:bg-secondary rounded disabled:opacity-30"><ChevronDown className="h-3.5 w-3.5" /></button>
            <button onClick={() => remove(i)} className="p-1 hover:bg-destructive/10 text-destructive rounded"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
          {expanded === i && (
            <div className="px-4 py-4 space-y-3 border-t border-border">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Question</label>
                <input
                  value={item.q}
                  onChange={(e) => update(i, "q", e.target.value)}
                  className="w-full border border-border bg-transparent px-3 py-2 text-sm rounded-lg focus:outline-none focus:border-foreground"
                  placeholder="How long does shipping take?"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Answer</label>
                <textarea
                  value={item.a}
                  onChange={(e) => update(i, "a", e.target.value)}
                  rows={3}
                  className="w-full border border-border bg-transparent px-3 py-2 text-sm rounded-lg focus:outline-none focus:border-foreground resize-none"
                  placeholder="Answer text…"
                />
              </div>
            </div>
          )}
        </div>
      ))}
      <button
        onClick={add}
        className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground hover:text-foreground border border-dashed border-border px-4 py-3 rounded-xl w-full justify-center hover:border-foreground/40 transition-colors"
      >
        <Plus className="h-3.5 w-3.5" /> Add Question
      </button>
    </div>
  );
}

export default function AdminPages() {
  const { siteSettings, updateSiteSettings } = useAdmin();
  const [activeTab, setActiveTab] = useState<Tab>("shipping");
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<PageContent>(() => siteSettings.pageContent);

  const updateDraft = (key: keyof PageContent, val: any) => {
    setDraft((prev) => ({ ...prev, [key]: val }));
  };

  const save = async () => {
    setSaving(true);
    try {
      await updateSiteSettings({ pageContent: draft });
      toast({ title: "Page content saved", description: "Changes are live on the storefront." });
    } catch {
      toast({ title: "Save failed", description: "Please try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-heading tracking-tight">Pages</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Edit content for all storefront pages</p>
        </div>
        <button
          onClick={save}
          disabled={saving}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 text-xs font-semibold tracking-[0.1em] uppercase rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save Changes"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border mb-6 overflow-x-auto pb-px">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors border-b-2 ${
              activeTab === t.key
                ? "border-foreground text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="max-w-2xl">
        {activeTab === "shipping" && (
          <SectionsEditor sections={draft.shipping} onChange={(v) => updateDraft("shipping", v)} />
        )}
        {activeTab === "returns" && (
          <SectionsEditor sections={draft.returns} onChange={(v) => updateDraft("returns", v)} />
        )}
        {activeTab === "privacy" && (
          <SectionsEditor sections={draft.privacy} onChange={(v) => updateDraft("privacy", v)} />
        )}
        {activeTab === "terms" && (
          <SectionsEditor sections={draft.terms} onChange={(v) => updateDraft("terms", v)} />
        )}
        {activeTab === "faq" && (
          <FaqEditor items={draft.faq} onChange={(v) => updateDraft("faq", v)} />
        )}
        {activeTab === "contact" && (
          <div className="space-y-4 bg-background border border-border rounded-xl p-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Page Subtitle</label>
              <textarea
                value={draft.contact.subtitle}
                onChange={(e) => updateDraft("contact", { ...draft.contact, subtitle: e.target.value })}
                rows={2}
                className="w-full border border-border bg-transparent px-3 py-2 text-sm rounded-lg focus:outline-none focus:border-foreground resize-none"
                placeholder="We'd love to hear from you…"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Email</label>
              <input
                value={draft.contact.email}
                onChange={(e) => updateDraft("contact", { ...draft.contact, email: e.target.value })}
                className="w-full border border-border bg-transparent px-3 py-2 text-sm rounded-lg focus:outline-none focus:border-foreground"
                placeholder="hello@danywens.com"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Phone</label>
              <input
                value={draft.contact.phone}
                onChange={(e) => updateDraft("contact", { ...draft.contact, phone: e.target.value })}
                className="w-full border border-border bg-transparent px-3 py-2 text-sm rounded-lg focus:outline-none focus:border-foreground"
                placeholder="+91 98765 43210"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Address</label>
              <textarea
                value={draft.contact.address}
                onChange={(e) => updateDraft("contact", { ...draft.contact, address: e.target.value })}
                rows={3}
                className="w-full border border-border bg-transparent px-3 py-2 text-sm rounded-lg focus:outline-none focus:border-foreground resize-none"
                placeholder="123 Street, City, State, PIN"
              />
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

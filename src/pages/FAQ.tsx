import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { useAdmin, DEFAULT_PAGE_CONTENT } from "@/contexts/AdminContext";
import { useSEO } from "@/hooks/use-seo";

const FAQ = () => {
  const { siteSettings } = useAdmin();
  const faqs = siteSettings.pageContent?.faq ?? DEFAULT_PAGE_CONTENT.faq;
  const [open, setOpen] = useState<number | null>(null);

  useSEO({
    title: "FAQ",
    description: "Frequently asked questions about DANYWENS orders, shipping, returns, and sizing.",
    path: "/faq",
  });

  return (
    <Layout>
      <div className="pt-24 md:pt-28 px-4 md:px-8 pb-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-heading tracking-tight mb-2">FAQ</h1>
          <p className="text-sm text-muted-foreground mb-12">Frequently asked questions</p>

          <div className="border-t border-border">
            {faqs.map((faq, i) => (
              <div key={i} className="border-b border-border">
                <button
                  onClick={() => setOpen(open === i ? null : i)}
                  className="flex items-center justify-between w-full py-5 text-left"
                >
                  <span className="text-sm font-semibold pr-4">{faq.q}</span>
                  {open === i ? <ChevronUp className="h-4 w-4 shrink-0" /> : <ChevronDown className="h-4 w-4 shrink-0" />}
                </button>
                {open === i && (
                  <p className="text-sm text-muted-foreground pb-5 leading-relaxed">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FAQ;

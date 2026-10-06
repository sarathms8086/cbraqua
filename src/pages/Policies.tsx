import Layout from "@/components/layout/Layout";
import { useAdmin, DEFAULT_PAGE_CONTENT } from "@/contexts/AdminContext";
import { useSEO } from "@/hooks/use-seo";

function PolicySections({ sections }: { sections: { heading: string; body: string }[] }) {
  return (
    <>
      {sections.map((s, i) => (
        <div key={i}>
          {s.heading && <h2>{s.heading}</h2>}
          <p>{s.body}</p>
        </div>
      ))}
    </>
  );
}

const PolicyLayout = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <Layout>
    <div className="pt-24 md:pt-28 px-4 md:px-8 pb-16">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-heading tracking-tight mb-8">{title}</h1>
        <div className="prose prose-sm max-w-none text-muted-foreground space-y-6 [&_h2]:text-foreground [&_h2]:text-sm [&_h2]:font-semibold [&_h2]:tracking-[0.1em] [&_h2]:uppercase [&_h2]:mt-8 [&_h2]:mb-3 [&_p]:leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  </Layout>
);

export const Shipping = () => {
  const { siteSettings } = useAdmin();
  useSEO({ title: "Shipping & Delivery", description: "DANYWENS shipping rates, delivery timelines, and order tracking information.", path: "/shipping" });
  return <PolicyLayout title="Shipping & Delivery"><PolicySections sections={siteSettings.pageContent?.shipping ?? DEFAULT_PAGE_CONTENT.shipping} /></PolicyLayout>;
};

export const Returns = () => {
  const { siteSettings } = useAdmin();
  useSEO({ title: "Returns & Exchanges", description: "DANYWENS returns and exchange policy — how to send items back and get a refund or exchange.", path: "/returns" });
  return <PolicyLayout title="Returns & Exchanges"><PolicySections sections={siteSettings.pageContent?.returns ?? DEFAULT_PAGE_CONTENT.returns} /></PolicyLayout>;
};

export const Privacy = () => {
  const { siteSettings } = useAdmin();
  useSEO({ title: "Privacy Policy", description: "How DANYWENS collects, uses, and protects your personal information.", path: "/privacy", noindex: true });
  return <PolicyLayout title="Privacy Policy"><PolicySections sections={siteSettings.pageContent?.privacy ?? DEFAULT_PAGE_CONTENT.privacy} /></PolicyLayout>;
};

export const Terms = () => {
  const { siteSettings } = useAdmin();
  useSEO({ title: "Terms of Service", description: "DANYWENS terms of service governing use of this website and purchases.", path: "/terms", noindex: true });
  return <PolicyLayout title="Terms of Service"><PolicySections sections={siteSettings.pageContent?.terms ?? DEFAULT_PAGE_CONTENT.terms} /></PolicyLayout>;
};

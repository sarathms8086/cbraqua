import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { useAdmin } from "@/contexts/AdminContext";
import { useSEO } from "@/hooks/use-seo";

const Collections = () => {
  const { adminCollections } = useAdmin();

  useSEO({
    title: "Collections",
    description: "Curated DANYWENS collections for every season — shop edits by drop, not just by category.",
    path: "/collections",
  });

  return (
    <Layout>
      <div className="pt-[102px] md:pt-32 px-4 md:px-8 pb-16">
        <h1 className="text-3xl md:text-5xl font-heading tracking-tight mb-2">Collections</h1>
        <p className="text-sm text-muted-foreground mb-12">Curated edits for every season.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-[3px]">
          {adminCollections.filter(c => c.visible).map((col, i) => (
            <motion.div
              key={col.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link to={`/shop?collection=${col.slug}`} className="group relative block overflow-hidden aspect-[4/5]">
                <img
                  src={col.image}
                  alt={col.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-foreground/20 group-hover:bg-foreground/40 transition-colors duration-300" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                  <h2 className="text-2xl md:text-4xl font-heading tracking-tight text-background drop-shadow-lg">
                    {col.name}
                  </h2>
                  <p className="text-xs text-background/80 mt-2 max-w-sm drop-shadow">{col.description}</p>
                  <span className="mt-6 text-[10px] font-semibold tracking-[0.2em] uppercase text-background border border-background/60 px-6 py-2.5 group-hover:bg-background group-hover:text-foreground transition-colors">
                    Shop Collection
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Collections;

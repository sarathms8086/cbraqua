import Layout from "@/components/layout/Layout";
import HeroVideo from "@/components/home/HeroVideo";
import HeroCarousel from "@/components/home/HeroCarousel";
import ProductCarousel from "@/components/home/ProductCarousel";
import EditorialBanner from "@/components/home/EditorialBanner";
import CollectionsShowcase from "@/components/home/CollectionsShowcase";
import { useAdmin } from "@/contexts/AdminContext";
import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/use-seo";
import mosaic7 from "@/assets/dany-wens/mosaic-7.jpg";
import mosaic8 from "@/assets/dany-wens/mosaic-8.jpg";

const Index = () => {
  const { adminProducts, isLoading } = useAdmin();

  useSEO({
    title: "DANYWENS — Contemporary Streetwear",
    description: "DANYWENS — Contemporary streetwear for the modern archive. Premium quality, bold design. Shop new arrivals, hoodies, tees, and outerwear.",
    path: "/",
  });

  if (isLoading) return <div className="h-screen flex items-center justify-center bg-background text-foreground text-xs tracking-widest">LOADING...</div>;

  const newArrivals = adminProducts.filter((p) => p.isNew);
  const allProducts = adminProducts.slice(0, 8);
  const moreProducts = adminProducts.slice(4);
  return (
    <Layout>
      <HeroVideo />
      
      {/* Original Carousel moved below video for more content */}
      <div className="mt-20">
        <HeroCarousel />
      </div>

      <ProductCarousel products={newArrivals} />

      <ProductCarousel products={allProducts} title="DISCOVER THE NEW ARRIVALS" />

      {/* Shop Now CTA */}
      <div className="text-center py-8 md:py-12">
        <Link
          to="/shop"
          className="inline-block border border-foreground text-foreground px-12 py-4 text-[10px] md:text-xs font-semibold tracking-[0.25em] uppercase hover:bg-foreground hover:text-background transition-colors duration-300"
        >
          SHOP NOW
        </Link>
      </div>

      <EditorialBanner image={mosaic7} />

      <ProductCarousel products={moreProducts} />

      <CollectionsShowcase />

      <EditorialBanner image={mosaic8} link="/lookbook" title="LOOKBOOK" />
    </Layout>
  );
};

export default Index;

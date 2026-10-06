import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { useSEO } from "@/hooks/use-seo";
import mosaic1 from "@/assets/dany-wens/mosaic-1.jpg";
import mosaic2 from "@/assets/dany-wens/mosaic-2.jpg";
import mosaic3 from "@/assets/dany-wens/mosaic-3.jpg";
import mosaic4 from "@/assets/dany-wens/mosaic-4.jpg";
import mosaic5 from "@/assets/dany-wens/mosaic-5.jpg";
import mosaic6 from "@/assets/dany-wens/mosaic-6.jpg";
import mosaic7 from "@/assets/dany-wens/mosaic-7.jpg";
import mosaic8 from "@/assets/dany-wens/mosaic-8.jpg";
import dw1 from "@/assets/dany-wens/crew-neck-1.jpg";
import dw2 from "@/assets/dany-wens/henley-half-1.jpg";
import dw3 from "@/assets/dany-wens/henley-full-1.jpg";
import dw4 from "@/assets/dany-wens/free-size-1.jpg";

const images = [
  { src: mosaic1, alt: "Editorial 1", span: "md:col-span-2 md:row-span-2" },
  { src: mosaic2, alt: "Editorial 2", span: "md:col-span-1 md:row-span-1" },
  { src: mosaic5, alt: "Editorial 3", span: "md:col-span-1 md:row-span-1" },
  { src: mosaic3, alt: "Editorial 4", span: "md:col-span-1 md:row-span-2" },
  { src: mosaic4, alt: "Editorial 5", span: "md:col-span-2 md:row-span-1" },
  { src: mosaic6, alt: "Editorial 6", span: "md:col-span-1 md:row-span-1" },
  { src: mosaic7, alt: "Editorial 7", span: "md:col-span-2 md:row-span-1" },
  { src: mosaic8, alt: "Editorial 8", span: "md:col-span-1 md:row-span-1" },
  { src: dw1, alt: "Dany Wens 1", span: "md:col-span-2 md:row-span-2" },
  { src: dw2, alt: "Dany Wens 2", span: "md:col-span-1 md:row-span-1" },
  { src: dw3, alt: "Dany Wens 3", span: "md:col-span-1 md:row-span-2" },
  { src: dw4, alt: "Dany Wens 4", span: "md:col-span-2 md:row-span-1" },
];

const Lookbook = () => {
  useSEO({
    title: "Lookbook",
    description: "DANYWENS SS26 editorial lookbook — see the collection styled.",
    path: "/lookbook",
  });

  return (
    <Layout>
      <div className="pt-[102px] md:pt-32 px-4 md:px-8 pb-4">
        <h1 className="text-3xl md:text-5xl font-heading tracking-tight mb-2">Lookbook</h1>
        <p className="text-sm text-muted-foreground mb-8">SS26 Editorial</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-[3px] bg-border">
        {images.map((img, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.05 }}
            className={img.span}
          >
            <img src={img.src} alt={img.alt} className="w-full h-full object-cover" loading="lazy" />
          </motion.div>
        ))}
      </div>
    </Layout>
  );
};

export default Lookbook;

import { Link } from "react-router-dom";
import { useAdmin } from "@/contexts/AdminContext";
import heroVideo from "@/assets/dany-wens/hero-video.mp4";

const HeroVideo = () => {
  const { siteSettings } = useAdmin();
  const videoSrc = siteSettings.heroVideoUrl || null;

  return (
    <section className="relative w-full h-[100dvh] overflow-hidden bg-black">
      {/* Background Video */}
      {videoSrc && (
        <video
          key={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />

      {/* Content — CSS fade-in instead of framer-motion */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10 px-4">
        <div className="max-w-4xl animate-hero-fade">
          <p className="text-[10px] md:text-xs tracking-[0.5em] uppercase font-mono text-white/80 mb-6">
            DANY WENS © 2026
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-9xl font-heading tracking-tighter text-white mb-8 md:mb-10 leading-[0.85] uppercase break-words w-full">
            REDEFINING <br />
            <span className="text-white/40 italic">ESSENTIALS</span>
          </h1>
          <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
            <Link
              to="/shop?collection=dany-wens-2026"
              className="inline-block bg-white text-black px-8 md:px-12 py-4 md:py-5 text-[10px] md:text-xs font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase hover:bg-white/90 transition-colors w-full md:w-auto"
            >
              SHOP COLLECTION
            </Link>
            <Link
              to="/lookbook"
              className="inline-block border border-white text-white px-8 md:px-12 py-4 md:py-5 text-[10px] md:text-xs font-bold tracking-[0.2em] md:tracking-[0.3em] uppercase hover:bg-white hover:text-black transition-colors w-full md:w-auto"
            >
              LOOKBOOK
            </Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator — desktop only */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 hidden md:block opacity-0 animate-fade-in-delayed">
        <div className="w-[1px] h-20 bg-gradient-to-b from-white/0 via-white to-white/0 animate-pulse" />
      </div>
    </section>
  );
};

export default HeroVideo;

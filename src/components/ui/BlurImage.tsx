import { useState } from "react";

interface BlurImageProps {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  style?: React.CSSProperties;
}

const getLqipUrl = (src: string): string | null => {
  if (!src.includes("/uploads/")) return null;
  const dot = src.lastIndexOf(".");
  return dot !== -1 ? src.slice(0, dot) + "-lqip" + src.slice(dot) : null;
};

const BlurImage = ({ src, alt, className = "", priority = false, style }: BlurImageProps) => {
  const [loaded, setLoaded] = useState(false);
  const lqip = getLqipUrl(src);

  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      {lqip && !loaded && (
        <img
          src={lqip}
          alt=""
          aria-hidden
          className="absolute inset-0 w-full h-full object-cover scale-110 blur-lg pointer-events-none"
        />
      )}
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        // @ts-ignore — fetchPriority is valid HTML but not yet in all TS defs
        fetchPriority={priority ? "high" : undefined}
        onLoad={() => setLoaded(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  );
};

export default BlurImage;

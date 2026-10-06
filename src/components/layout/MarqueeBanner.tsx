import { useState } from "react";
import { X } from "lucide-react";
import { useAdmin } from "@/contexts/AdminContext";

const MarqueeBanner = () => {
  const [dismissed, setDismissed] = useState(false);
  const { siteSettings } = useAdmin();
  const text = siteSettings.marqueeText;

  if (dismissed) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] bg-primary text-primary-foreground overflow-hidden whitespace-nowrap min-h-[38px] flex items-center pt-[env(safe-area-inset-top)]">
      <div className="animate-marquee inline-flex">
        {Array.from({ length: 8 }).map((_, i) => (
          <span key={i} className="font-mono text-[10px] md:text-xs tracking-[0.2em] uppercase mx-4">
            {text}
          </span>
        ))}
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-primary-foreground/60 hover:text-primary-foreground transition-colors p-1"
        aria-label="Dismiss banner"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
};

export default MarqueeBanner;

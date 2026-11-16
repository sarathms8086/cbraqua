import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";

const FloatingWhatsApp = () => {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    const encoded = encodeURIComponent(msg.trim() || "Hello CBR AQUA, I would like to inquire about live fish / aquascaping services.");
    window.open(`https://wa.me/919481816563?text=${encoded}`, "_blank");
    setOpen(false);
    setMsg("");
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Popup */}
      {open && (
        <div className="mb-3 w-80 sm:w-88 rounded-2xl bg-[#0c1622] border border-[#1b2f42] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
          <div className="bg-gradient-to-r from-[#0d2a3f] to-[#0a1e2d] p-4 border-b border-[#1b2f42] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#00d796]/20 border border-[#00d796]/40 flex items-center justify-center">
                <span className="w-2.5 h-2.5 rounded-full bg-[#00d796] animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white leading-tight">CBR AQUA Aquarists</h4>
                <p className="text-[11px] text-[#00d796]">Online — typically replies in minutes</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-slate-400 hover:text-white transition-colors p-1"
              aria-label="Close chat"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-4 bg-[#081018] text-xs text-slate-300 space-y-3">
            <div className="bg-[#0f1d2c] p-3 rounded-xl border border-[#1a2d40] text-slate-200">
              👋 Hi there! Need help choosing fish species, checking tank compatibility, or planning an aquascape? Chat directly with our certified aquarists.
            </div>
          </div>

          <form onSubmit={handleSend} className="p-3 bg-[#0c1622] border-t border-[#1b2f42] flex gap-2">
            <input
              type="text"
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Ask an aquarist..."
              className="flex-1 bg-[#070d14] border border-[#1c3044] rounded-xl px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-[#00c8f8]"
            />
            <button
              type="submit"
              className="bg-[#00d796] hover:bg-[#00c587] text-slate-950 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-[#00d796] hover:bg-[#05ecaa] text-slate-950 flex items-center justify-center shadow-lg shadow-[#00d796]/30 hover:scale-105 active:scale-95 transition-all"
        aria-label="Chat with CBR AQUA Expert"
      >
        <MessageCircle className="w-7 h-7 fill-slate-950 stroke-none" />
      </button>
    </div>
  );
};

export default FloatingWhatsApp;

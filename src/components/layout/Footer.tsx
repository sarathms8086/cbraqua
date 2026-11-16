import { Link } from "react-router-dom";
import { Sparkles, Phone, Mail, MapPin, ShieldCheck, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-[#050a0f] border-t border-[#172838] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1 & 2: Brand Information */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#0099ff] via-[#00c8f8] to-[#00e5ff] p-[2px] shadow-lg shadow-cyan-500/20">
                <div className="w-full h-full rounded-full bg-[#070e15] flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                </div>
              </div>
              <div>
                <span className="text-base font-extrabold tracking-wider block text-white">CBR AQUA</span>
                <span className="text-[10px] font-bold tracking-[0.25em] text-cyan-400 block -mt-1">CULTURE</span>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm mb-6">
              Curating rare ornamental fish, imported Japanese koi, bespoke planted nature aquascapes, terrariums, and professional aquatic equipment for passionate aquarists across India.
            </p>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <Phone className="w-3.5 h-3.5 text-cyan-400" />
                <span>WhatsApp / Support: +91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-3.5 h-3.5 text-cyan-400" />
                <span>hello@cbraqua.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                <span>Aquaculture Facility &amp; Studio, Hyderabad &amp; Bangalore, India</span>
              </div>
            </div>
          </div>

          {/* Col 3: Categories */}
          <div>
            <h4 className="text-xs font-bold text-white tracking-widest uppercase mb-4 text-cyan-400">
              Shop Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/shop?category=ornamental-fish" className="hover:text-cyan-300 transition-colors">
                  Ornamental Fish
                </Link>
              </li>
              <li>
                <Link to="/shop?category=betta-fish" className="hover:text-cyan-300 transition-colors">
                  Show Betta Fish
                </Link>
              </li>
              <li>
                <Link to="/shop?category=koi-fish" className="hover:text-cyan-300 transition-colors">
                  Japanese Koi
                </Link>
              </li>
              <li>
                <Link to="/shop?category=aquarium-plants" className="hover:text-cyan-300 transition-colors">
                  Aquascaping Plants
                </Link>
              </li>
              <li>
                <Link to="/shop?category=filters" className="hover:text-cyan-300 transition-colors">
                  Canister Filters
                </Link>
              </li>
              <li>
                <Link to="/shop?category=turtles" className="hover:text-cyan-300 transition-colors">
                  Turtles &amp; Terrariums
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Customer Services */}
          <div>
            <h4 className="text-xs font-bold text-white tracking-widest uppercase mb-4 text-cyan-400">
              Assistance &amp; Policy
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link to="/shipping" className="hover:text-cyan-300 transition-colors">
                  Live Arrival Guarantee
                </Link>
              </li>
              <li>
                <Link to="/track-order" className="hover:text-cyan-300 transition-colors">
                  Track Consignment
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-cyan-300 transition-colors">
                  Acclimation FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-cyan-300 transition-colors">
                  Consult an Aquarist
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-cyan-300 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-cyan-300 transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Guarantee & Newsletter */}
          <div>
            <h4 className="text-xs font-bold text-white tracking-widest uppercase mb-4 text-cyan-400">
              Live Delivery Promise
            </h4>
            <div className="p-3.5 rounded-xl bg-[#0c1622] border border-[#172838] mb-4">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>100% DOA Coverage</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                In the rare event of a transit casualty, share an unboxing video within 2 hours of delivery for an instant replacement or refund.
              </p>
            </div>

            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <span className="text-[11px] font-semibold text-slate-300 block">
                Weekly Stock Updates &amp; Rare Drops
              </span>
              <div className="flex gap-1.5">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="bg-[#0c1622] border border-[#172838] text-xs text-white placeholder-slate-500 rounded-xl px-3 py-2 flex-1 focus:outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  className="bg-[#00c8f8] hover:bg-cyan-300 text-slate-950 px-3.5 py-2 rounded-xl text-xs font-bold transition-all shrink-0"
                >
                  Join
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 pt-6 border-t border-[#172838] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} CBR AQUA CULTURE. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            Designed for Nature Aquarists with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

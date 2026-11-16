import { ReactNode } from "react";
import Header from "./Header";
import Footer from "./Footer";
import FloatingWhatsApp from "./FloatingWhatsApp";

interface LayoutProps {
  children: ReactNode;
  noPaddingTop?: boolean;
}

const Layout = ({ children, noPaddingTop = false }: LayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#070e15] text-white selection:bg-cyan-500 selection:text-slate-950">
      <Header />
      <main className={`flex-1 ${noPaddingTop ? "" : "pt-18"}`}>{children}</main>
      <Footer />
      <FloatingWhatsApp />
    </div>
  );
};

export default Layout;

'use client'
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { useEffect, useState } from "react";

export default function InfoLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const [position, setPosition] = useState({ x: 1024, y: 907 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({
        x: e.clientX,
        y: e.clientY + window.scrollY, // Agregar el desplazamiento al eje Y
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);
  return (
    <div id="__next">
      <div className="__variable_20b187 group/spotlight relative">
      <div className="pointer-events-none fixed inset-0 z-30 transition duration-300 lg:absolute"
     style={{
      background: `radial-gradient(600px at ${position.x}px ${position.y}px, rgba(29, 78, 216, 0.15), transparent 80%)`
    }}>
</div>
        <div id="mouse" className="point pointer-events-none"></div>
        <div id="mouse" className="point2 pointer-events-none"></div>
        <div className="mx-auto min-h-screen max-w-screen-xl px-6 py-12 font-sans md:px-12 md:py-20 lg:px-24 lg:py-0">
          {/* <a
              href="#content"
              className="absolute left-0 top-0 block -translate-x-full rounded bg-gradient-to-br from-teal-400 via-blue-500 to-purple-600 px-4 py-3 text-sm font-bold uppercase tracking-widest text-white focus-visible:translate-x-0"
            >
              Skip to Content
            </a> */}
          <div className="lg:flex lg:justify-between lg:gap-4">
            <Header />
            <main id="content" className="pt-24 lg:w-1/2 lg:py-24">
              {children}
              <Footer />
            </main>

            
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { Link as ScrollLink, scroller } from "react-scroll";
import { Menu, X } from "lucide-react";

const Header = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const sections = document.querySelectorAll("section");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.4 }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const handleClick = (section: string) => {
    setIsMenuOpen(false);
    if (pathname === "/") {
      scroller.scrollTo(section, {
        smooth: true,
        duration: 500,
        offset: -100,
      });
    } else {
      router.push(`/?scrollTo=${section}`);
    }
  };

  return (
    <header className="bg-[#141414] px-6 py-3 flex justify-between items-center">
      <Link href="/" className="text-white font-bold text-lg">Logo</Link>

      {/* Botón hamburguesa en mobile */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden text-white focus:outline-none"
      >
        {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Menú Desktop */}
      <nav className="hidden md:block">
        <ul className="flex space-x-5">
          {["home", "about", "experience", "projects"].map((section) => (
            <li key={section}>
              <button
                onClick={() => handleClick(section)}
                className={`group text-[15px] font-bold capitalize tracking-widest transition-all duration-300 ${
                  activeSection === section ? "text-slate-200" : "text-slate-500"
                } hover:text-slate-200`}
              >
                {section}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Menú Mobile */}
      {isMenuOpen && (
        <nav className="absolute top-16 left-0 w-full bg-[#141414] md:hidden z-50">
          <ul className="flex flex-col items-center py-4 space-y-4">
            {["home", "about", "experience", "projects"].map((section) => (
              <li key={section}>
                <button
                  onClick={() => handleClick(section)}
                  className={`text-[15px] font-bold capitalize tracking-widest transition-all duration-300 ${
                    activeSection === section ? "text-slate-200" : "text-slate-500"
                  } hover:text-slate-200`}
                >
                  {section}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;

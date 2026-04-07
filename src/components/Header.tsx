"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { scroller } from "react-scroll";
import { Menu, X, FileText } from "lucide-react";
import Logo from "./ui/Logo";

const sections = ["home", "about", "experience", "work"] as const;

const Header = () => {
  const [activeSection, setActiveSection] = useState<string | null>("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const els = document.querySelectorAll("section[id]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { threshold: 0.4 }
    );
    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const handleClick = (section: string) => {
    setIsMenuOpen(false);
    if (pathname === "/") {
      scroller.scrollTo(section, { smooth: true, duration: 500, offset: -100 });
    } else {
      router.push(`/?scrollTo=${section}`);
    }
  };

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-zinc-950/80 backdrop-blur-lg border-b border-zinc-900"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
        <Logo size={32} />

        <button
          onClick={() => setIsMenuOpen((v) => !v)}
          className="md:hidden text-zinc-300 hover:text-white"
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <nav className="hidden md:flex items-center gap-1">
          {sections.map((section, i) => (
            <button
              key={section}
              onClick={() => handleClick(section)}
              className={`px-3 py-2 text-sm transition-colors ${
                activeSection === section
                  ? "text-white"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <span className="font-mono text-brand-400 mr-1.5">
                0{i + 1}.
              </span>
              {section}
            </button>
          ))}
          <Link
            href="/Resume.pdf"
            target="_blank"
            className="ml-3 inline-flex items-center gap-2 px-4 py-2 text-sm rounded-lg border border-brand-500/40 text-brand-300 hover:bg-brand-500/10 hover:border-brand-400 transition-all"
          >
            <FileText size={14} />
            Resume
          </Link>
        </nav>
      </div>

      {isMenuOpen && (
        <nav className="md:hidden bg-zinc-950/95 backdrop-blur-lg border-t border-zinc-900">
          <ul className="flex flex-col py-4 px-6 space-y-1">
            {sections.map((section, i) => (
              <li key={section}>
                <button
                  onClick={() => handleClick(section)}
                  className={`w-full text-left px-3 py-3 rounded-lg text-sm transition ${
                    activeSection === section
                      ? "text-white bg-brand-500/10"
                      : "text-zinc-400 hover:text-white hover:bg-zinc-900"
                  }`}
                >
                  <span className="font-mono text-brand-400 mr-2">
                    0{i + 1}.
                  </span>
                  {section}
                </button>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href="/Resume.pdf"
                target="_blank"
                className="block text-center px-4 py-2.5 rounded-lg border border-brand-500/40 text-brand-300"
              >
                Resume
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
};

export default Header;

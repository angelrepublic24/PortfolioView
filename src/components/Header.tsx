'use client';

import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import { Link as ScrollLink, scroller } from "react-scroll";

const Header = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);
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
    <header className="bg-[#141414] flex justify-between px-10 py-2">
      <div className="flex items-center">
        <Link href={'/'}>Logo</Link>
      </div>
      <nav>
        <ul className="flex space-x-5">
          {["home", "about", "experience", "projects"].map((section) => (
            <li key={section}>
              <button
                onClick={() => handleClick(section)}
                className={`group flex items-center py-3 transition-all duration-300 cursor-pointer ${
                  activeSection === section ? "text-slate-200" : ""
                }`}
              >
                <span
                  className={`nav-text text-[15px] font-bold capitalize tracking-widest text-slate-500 group-hover:text-slate-200 ${
                    activeSection === section ? "text-slate-200" : ""
                  }`}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
};

export default Header;

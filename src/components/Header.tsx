'use client'
import Link from "next/link";
import { useEffect, useState } from "react";
import { Link as ScrollLink } from "react-scroll";


const Header = () => {
  const [activeSection, setActiveSection] = useState<string | null>(null);

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
      { threshold: 0.4 } // Detecta cuando el 60% de la sección está visible
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);
    return (
      <header className="lg:sticky lg:top-0 lg:flex lg:max-h-screen lg:w-1/2 lg:flex-col lg:justify-between lg:py-24">
      <div>
        <h1 className="text-4xl font-bold tracking-tight text-slate-200 sm:text-5xl">
          <Link href="/">Angel Almonte</Link>
        </h1>
        <h2 className="mt-3 text-lg font-medium tracking-tight text-slate-200 sm:text-xl">
        Full-Stack Web Developer
        </h2>
        <p className="mt-4 max-w-xs leading-normal">
        I develop efficient, scalable server-side applications and craft accessible, user-friendly interfaces, ensuring seamless performance, reliability, and a great user experience.
        </p>
        <nav className="nav hidden lg:block" aria-label="In-page jump links">
          <ul className="mt-16 w-max">
            {["about", "experience", "projects"].map((section) => (
              <li key={section}>
                <ScrollLink
                  className={`group flex items-center py-3 transition-all duration-300 cursor-pointer ${
                    activeSection === section ? "text-slate-200" : ""
                  }`}
                  to={section}
                  smooth={true}
                  spy={true}
                  duration={500} // Duración de la animación en ms
                  offset={-100} // Ajusta si hay un header fijo
                  onSetActive={() => setActiveSection(section)} // Asegura que se marque activo al hacer click
                >
                  <span
                    className={`nav-indicator mr-4 h-px w-8 transition-all group-hover:w-16 motion-reduce:transition-none ${
                      activeSection === section ? "bg-slate-200 w-16" : "bg-slate-600"
                    }`}
                  ></span>
                  <span
                    className={`nav-text text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-slate-200 ${
                      activeSection === section ? "text-slate-200" : ""
                    }`}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </span>
                </ScrollLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
      );
}

export default Header
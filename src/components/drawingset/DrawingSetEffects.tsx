"use client";

import { useEffect } from "react";

/**
 * Behaviour layer for the drawing set. All content is server-rendered (good for
 * SEO); this only attaches interactivity: the Paper/Model theme toggle, the live
 * sheet counter, nav active-state (click + scroll-spy), and the "plotter draw-in"
 * reveal — all gated by reduced-motion.
 */

function navHrefForSheet(no: string | null): string | null {
  if (!no) return null;
  if (no === "00") return "#cover";
  if (no === "G-001") return "#notes";
  if (no.startsWith("A-")) return "#work";
  if (no === "REV") return "#rev";
  if (no === "REF") return "#ref";
  if (no === "ISSUE") return "#issue";
  return null;
}

export default function DrawingSetEffects() {
  useEffect(() => {
    const root = document.documentElement;
    const bP = document.getElementById("tPaper");
    const bM = document.getElementById("tModel");

    // --- theme toggle ---
    const applyPressed = (t: string) => {
      if (bP) bP.setAttribute("aria-pressed", t === "light" ? "true" : "false");
      if (bM) bM.setAttribute("aria-pressed", t === "dark" ? "true" : "false");
    };
    const setTheme = (t: string) => {
      root.setAttribute("data-theme", t);
      try { localStorage.setItem("ds-theme", t); } catch {}
      applyPressed(t);
    };
    const current =
      root.getAttribute("data-theme") ||
      (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    applyPressed(current);
    const onPaper = () => setTheme("light");
    const onModel = () => setTheme("dark");
    bP?.addEventListener("click", onPaper);
    bM?.addEventListener("click", onModel);

    // --- nav active state (click + scroll-spy) ---
    const navLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>(".sheetnav nav a"));
    const setActiveNav = (href: string | null) => {
      if (!href) return;
      navLinks.forEach((a) => a.classList.toggle("on", a.getAttribute("href") === href));
    };
    const navClickHandlers = navLinks.map((a) => {
      const handler = () => setActiveNav(a.getAttribute("href"));
      a.addEventListener("click", handler);
      return { a, handler };
    });

    // --- sheet counter + scroll-spy ---
    const sheets = Array.from(document.querySelectorAll<HTMLElement>(".sheet[data-sheetno]"));
    const total = sheets.length;
    const tbCount = document.getElementById("tbCount");
    const tbSheet = document.getElementById("tbSheet");
    if (tbCount) tbCount.textContent = "01 / " + String(total).padStart(2, "0");

    const counter = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          const i = sheets.indexOf(el) + 1;
          const no = el.getAttribute("data-sheetno");
          const label = el.getAttribute("data-sheetlabel") ?? "";
          if (tbSheet) tbSheet.textContent = (no ?? "") + " · " + label;
          if (tbCount) tbCount.textContent = String(i).padStart(2, "0") + " / " + String(total).padStart(2, "0");
          setActiveNav(navHrefForSheet(no));
        });
      },
      { rootMargin: "-45% 0px -45% 0px" }
    );
    sheets.forEach((s) => counter.observe(s));

    // --- plotter draw-in reveal ---
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let drawObs: IntersectionObserver | undefined;
    if (!reduce) {
      drawObs = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (!e.isIntersecting) return;
            e.target.querySelectorAll(".draw").forEach((d) => d.classList.add("in"));
            e.target.classList.add("in");
            drawObs?.unobserve(e.target);
          });
        },
        { threshold: 0.2 }
      );
      document.querySelectorAll(".reveal, .draw").forEach((el) => drawObs!.observe(el));
      document.querySelectorAll<SVGGeometryElement>(".draw path, .draw line, .draw polyline, .draw rect").forEach((p) => {
        try {
          const L = typeof p.getTotalLength === "function" ? p.getTotalLength() : 1200;
          p.style.setProperty("--len", String(Math.max(L, 40)));
        } catch {}
      });
    }

    return () => {
      counter.disconnect();
      drawObs?.disconnect();
      bP?.removeEventListener("click", onPaper);
      bM?.removeEventListener("click", onModel);
      navClickHandlers.forEach(({ a, handler }) => a.removeEventListener("click", handler));
    };
  }, []);

  return null;
}

import type { SiteContentType } from "./siteContent";

const SHEETS = [
  { hash: "#cover", label: "00 · Cover" },
  { hash: "#notes", label: "G-001 · Notes" },
  { hash: "#work", label: "A · Work" },
  { hash: "#rev", label: "Rev" },
  { hash: "#ref", label: "Ref" },
  { hash: "#issue", label: "Issue" },
];

/**
 * `base` prefixes the section links ("/" on a project page, so they lead back to the
 * home); `active` is the section lit before the scroll-spy takes over.
 */
export default function SheetNav({
  content,
  base = "",
  active = "#cover",
}: {
  content: SiteContentType;
  base?: string;
  active?: string;
}) {
  // "A·ALMONTE — THE DRAWING SET": the tail drops on phones to leave room for the buttons.
  const [lead, tail] = content.brand.split(" — ");
  return (
    <header className="sheetnav">
      <a className="brand" href={`${base}#cover`}>
        <span>{lead}</span>
        {tail ? <span className="tail">— {tail}</span> : null}
      </a>
      <nav aria-label="Drawing sheets">
        {SHEETS.map((s) => (
          <a key={s.hash} href={`${base}${s.hash}`} className={s.hash === active ? "on" : undefined}>
            {s.label}
          </a>
        ))}
      </nav>
      <a className="navcta" href="/Resume.pdf" target="_blank" rel="noopener noreferrer">Resume ↗</a>
      <span className="layerswitch" role="group" aria-label="Sheet theme">
        <button id="tPaper" type="button" aria-pressed="true">Paper</button>
        <button id="tModel" type="button" aria-pressed="false">Model</button>
      </span>
    </header>
  );
}

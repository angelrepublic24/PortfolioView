import type { SiteContentType } from "./siteContent";

export default function SheetNav({ content }: { content: SiteContentType }) {
  return (
    <header className="sheetnav">
      <span className="brand">{content.brand}</span>
      <nav aria-label="Drawing sheets">
        <a href="#cover" className="on">00 · Cover</a>
        <a href="#notes">G-001 · Notes</a>
        <a href="#work">A · Work</a>
        <a href="#rev">Rev</a>
        <a href="#ref">Ref</a>
        <a href="#issue">Issue</a>
      </nav>
      <span className="layerswitch" role="group" aria-label="Sheet theme">
        <button id="tPaper" type="button" aria-pressed="true">Paper</button>
        <button id="tModel" type="button" aria-pressed="false">Model</button>
      </span>
    </header>
  );
}

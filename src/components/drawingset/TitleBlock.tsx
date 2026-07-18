import type { SiteContentType } from "./siteContent";

export default function TitleBlock({ content }: { content: SiteContentType }) {
  return (
    <aside className="tblock" aria-label="Drawing title block">
      <div className="grid">
        <div className="c span">
          <span className="k">Drawn by</span>
          <span className="v">{content.name} — {content.role}</span>
        </div>
        <div className="c hideM">
          <span className="k">Location</span>
          <span className="v">{content.location}</span>
        </div>
        <div className="c">
          <span className="k">Rev</span>
          <span className="v">{content.rev}</span>
        </div>
        <div className="c">
          <span className="k">Sheet</span>
          <span className="v amber" id="tbSheet">00 · COVER</span>
        </div>
        <div className="c">
          <span className="k">Of</span>
          <span className="v" id="tbCount">01 / 09</span>
        </div>
      </div>
    </aside>
  );
}

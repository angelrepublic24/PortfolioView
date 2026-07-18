import type { SiteContentType } from "./siteContent";
import SectionCut from "./SectionCut";

export default function Cover({ content }: { content: SiteContentType }) {
  const h = content.hero;
  return (
    <section id="cover" className="sheet cover" data-sheetno="00" data-sheetlabel="COVER">
      <div className="cover-grid">
        <div>
          <p className="eyebrow">{h.eyebrow}</p>
          <div className="hero-title-wrap">
            <span className="dimbar" aria-hidden="true">
              <svg viewBox="0 0 10 120" preserveAspectRatio="none" className="diag">
                <line className="ink" x1="5" y1="2" x2="5" y2="118" strokeWidth="1" />
                <line className="ink" x1="1" y1="2" x2="9" y2="2" strokeWidth="1" />
                <line className="ink" x1="1" y1="118" x2="9" y2="118" strokeWidth="1" />
              </svg>
            </span>
            <h1 className="hero">
              {h.headLead}
              <span className="amber">{h.headAmber}</span>
            </h1>
          </div>
          <p className="spec-strip">
            {h.spec.map((s, i) => (
              <span key={s}>
                {i > 0 && " / "}
                {i === 0 ? <b>{s}</b> : s}
              </span>
            ))}
          </p>
          <p className="lede">{h.lede}</p>
          <div className="disc" aria-label="Disciplines: web, app, api, database, payments, ops — all built in-house">
            {content.coverDisciplines.map((d) => (
              <span key={d} className="cell on">{d}</span>
            ))}
          </div>
          <p className="disc-cap">Full discipline stamp — inked = built by me</p>
          <div className="cover-actions">
            <a className="btn primary" href="#work">Open the set ↓</a>
            <a className="btn" href="#issue">Issue a request</a>
          </div>
        </div>
        <SectionCut floors={content.sectionFloors} />
      </div>
    </section>
  );
}

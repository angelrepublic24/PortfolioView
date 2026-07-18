import type { SiteContentType } from "./siteContent";

export default function GeneralNotes({ content }: { content: SiteContentType }) {
  return (
    <section id="notes" className="sheet" data-sheetno="G-001" data-sheetlabel="GENERAL NOTES">
      <div className="sheet-tag">
        <span className="no">G-001</span> General Notes &amp; Legend <span className="rule" />
      </div>
      <div className="two">
        <div>
          <div className="panel-h">General Notes</div>
          <ol className="notes">
            {content.notes.map((n, i) => (
              <li key={i} dangerouslySetInnerHTML={{ __html: n }} />
            ))}
          </ol>
        </div>
        <div>
          <div className="panel-h">Legend — how to read these drawings</div>
          <div className="legend">
            <div className="row">
              <svg className="lwt diag" viewBox="0 0 34 10"><line className="ink" x1="0" y1="5" x2="34" y2="5" strokeWidth="2.4" /></svg>
              <span><b>Heavy line</b> — backend spine (API + domain)</span>
            </div>
            <div className="row">
              <svg className="lwt diag" viewBox="0 0 34 10"><line className="mut" x1="0" y1="5" x2="34" y2="5" strokeWidth="1.4" /></svg>
              <span><b>Medium line</b> — service / API edge</span>
            </div>
            <div className="row">
              <svg className="lwt diag" viewBox="0 0 34 10"><line className="ln" x1="0" y1="5" x2="34" y2="5" strokeWidth="1" /></svg>
              <span><b>Light line</b> — client leaf (UI)</span>
            </div>
            <div className="row">
              <svg className="lwt diag" viewBox="0 0 34 10"><line className="blue" x1="0" y1="5" x2="34" y2="5" strokeWidth="1.4" strokeDasharray="5 4" /></svg>
              <span><b>Dashed blue</b> — async / socket / external</span>
            </div>
            <div className="row"><span className="swatch amber" /><span><b>Amber</b> — code I own · or a live / active system</span></div>
            <div className="row"><span className="swatch blue" /><span><b>Blue</b> — external service I only integrate</span></div>
            <div className="row">
              <span className="key-mono">[WEB][APP][API][DB][PAY][OPS][3D]</span>
              <span>Discipline stamp — inked = I built that layer</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

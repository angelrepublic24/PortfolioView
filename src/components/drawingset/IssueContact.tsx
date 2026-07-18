import type { SiteContentType } from "./siteContent";

export default function IssueContact({ content }: { content: SiteContentType }) {
  const c = content.contact;
  return (
    <section id="issue" className="sheet" data-sheetno="ISSUE" data-sheetlabel="ISSUE">
      <div className="sheet-tag">
        <span className="no">ISSUE</span> Issued for contact <span className="rule" />
      </div>
      <div className="issue-grid">
        <div>
          <h2 className="proj-name" style={{ marginBottom: 18 }}>Issue a request.</h2>
          <div className="issue-rows">
            <a href={c.github} target="_blank" rel="noopener noreferrer"><span className="k">GitHub</span><span>{c.githubLabel}</span></a>
            <a href={c.linkedin} target="_blank" rel="noopener noreferrer"><span className="k">LinkedIn</span><span>{c.linkedinLabel}</span></a>
            <a href={`mailto:${c.email}`}><span className="k">Email</span><span>{c.email}</span></a>
            <a href={c.studio} target="_blank" rel="noopener noreferrer"><span className="k">Studio</span><span>{c.studioLabel}</span></a>
            <div className="r"><span className="k">Location</span><span>{content.location}</span></div>
          </div>
        </div>
        <div className="seal" aria-hidden="true">
          <svg viewBox="0 0 200 200" className="diag">
            <circle cx="100" cy="100" r="94" fill="none" className="amber" strokeWidth="1.5" />
            <circle cx="100" cy="100" r="80" fill="none" className="amber" strokeWidth="1" />
            <circle cx="100" cy="100" r="52" fill="none" className="amber" strokeWidth="1" />
            <defs>
              <path id="sealpath" d="M100,100 m-68,0 a68,68 0 1,1 136,0 a68,68 0 1,1 -136,0" />
            </defs>
            <text fontSize="10.5" letterSpacing="3" className="t-amber">
              <textPath href="#sealpath" startOffset="0">{content.sealText}</textPath>
            </text>
            <text x="100" y="112" textAnchor="middle" fontSize="42" className="t-amber" letterSpacing="2">AA</text>
          </svg>
        </div>
      </div>
      <p className="end">— Issued by one hand · End of set —</p>
    </section>
  );
}

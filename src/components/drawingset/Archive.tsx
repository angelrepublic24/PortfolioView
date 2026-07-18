import type { IProject } from "@/types";

export default function Archive({ projects }: { projects: IProject[] }) {
  if (!projects.length) return null;
  const rows = [...projects].sort((a, b) => (b.date ?? 0) - (a.date ?? 0));

  return (
    <section id="ref" className="sheet" data-sheetno="REF" data-sheetlabel="REFERENCE">
      <div className="sheet-tag">
        <span className="no">REF</span> Superseded drawings — archive <span className="rule" />
      </div>
      <div className="archive">
        {rows.map((p) => {
          const tech = (p.lang ?? []).slice(0, 4).join(" · ");
          const inner = (
            <>
              <span className="yr">{p.date}</span>
              <span><b>{p.name}</b>{tech ? ` — ${tech}` : ""}</span>
            </>
          );
          return p.url ? (
            <a className="a" key={p._id} href={p.url} target="_blank" rel="noopener noreferrer">{inner}</a>
          ) : (
            <div className="a" key={p._id}>{inner}</div>
          );
        })}
      </div>
    </section>
  );
}

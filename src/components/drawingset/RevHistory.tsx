import type { IExperience } from "@/types";

function stripHtml(html: string, max = 96): string {
  const plain = (html ?? "").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  return plain.length > max ? plain.slice(0, max).replace(/\s+\S*$/, "") + "…" : plain;
}

function isCurrent(end: string | number): boolean {
  return typeof end === "string" && /present|current|now/i.test(end);
}

export default function RevHistory({ experience }: { experience: IExperience[] }) {
  const rows = [...experience].sort((a, b) => (b.date?.[0] ?? 0) - (a.date?.[0] ?? 0));
  const total = rows.length;

  return (
    <section id="rev" className="sheet" data-sheetno="REV" data-sheetlabel="REVISION HISTORY">
      <div className="sheet-tag">
        <span className="no">REV</span> Revision History — experience <span className="rule" />
      </div>
      <div style={{ overflowX: "auto" }}>
        <table className="revtable">
          <tbody>
            <tr><th>Rev</th><th>Years</th><th>Role @ Company</th><th>Scope</th></tr>
            {rows.map((exp, i) => {
              const start = exp.date?.[0];
              const end = exp.date?.[1];
              const cur = isCurrent(end ?? "");
              const cls = cur ? "cur" : "";
              const rev = String(total - i).padStart(2, "0");
              const years = start !== undefined ? `${start}${end !== undefined ? " – " + end : ""}` : "";
              const scope = exp.scope || stripHtml(exp.description);
              return (
                <tr key={exp._id}>
                  <td className={cls}>{cur ? "↳ " : ""}{rev}</td>
                  <td className={cls}>{years}</td>
                  <td className={cls}><b>{exp.position}</b> @ {exp.url ? (
                    <a href={exp.url} target="_blank" rel="noopener noreferrer" style={{ color: "var(--ds-accent)" }}>{exp.company}</a>
                  ) : exp.company}</td>
                  <td>{scope}{cur ? " · current issue" : ""}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </section>
  );
}

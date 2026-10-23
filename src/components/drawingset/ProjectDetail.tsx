import Link from "next/link";
import type { ProjectSheetData } from "@/lib/data";
import { clientLabel, homeAnchorFor, linksFor, projectHref, stackRows } from "@/lib/stack";
import ProjectHead from "./ProjectHead";
import LogoPlate from "./LogoPlate";
import TopologyDiagram from "./TopologyDiagram";
import Plates from "./Plates";

/**
 * The full set for one project: head with logo, narrative + stack schedule, photo
 * plates and topology, then the neighbouring sheets. Sub-sheets are numbered in the
 * order they appear (A-03.1, A-03.2…), so a project without photos has no gap.
 */
export default function ProjectDetail({ project, sheetNo, prev, next }: ProjectSheetData) {
  const client = clientLabel(project);
  const links = linksFor(project);
  const rows = stackRows(project.lang);
  const photos = (project.gallery ?? []).filter((g) => g?.url);
  const back = `/#${homeAnchorFor(project, sheetNo)}`;

  let n = 0;
  const sub = () => `${sheetNo}.${++n}`;
  const specNo = sub();
  const platesNo = photos.length ? sub() : null;
  const topoNo = sub();

  return (
    <>
      <section className="sheet project detail" data-sheetno={sheetNo} data-sheetlabel={project.name.toUpperCase()}>
        <Link className="crumb" href={back}>← Back to the set</Link>
        <div className="sheet-tag">
          <span className="no">{sheetNo}</span> Project Sheet — full set <span className="rule" />
          {client || (project.kind ?? "")}
        </div>

        <div className="detail-head">
          <LogoPlate project={project} figure={sheetNo} priority />
          <ProjectHead project={project} sheetNo={sheetNo} summary={project.summary} as="h1" stacked>
            {links.length ? (
              <div className="sheet-actions">
                {links.map((l) => (
                  <a key={l.url} className="btn" href={l.url} target="_blank" rel="noopener noreferrer">
                    {l.label} ↗
                  </a>
                ))}
              </div>
            ) : null}
          </ProjectHead>
        </div>
      </section>

      <section className="sheet" data-sheetno={specNo} data-sheetlabel="NARRATIVE">
        <div className="sheet-tag">
          <span className="no">{specNo}</span> Narrative &amp; specifications <span className="rule" />
        </div>
        <div className="detail-spec">
          <div className="prose-draft" dangerouslySetInnerHTML={{ __html: project.description }} />
          <table className="schedule">
            <caption>Stack schedule</caption>
            <tbody>
              <tr><th>Tech</th><th>Layer</th></tr>
              {rows.map((r) => (
                <tr key={r.key}>
                  <td><b className={r.external ? "ext" : undefined}>{r.label}{r.external ? " ↗" : ""}</b></td>
                  <td>{r.layer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {platesNo && (
        <section className="sheet" data-sheetno={platesNo} data-sheetlabel="PLATES">
          <div className="sheet-tag">
            <span className="no">{platesNo}</span> Plates — photographs <span className="rule" />
            {photos.length} {photos.length === 1 ? "plate" : "plates"}
          </div>
          <Plates images={photos} prefix={platesNo} name={project.name} />
        </section>
      )}

      <section className="sheet" data-sheetno={topoNo} data-sheetlabel="TOPOLOGY">
        <div className="sheet-tag">
          <span className="no">{topoNo}</span> Topology — owned vs integrated <span className="rule" />
        </div>
        <div className="detail-topo">
          <div className="diagbox">
            <TopologyDiagram langs={project.lang} name={project.name} />
          </div>
          <div className="legend">
            <div className="row"><span className="swatch amber" /><span><b>Amber</b> — code I own</span></div>
            <div className="row"><span className="swatch blue" /><span><b>Dashed blue</b> — external service I integrate</span></div>
            <div className="row">
              <svg className="lwt diag" viewBox="0 0 34 10"><line className="ink" x1="0" y1="5" x2="34" y2="5" strokeWidth="2.4" /></svg>
              <span><b>Heavy line</b> — backend spine</span>
            </div>
          </div>
        </div>
      </section>

      <nav className="sheet-pager" aria-label="Other project sheets">
        {prev ? (
          <Link className="prev" href={projectHref(prev.project)}>
            <span className="k">← {prev.sheetNo}</span>
            <b>{prev.project.name}</b>
          </Link>
        ) : <span />}
        <Link className="mid" href={back}>Back to the set</Link>
        {next ? (
          <Link className="next" href={projectHref(next.project)}>
            <span className="k">{next.sheetNo} →</span>
            <b>{next.project.name}</b>
          </Link>
        ) : <span />}
      </nav>
    </>
  );
}

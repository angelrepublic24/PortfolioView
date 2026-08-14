import type { IProject, Discipline, ProjectStatus } from "@/types";
import { STATUS_META, statusFor, disciplinesFor, clientLabel, stackRows, linksFor } from "@/lib/stack";
import TopologyDiagram from "./TopologyDiagram";

const BASE_DISCIPLINES: Discipline[] = ["WEB", "APP", "API", "DB", "PAY", "OPS"];

const STATUS_SHORT: Record<ProjectStatus, string> = {
  live: "Live",
  "in-dev": "In dev",
  "pre-launch": "Pre-launch",
  frontier: "Frontier",
  archived: "Archived",
};

function stampClass(status: ProjectStatus): string {
  if (status === "live") return "stamp live";
  if (status === "archived") return "stamp";
  return "stamp dev";
}

function slug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function ProjectSheet({
  project,
  sheetNo,
  anchorId,
}: {
  project: IProject;
  sheetNo: string;
  anchorId?: string;
}) {
  const status = statusFor(project);
  const meta = STATUS_META[status];
  const disciplines = disciplinesFor(project);
  const cells = disciplines.includes("3D") ? [...BASE_DISCIPLINES, "3D" as Discipline] : BASE_DISCIPLINES;
  const rows = stackRows(project.lang);
  const client = clientLabel(project);
  const links = linksFor(project);

  return (
    <section
      id={anchorId ?? slug(project.name)}
      className="sheet project"
      data-sheetno={sheetNo}
      data-sheetlabel={project.name.toUpperCase()}
    >
      <div className="sheet-tag">
        <span className="no">{sheetNo}</span> Project Sheet <span className="rule" />
        {client || (project.kind ?? "")}
      </div>

      <div className="proj-head">
        <div>
          <div className={stampClass(status)}>
            <span className="glyph">{meta.glyph}</span> {meta.label}
          </div>
          <h2 className="proj-name">{project.name}</h2>
          {project.summary ? <p className="proj-sub">{project.summary}</p> : null}
          <div className="disc mini" aria-label="Disciplines built">
            {cells.map((d) => (
              <span key={d} className={`cell ${disciplines.includes(d) ? "on" : ""}`}>{d}</span>
            ))}
          </div>
        </div>

        <div className="titleblock">
          <div className="f"><span className="k">Project</span><span className="v">{project.name}</span></div>
          <div className="f"><span className="k">Client</span><span className="v amber">{client || "Independent"}</span></div>
          <div className="f"><span className="k">Role</span><span className="v">{project.role || "Builder"}</span></div>
          <div className="f"><span className="k">Year</span><span className="v">{project.date}</span></div>
          <div className="f"><span className="k">Status</span><span className={`v ${status !== "archived" ? "amber" : ""}`}>{STATUS_SHORT[status]}</span></div>
          <div className="f"><span className="k">Sheet</span><span className="v">{sheetNo}</span></div>
        </div>
      </div>

      <div
        className="prose-draft"
        style={{ marginBottom: 26 }}
        dangerouslySetInnerHTML={{ __html: project.description }}
      />
      <div className="proj-body">
        <div className="diagbox">
          <TopologyDiagram langs={project.lang} name={project.name} />
        </div>
        <div>
          <table className="schedule">
            <caption>Stack schedule</caption>
            <tbody>
              <tr><th>Tech</th><th>Layer</th></tr>
              {rows.map((r) => (
                <tr key={r.key}>
                  <td className={r.external ? "" : undefined}>
                    <b className={r.external ? "ext" : undefined}>{r.label}{r.external ? " ↗" : ""}</b>
                  </td>
                  <td>{r.layer}</td>
                </tr>
              ))}
              {links.length ? (
                <tr>
                  <td colSpan={2}>
                    <span className="sheet-links">
                      {links.map((l) => (
                        <a
                          key={l.url}
                          href={l.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ext"
                        >
                          {l.label} ↗
                        </a>
                      ))}
                    </span>
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

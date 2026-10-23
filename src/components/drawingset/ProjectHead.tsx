import Link from "next/link";
import type { IProject, Discipline, ProjectStatus } from "@/types";
import { STATUS_META, statusFor, disciplinesFor, clientLabel } from "@/lib/stack";

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

/**
 * Status stamp, name, subtitle, discipline stamp and title block — the top of a
 * project sheet, both on the home and on the project's own page.
 */
export default function ProjectHead({
  project,
  sheetNo,
  summary,
  href,
  as: Title = "h2",
  stacked = false,
  children,
}: {
  project: IProject;
  sheetNo: string;
  summary?: string | null;
  /** Links the name to the project's page. */
  href?: string;
  as?: "h1" | "h2";
  /** Title block under the text instead of beside it (narrow columns). */
  stacked?: boolean;
  children?: React.ReactNode;
}) {
  const status = statusFor(project);
  const meta = STATUS_META[status];
  const disciplines = disciplinesFor(project);
  const cells = disciplines.includes("3D") ? [...BASE_DISCIPLINES, "3D" as Discipline] : BASE_DISCIPLINES;
  const client = clientLabel(project);

  return (
    <div className={stacked ? "proj-head stacked" : "proj-head"}>
      <div>
        <div className={stampClass(status)}>
          <span className="glyph">{meta.glyph}</span> {meta.label}
        </div>
        <Title className={Title === "h1" ? "proj-name xl" : "proj-name"}>
          {href ? <Link href={href}>{project.name}</Link> : project.name}
        </Title>
        {summary ? <p className="proj-sub">{summary}</p> : null}
        <div className="disc mini" aria-label="Disciplines built">
          {cells.map((d) => (
            <span key={d} className={`cell ${disciplines.includes(d) ? "on" : ""}`}>{d}</span>
          ))}
        </div>
        {children}
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
  );
}

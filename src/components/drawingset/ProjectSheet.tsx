import Link from "next/link";
import type { IProject } from "@/types";
import { clientLabel, linksFor, projectHref, projectSlug, summaryFor } from "@/lib/stack";
import ProjectHead from "./ProjectHead";
import LogoPlate from "./LogoPlate";
import TopologyDiagram from "./TopologyDiagram";

/**
 * A featured project on the home, kept to a summary: logo, status, one-line pitch and
 * topology. The narrative, photos and stack schedule live on /project/[slug].
 */
export default function ProjectSheet({
  project,
  sheetNo,
  anchorId,
}: {
  project: IProject;
  sheetNo: string;
  anchorId?: string;
}) {
  const client = clientLabel(project);
  const links = linksFor(project);
  const href = projectHref(project);

  return (
    <section
      id={anchorId ?? projectSlug(project)}
      className="sheet project"
      data-sheetno={sheetNo}
      data-sheetlabel={project.name.toUpperCase()}
    >
      <div className="sheet-tag">
        <span className="no">{sheetNo}</span> Project Sheet <span className="rule" />
        {client || (project.kind ?? "")}
      </div>

      <ProjectHead project={project} sheetNo={sheetNo} summary={summaryFor(project)} href={href} />

      <div className="proj-body">
        <LogoPlate project={project} figure={sheetNo} href={href} />
        <div className="diagbox">
          <TopologyDiagram langs={project.lang} name={project.name} />
        </div>
      </div>

      <div className="sheet-actions">
        <Link className="btn primary" href={href}>Open full sheet →</Link>
        {links.map((l) => (
          <a key={l.url} className="btn" href={l.url} target="_blank" rel="noopener noreferrer">
            {l.label} ↗
          </a>
        ))}
      </div>
    </section>
  );
}

import Image from "next/image";
import Link from "next/link";
import type { IProject } from "@/types";

/**
 * The project's logo mounted on a plate. Logos arrive as full-bleed brand cards,
 * transparent marks and light wordmarks, so the plate stays dark in both themes —
 * a light logo would vanish on the paper theme otherwise.
 */
export default function LogoPlate({
  project,
  figure,
  href,
  priority = false,
}: {
  project: IProject;
  figure: string;
  /** Makes the plate a link to the project's page. */
  href?: string;
  priority?: boolean;
}) {
  const art = project.image ? (
    <Image
      src={project.image}
      alt={`${project.name} logo`}
      fill
      sizes="(min-width: 860px) 560px, 100vw"
      className="plate-img"
      priority={priority}
    />
  ) : (
    <span className="plate-tbd">
      <b>{project.name}</b>
      <small>Identity · TBD</small>
    </span>
  );

  return (
    <figure className="plate">
      {href ? (
        <Link href={href} className="plate-box" aria-label={`Open the ${project.name} sheet`}>
          {art}
        </Link>
      ) : (
        <div className="plate-box">{art}</div>
      )}
      <figcaption>Fig. {figure} — Identity</figcaption>
    </figure>
  );
}

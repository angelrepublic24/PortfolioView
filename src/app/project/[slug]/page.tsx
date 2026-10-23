import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { getProjects, getProjectSheet, getSiteContent, splitProjects } from "@/lib/data";
import { projectHref, projectSlug, summaryFor } from "@/lib/stack";
import DrawingFrame from "@/components/drawingset/DrawingFrame";
import SheetNav from "@/components/drawingset/SheetNav";
import TitleBlock from "@/components/drawingset/TitleBlock";
import SvgDefs from "@/components/drawingset/SvgDefs";
import ProjectDetail from "@/components/drawingset/ProjectDetail";
import DrawingSetEffects from "@/components/drawingset/DrawingSetEffects";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const { featured } = splitProjects(await getProjects());
  return featured.map((p) => ({ slug: projectSlug(p) }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sheet = await getProjectSheet(slug);
  if (!sheet) return {};

  const { project } = sheet;
  const title = `${project.name} — Angel Almonte`;
  const description = summaryFor(project, 160);
  const path = projectHref(project);
  // Overrides the root's canonical "/", or every project page would point search engines at the home.
  return {
    title: project.name,
    description,
    alternates: { canonical: path },
    openGraph: { type: "article", locale: "en_US", siteName: "Angel Almonte", url: path, title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const [sheet, content] = await Promise.all([getProjectSheet(slug), getSiteContent()]);
  if (!sheet) notFound();

  // Old links used the Mongo id (/project/65f…); send them to the named URL.
  const canonical = projectSlug(sheet.project);
  if (slug !== canonical) permanentRedirect(`/project/${canonical}`);

  const { project } = sheet;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.name,
    description: summaryFor(project, 200),
    url: `https://www.almonteportfolio.com${projectHref(project)}`,
    dateCreated: String(project.date),
    image: project.image || undefined,
    keywords: (project.lang ?? []).join(", ") || undefined,
    creator: { "@type": "Person", name: content.name, url: "https://www.almonteportfolio.com" },
  };

  return (
    <div className="drawing-set">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SvgDefs />
      <DrawingFrame />
      <SheetNav content={content} base="/" active="#work" />
      <main>
        <ProjectDetail {...sheet} />
      </main>
      <TitleBlock content={content} />
      <DrawingSetEffects />
    </div>
  );
}

import { getSiteData } from "@/lib/data";
import { summaryFor } from "@/lib/stack";
import DrawingFrame from "@/components/drawingset/DrawingFrame";
import SheetNav from "@/components/drawingset/SheetNav";
import TitleBlock from "@/components/drawingset/TitleBlock";
import SvgDefs from "@/components/drawingset/SvgDefs";
import Cover from "@/components/drawingset/Cover";
import GeneralNotes from "@/components/drawingset/GeneralNotes";
import ProjectSheet from "@/components/drawingset/ProjectSheet";
import RevHistory from "@/components/drawingset/RevHistory";
import Archive from "@/components/drawingset/Archive";
import IssueContact from "@/components/drawingset/IssueContact";
import DrawingSetEffects from "@/components/drawingset/DrawingSetEffects";

export const revalidate = 3600;

export default async function Home() {
  const { featured, archive, experience, content } = await getSiteData();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: content.name,
    jobTitle: content.role,
    url: "https://www.almonteportfolio.com",
    address: { "@type": "PostalAddress", addressRegion: "New Jersey", addressCountry: "US" },
    sameAs: [content.contact.github, content.contact.linkedin, content.contact.studio],
    email: `mailto:${content.contact.email}`,
    makesOffer: featured.map((p) => ({
      "@type": "CreativeWork",
      name: p.name,
      url: p.url || undefined,
      description: summaryFor(p, 200),
    })),
  };

  return (
    <div className="drawing-set">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SvgDefs />
      <DrawingFrame />
      <SheetNav content={content} />
      <main>
        <Cover content={content} />
        <GeneralNotes content={content} />
        {featured.map((p, i) => (
          <ProjectSheet
            key={p._id}
            project={p}
            sheetNo={`A-${String(i + 1).padStart(2, "0")}`}
            anchorId={i === 0 ? "work" : undefined}
          />
        ))}
        <RevHistory experience={experience} />
        <Archive projects={archive} />
        <IssueContact content={content} />
      </main>
      <TitleBlock content={content} />
      <DrawingSetEffects />
    </div>
  );
}

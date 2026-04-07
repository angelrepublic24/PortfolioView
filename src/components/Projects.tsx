import { IProject } from "@/types";
import { JobList } from "./JobList";
import SectionHeading from "./ui/SectionHeading";
import Container from "./ui/Container";

interface ProjectProps {
  projects: IProject[];
}

export default function Project({ projects }: ProjectProps) {
  const visible = projects.filter((p) => !p.hidden);

  return (
    <section id="work" className="relative py-24 md:py-32">
      <Container>
        <SectionHeading
          number="03"
          eyebrow="Selected work"
          title="Things I've built"
          subtitle="A selection of projects I've designed and developed — from full SaaS platforms to focused experiments."
        />
        <JobList projects={visible} limit={6} />
      </Container>
    </section>
  );
}

import SectionHeading from "./ui/SectionHeading";
import Container from "./ui/Container";

const skills = [
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "NestJS",
  "PostgreSQL",
  "MongoDB",
  "AWS S3",
  "React Native",
  "JavaScript",
  "HTML",
];

export default function About() {
  return (
    <section id="about" className="relative py-24 md:py-32">
      <Container>
        <SectionHeading number="01" eyebrow="About me" title="A bit about me" />

        <div className="grid grid-cols-1 md:grid-cols-5 gap-12">
          <div className="md:col-span-3 space-y-5 text-zinc-400 leading-relaxed">
            <p>
              Hello! My name is Angel and I enjoy creating things that live on
              the internet. My journey in web development started back in{" "}
              <span className="text-zinc-200">2018</span>, when I built my
              first project and quickly fell in love with turning ideas into
              real, working software.
            </p>
            <p>
              In <span className="text-zinc-200">2024</span> I founded my own
              software company,{" "}
              <a
                href="https://drts.us"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-400 hover:text-brand-300 underline underline-offset-4"
              >
                Development Real Time Strategy (DRTS)
              </a>
              , focused on shipping modern, scalable products for clients and
              internal initiatives.
            </p>
            <p>
              Currently, I&apos;m the{" "}
              <span className="text-zinc-200">Lead Developer &amp; Architect</span>{" "}
              at <span className="text-zinc-200">Tudelu</span>, where I designed
              and built their <span className="text-zinc-200">CRM from scratch</span>
              {" "}— end to end, from the database schema and backend services
              all the way to the UI. I architected the platform with a clean,
              modular approach using{" "}
              <span className="text-zinc-200">NestJS</span> and{" "}
              <span className="text-zinc-200">PostgreSQL</span> on the backend,
              and <span className="text-zinc-200">Next.js</span>,{" "}
              <span className="text-zinc-200">TypeScript</span> and{" "}
              <span className="text-zinc-200">Tailwind</span> on the frontend,
              with a full <span className="text-zinc-200">Stripe</span>{" "}
              integration for payments, orders and quotes, role-based access
              control, file storage on AWS S3, and a workflow tailored to how
              the business actually operates day-to-day.
            </p>
            <p>
              Here are some of the technologies I work with on a daily basis:
            </p>

            <ul className="grid grid-cols-2 gap-y-2 gap-x-4 pt-2 font-mono text-sm">
              {skills.map((s) => (
                <li
                  key={s}
                  className="flex items-center gap-2 text-zinc-400"
                >
                  <span className="text-brand-400">▹</span>
                  {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2 flex justify-center md:justify-end">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl blur opacity-30 group-hover:opacity-60 transition-opacity" />
              <div className="relative w-60 h-60 md:w-72 md:h-72 rounded-xl border border-brand-500/40 bg-zinc-900/60 overflow-hidden flex items-center justify-center">
                <span className="font-signika text-7xl font-bold bg-gradient-to-br from-brand-300 to-brand-600 bg-clip-text text-transparent">
                  AA
                </span>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}

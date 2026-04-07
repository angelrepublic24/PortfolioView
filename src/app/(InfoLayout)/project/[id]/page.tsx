import { getProject, getProjectById } from "@/api/ProjectApi";
import { IProject } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink } from "lucide-react";

export async function generateStaticParams() {
  try {
    const allProjects = await getProject();
    return allProjects.map((p) => ({ id: p._id.toString() }));
  } catch {
    return [];
  }
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project: IProject | null = await getProjectById(id).catch(() => null);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-zinc-400 mb-4">Project not found.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-brand-400 hover:text-brand-300"
          >
            <ArrowLeft size={16} /> Back home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24">
      <div className="max-w-5xl mx-auto px-6 md:px-8">
        <Link
          href="/#work"
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-brand-400 transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Back to projects
        </Link>

        <div className="flex flex-col gap-3 mb-10">
          <p className="font-mono text-xs uppercase tracking-widest text-brand-400">
            Featured project · {project.date}
          </p>
          <h1 className="font-signika text-4xl md:text-6xl font-bold tracking-tight text-zinc-100">
            {project.name}
          </h1>
          {project.url && (
            <Link
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-brand-400 hover:text-brand-300 text-sm w-fit"
            >
              <ExternalLink size={14} />
              {project.url}
            </Link>
          )}
        </div>

        {project.image && (
          <div className="relative w-full aspect-[16/9] mb-12 rounded-2xl overflow-hidden border border-zinc-800 bg-gradient-to-br from-zinc-950 to-zinc-900">
            <Image
              src={project.image}
              alt={project.name}
              fill
              sizes="(min-width: 1024px) 1024px, 100vw"
              className="object-contain p-6 md:p-10"
              priority
            />
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-[1fr_240px] gap-12">
          <div
            className="prose prose-invert prose-lg max-w-none prose-headings:font-signika prose-headings:text-zinc-100 prose-p:text-zinc-400 prose-li:text-zinc-400 prose-strong:text-zinc-200 prose-a:text-brand-400 prose-blockquote:border-brand-500 prose-code:text-brand-300"
            dangerouslySetInnerHTML={{ __html: project.description }}
          />

          <aside className="space-y-6">
            <div>
              <h3 className="text-xs uppercase tracking-widest text-zinc-500 mb-3 font-mono">
                Tech stack
              </h3>
              <ul className="flex flex-wrap gap-1.5">
                {project.lang?.map((lang, i) => (
                  <li
                    key={i}
                    className="text-[10px] font-mono uppercase tracking-wider text-brand-300 bg-brand-500/10 border border-brand-500/20 rounded-full px-2.5 py-1"
                  >
                    {lang}
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

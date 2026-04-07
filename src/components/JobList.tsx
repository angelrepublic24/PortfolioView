import { IProject } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { ExternalLink, ArrowUpRight, FolderGit2 } from "lucide-react";

interface JobProps {
  projects: IProject[];
  limit: number;
}

export const JobList = ({ projects, limit }: JobProps) => {
  if (!Array.isArray(projects) || projects.length === 0) {
    return (
      <div className="text-center py-16 border border-dashed border-zinc-800 rounded-xl">
        <FolderGit2 className="mx-auto text-zinc-700 mb-3" size={32} />
        <p className="text-zinc-500">No projects to show yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {projects.slice(0, limit).map((project) => (
        <article
          key={project._id}
          className="group relative bg-zinc-900/40 border border-zinc-800 rounded-xl overflow-hidden backdrop-blur-sm transition-all duration-300 hover:border-brand-500/40 hover:bg-zinc-900/60 hover:-translate-y-1 hover:shadow-[0_0_50px_-12px_rgba(139,92,246,0.4)] flex flex-col"
        >
          {/* Image */}
          <div className="relative w-full aspect-[16/10] overflow-hidden bg-gradient-to-br from-zinc-950 to-zinc-900 border-b border-zinc-800/60">
            {project.image ? (
              <Image
                src={project.image}
                alt={project.name}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-contain p-4 transition-transform duration-500 group-hover:scale-[1.03]"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-zinc-700">
                <FolderGit2 size={40} />
              </div>
            )}
          </div>

          {/* Body */}
          <div className="p-6 flex-1 flex flex-col">
            <div className="flex items-start justify-between gap-3 mb-2">
              <Link href={`/project/${project._id}`}>
                <h3 className="text-lg font-semibold text-zinc-100 group-hover:text-brand-400 transition-colors">
                  {project.name}
                </h3>
              </Link>
              {project.url && (
                <Link
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-500 hover:text-brand-400 transition-colors flex-shrink-0"
                  aria-label="Open live site"
                >
                  <ExternalLink size={18} />
                </Link>
              )}
            </div>

            <p className="text-sm text-zinc-400 line-clamp-2 mb-4 flex-1">
              {/* strip HTML tags for the card preview */}
              {project.description?.replace(/<[^>]*>/g, "").slice(0, 160)}
            </p>

            {project.lang && project.lang.length > 0 && (
              <ul className="flex flex-wrap gap-1.5 mb-4">
                {project.lang.slice(0, 5).map((lang, i) => (
                  <li
                    key={i}
                    className="text-[10px] font-mono uppercase tracking-wider text-brand-300 bg-brand-500/10 border border-brand-500/20 rounded-full px-2 py-0.5"
                  >
                    {lang}
                  </li>
                ))}
              </ul>
            )}

            <Link
              href={`/project/${project._id}`}
              className="inline-flex items-center gap-1.5 text-sm text-brand-400 hover:text-brand-300 font-medium group/link mt-auto"
            >
              View case study
              <ArrowUpRight
                size={14}
                className="transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5"
              />
            </Link>
          </div>
        </article>
      ))}
    </div>
  );
};

"use client";
import { useQuery } from "@tanstack/react-query";
import { getExperience } from "@/api/ExperienceApi";
import { IExperience } from "@/types";
import SectionHeading from "./ui/SectionHeading";
import Container from "./ui/Container";
import { useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";

export default function Experiences() {
  const [active, setActive] = useState(0);
  const { data: experiences = [], isLoading, isError } = useQuery<IExperience[]>({
    queryFn: getExperience,
    queryKey: ["experiences"],
    retry: 1,
    refetchOnWindowFocus: false,
  });

  if (isLoading)
    return (
      <section id="experience" className="py-24">
        <Container>
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-zinc-900 rounded" />
            <div className="h-40 bg-zinc-900/50 rounded-xl" />
          </div>
        </Container>
      </section>
    );
  if (isError) return null;

  const visible = experiences.filter((e) => !e.hidden);
  const current = visible[active];

  return (
    <section id="experience" className="relative py-24 md:py-32">
      <Container>
        <SectionHeading
          number="02"
          eyebrow="Career"
          title="Where I've worked"
        />

        {visible.length === 0 ? (
          <p className="text-zinc-500">No experience to show yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-[200px_1fr] gap-8">
            {/* Tabs */}
            <div className="flex md:flex-col overflow-x-auto md:overflow-x-hidden border-b md:border-b-0 md:border-l border-zinc-800 md:max-w-[200px]">
              {visible.map((exp, i) => (
                <button
                  key={exp._id}
                  onClick={() => setActive(i)}
                  title={exp.company}
                  className={`flex-shrink-0 md:flex-shrink md:w-full text-left px-4 py-3 text-sm font-mono transition-all border-b-2 md:border-b-0 md:border-l-2 -mb-px md:-ml-px md:max-w-full md:overflow-hidden md:text-ellipsis md:whitespace-nowrap whitespace-nowrap ${
                    i === active
                      ? "border-brand-400 text-brand-400 bg-brand-500/5"
                      : "border-transparent text-zinc-500 hover:text-zinc-300 hover:bg-zinc-900/40"
                  }`}
                >
                  {exp.company}
                </button>
              ))}
            </div>

            {/* Content */}
            {current && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-xl font-semibold text-zinc-100">
                  {current.position}{" "}
                  <span className="text-brand-400">
                    @{" "}
                    {current.url ? (
                      <Link
                        href={current.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline inline-flex items-center gap-1"
                      >
                        {current.company}
                        <ExternalLink size={14} />
                      </Link>
                    ) : (
                      current.company
                    )}
                  </span>
                </h3>
                <p className="font-mono text-xs text-zinc-500">
                  {current.date[0]} — {current.date[1]}
                </p>
                <div
                  className="prose prose-invert prose-sm max-w-none prose-p:text-zinc-400 prose-li:text-zinc-400 prose-strong:text-zinc-200 prose-a:text-brand-400"
                  dangerouslySetInnerHTML={{ __html: current.description }}
                />
                {current.lang && current.lang.length > 0 && (
                  <ul className="flex flex-wrap gap-1.5 pt-2">
                    {current.lang.map((l, i) => (
                      <li
                        key={i}
                        className="text-[10px] font-mono uppercase tracking-wider text-brand-300 bg-brand-500/10 border border-brand-500/20 rounded-full px-2 py-0.5"
                      >
                        {l}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>
        )}
      </Container>
    </section>
  );
}

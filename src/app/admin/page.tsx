"use client";
import { getAllProjectsAdmin } from "@/api/ProjectApi";
import { getAllExperiencesAdmin } from "@/api/ExperienceApi";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  FolderGit2,
  Briefcase,
  Eye,
  EyeOff,
  Plus,
  ArrowUpRight,
} from "lucide-react";

function StatCard({
  label,
  value,
  icon: Icon,
  accent = false,
}: {
  label: string;
  value: number | string;
  icon: any;
  accent?: boolean;
}) {
  return (
    <div
      className={`relative bg-zinc-900/40 border ${
        accent ? "border-brand-500/40" : "border-zinc-800"
      } rounded-xl p-6 backdrop-blur-sm`}
    >
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs uppercase tracking-widest text-zinc-500 font-mono">
          {label}
        </p>
        <Icon
          size={18}
          className={accent ? "text-brand-400" : "text-zinc-600"}
        />
      </div>
      <p className="text-3xl font-bold text-zinc-100 font-signika">{value}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const { data: projects = [] } = useQuery({
    queryFn: getAllProjectsAdmin,
    queryKey: ["admin-projects"],
    retry: 1,
    refetchOnWindowFocus: false,
  });
  const { data: experiences = [] } = useQuery({
    queryFn: getAllExperiencesAdmin,
    queryKey: ["admin-experiences"],
    retry: 1,
    refetchOnWindowFocus: false,
  });

  const visibleProjects = projects.filter((p) => !p.hidden).length;
  const hiddenProjects = projects.filter((p) => p.hidden).length;

  return (
    <div className="space-y-10 max-w-6xl">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="font-mono text-xs text-brand-400 mb-2">
            Welcome back
          </p>
          <h1 className="font-signika text-3xl md:text-4xl font-bold text-zinc-100">
            Dashboard
          </h1>
          <p className="text-zinc-500 mt-1">
            Manage your portfolio content from here.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/create/project"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium transition"
          >
            <Plus size={16} /> New project
          </Link>
          <Link
            href="/admin/create/experience"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-brand-500/40 text-brand-300 hover:bg-brand-500/10 text-sm font-medium transition"
          >
            <Plus size={16} /> New experience
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Projects"
          value={projects.length}
          icon={FolderGit2}
          accent
        />
        <StatCard
          label="Experiences"
          value={experiences.length}
          icon={Briefcase}
        />
        <StatCard label="Visible" value={visibleProjects} icon={Eye} />
        <StatCard label="Hidden" value={hiddenProjects} icon={EyeOff} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/admin/projects"
          className="group bg-zinc-900/40 border border-zinc-800 rounded-xl p-6 hover:border-brand-500/40 hover:bg-zinc-900/60 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-zinc-100 font-medium">Manage projects</h3>
            <ArrowUpRight
              size={16}
              className="text-zinc-500 group-hover:text-brand-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
            />
          </div>
          <p className="text-sm text-zinc-500">
            Create, edit, hide and delete your portfolio projects.
          </p>
        </Link>

        <Link
          href="/admin/experiences"
          className="group bg-zinc-900/40 border border-zinc-800 rounded-xl p-6 hover:border-brand-500/40 hover:bg-zinc-900/60 transition-all"
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-zinc-100 font-medium">Manage experiences</h3>
            <ArrowUpRight
              size={16}
              className="text-zinc-500 group-hover:text-brand-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all"
            />
          </div>
          <p className="text-sm text-zinc-500">
            Update your career timeline and rich job descriptions.
          </p>
        </Link>
      </div>
    </div>
  );
}

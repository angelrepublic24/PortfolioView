"use client";
import { getAllProjectsAdmin } from "@/api/ProjectApi";
import { AllProjects } from "@/components/admin/AllProjects";
import { useQuery } from "@tanstack/react-query";

export default function AdminProjectsPage() {
  const { data, isLoading, isError } = useQuery({
    queryFn: getAllProjectsAdmin,
    queryKey: ["admin-projects"],
    retry: 1,
    refetchOnWindowFocus: false,
  });

  if (isLoading)
    return (
      <div className="text-zinc-500 text-sm flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
        Loading projects…
      </div>
    );
  if (isError) return <p className="text-red-400">Error loading projects.</p>;
  if (!data) return null;

  return <AllProjects projects={data} />;
}

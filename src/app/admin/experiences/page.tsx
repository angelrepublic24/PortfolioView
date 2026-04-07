"use client";
import { getAllExperiencesAdmin } from "@/api/ExperienceApi";
import { AllExperience } from "@/components/admin/AllExperiences";
import { useQuery } from "@tanstack/react-query";

export default function AdminExperiencesPage() {
  const { data, isLoading, isError } = useQuery({
    queryFn: getAllExperiencesAdmin,
    queryKey: ["admin-experiences"],
    retry: 1,
    refetchOnWindowFocus: false,
  });

  if (isLoading)
    return (
      <div className="text-zinc-500 text-sm flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
        Loading experiences…
      </div>
    );
  if (isError) return <p className="text-red-400">Error loading experiences.</p>;
  if (!data) return null;

  return <AllExperience experiences={data} />;
}

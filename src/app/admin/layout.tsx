"use client";
import AdminSidebar from "@/components/admin/AdminSidebar";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/api/UserApi";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { data, isLoading, isError } = useQuery({
    queryFn: getUser,
    queryKey: ["user"],
    retry: 1,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (isError) router.push("/login");
  }, [isError, router]);

  if (isLoading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="flex items-center gap-3 text-zinc-500">
          <div className="w-2 h-2 rounded-full bg-brand-500 animate-pulse" />
          Loading admin...
        </div>
      </div>
    );
  if (!data) return null;

  return (
    <div className="min-h-screen bg-zinc-950">
      <AdminSidebar />
      <main className="lg:pl-64 pt-14 lg:pt-0">
        <div className="p-6 md:p-10">{children}</div>
      </main>
    </div>
  );
}

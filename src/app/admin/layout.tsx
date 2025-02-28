"use client";
import AdminHeader from "@/components/AdminHeader";
import { usePathname } from "next/navigation";
import { Providers } from "../providers";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUser } from "@/api/UserApi";
import { useEffect } from "react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const {data, isLoading, isError} = useQuery({
    queryFn: getUser,
    queryKey: ['user'],
    retry: 1,
    refetchOnWindowFocus: false
  })
  const pathname = usePathname();
  const hidePage = ["/admin/login"];

  useEffect(() => {
    if (isError) {
      router.push("/login");
    }
  }, [isError, router]);

  if(isLoading) return 'Loading....';
  if(!data)  return null;
  return (
    <div className="mx-auto min-h-screen max-w-screen-2xl px-6 py-12 font-sans md:px-12 md:py-20 lg:px-24 lg:py-0">
      <div className="lg:flex lg:justify-center lg:gap-4">
          {!hidePage.includes(pathname) && <AdminHeader />}
          <main id="content" className="pt-24 lg:w-1/2 lg:py-24">
            {children}
          </main>
      </div>
    </div>
  );
}

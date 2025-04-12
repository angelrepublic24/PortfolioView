"use client";
import AdminHeader from "@/components/admin/AdminHeader";
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
    <div className="">
      <div className="">
          {!hidePage.includes(pathname) && <AdminHeader />}
          <main id="content" className="">
            {children}
          </main>
      </div>
    </div>
  );
}

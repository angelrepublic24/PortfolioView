"use client";
import { getProject } from "@/api/ProjectApi";
import About from "@/components/About";
import Experiences from "@/components/Experience";
import { HeroSection } from "@/components/Home";
import Project from "@/components/Projects";
import { IProject } from "@/types";
import ScrollHandler from "@/utils/ScrollHandler";
import { useQuery } from "@tanstack/react-query";
import { Suspense } from "react";

export default function Home() {
  const { data: projects = [], isLoading } = useQuery<IProject[]>({
    queryFn: getProject,
    queryKey: ["projects"],
    retry: 1,
    refetchOnWindowFocus: false,
  });

  return (
    <>
      <Suspense fallback={null}>
        <ScrollHandler />
      </Suspense>
      <HeroSection />
      <About />
      <Experiences />
      {!isLoading && <Project projects={projects} />}
    </>
  );
}

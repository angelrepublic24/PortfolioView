
'use client'
import { getProject } from "@/api/ProjectApi";
import About from "@/components/About";
import Experiences from "@/components/Experience";
import Project from "@/components/Projects";
import { IProject } from "@/types";
import { useQueryClient } from "@tanstack/react-query";

export default function Admin() {
  const queryClient = useQueryClient();
  const data: IProject[] =  queryClient.getQueryData(["projects"])!;

  return (
    <>
      <About />
      <Experiences />
      <Project projects={data} />
    </>
  );
}

'use client'
import { getProject } from "@/api/ProjectApi";
import About from "@/components/About";
import Experiences from "@/components/Experience";
import { HeroSection } from "@/components/Home";
import Project from "@/components/Projects";
import { IProject } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { scroller } from "react-scroll";



export default function Home(){
    const searchParams = useSearchParams();
  const scrollTo = searchParams.get('scrollTo');

  useEffect(() => {
    if (scrollTo) {
      scroller.scrollTo(scrollTo, {
        smooth: true,
        duration: 500,
        offset: -100,
      });
    }
  }, [scrollTo]);
    const {data: projects = [], isLoading, isError} = useQuery<IProject[]>({
        queryFn: getProject,
        queryKey: ['projects'],
        retry: 1,
        refetchOnWindowFocus: false
    })
    if(isLoading) return 'Loading....'
    if(isError) return 'Error loading'

    return (
        <>
            <HeroSection />
            <About />
            <Experiences/> 
            {projects && <Project projects={projects} />}
        </>
    )
}
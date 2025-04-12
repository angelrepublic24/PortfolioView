'use client'
import { getProject } from "@/api/ProjectApi";
import About from "@/components/About";
import Experiences from "@/components/Experience";
import { HeroSection } from "@/components/Home";
import Project from "@/components/Projects";
import { IProject } from "@/types";
import ScrollHandler from "@/utils/ScrollHandler";
import { useQuery } from "@tanstack/react-query";



export default function Home(){
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
            <ScrollHandler />
            <HeroSection />
            <About />
            <Experiences/> 
            {projects && <Project projects={projects} />}
        </>
    )
}
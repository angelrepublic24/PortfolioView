'use client'
import { getProject } from "@/api/ProjectApi";
import { Archive } from "@/components/Archive";
import { IProject } from "@/types";
import { useQuery, useQueryClient } from "@tanstack/react-query";


export default function(){
   const {data: projects = [], isLoading, isError} = useQuery<IProject[]>({
    queryFn: getProject,
    queryKey: ['projects'],
    retry: 1
   })

   if(isLoading) return 'Loading....'
    if(isError) return 'Error loading'
    return (
        <>
            {projects && <Archive projects={projects}/>}
        </>
        
    )

}
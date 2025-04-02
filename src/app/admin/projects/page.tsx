'use client'
import { getProject } from "@/api/ProjectApi";
import {AllProjects} from "@/components/AllProjects";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";



export default function (){
    const {data, isLoading, isError} = useQuery({
        queryFn: getProject,
        queryKey: ['projects'],
        retry: 1,
        refetchOnWindowFocus: false
      })

      if(isLoading) return 'Loading....';
      if(isError) return <p>Error loading'</p>
      if(!data) return null
      console.log(data)

      return (
        <AllProjects projects={data}/>
      )

}
'use client'
import { getExperience } from "@/api/ExperienceApi";
import { AllExperience } from "@/components/AllExperiences";
import { useQuery } from "@tanstack/react-query";



export default function (){
    const {data, isLoading, isError} = useQuery({
        queryFn: getExperience,
        queryKey: ['experiences'],
        retry: 1,
        refetchOnWindowFocus: false
      })

      if(isLoading) return 'Loading....';
      if(isError) return <p>Error loading'</p>
      if(!data) return null

      return (
        <AllExperience experiences={data} />
      )

}
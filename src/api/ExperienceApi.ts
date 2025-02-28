import api from "@/global/Global";
import { ExperienceForm, IExperience } from "@/types";
import { isAxiosError } from "axios";


export async function getExperience():Promise<IExperience[]>{
    try{
        const {data} = await api("/experience");
        return data.experience
    }   catch(error){
        if(isAxiosError(error) && error.response)
            throw new Error(error.response.data)
    }
    return []
}

export async function createExperience(formData: ExperienceForm){
    try {
        const {data} = await api.post("/experience", formData);
        console.log(data)
        return data;
    } catch (error) {
        if(isAxiosError(error) && error.response)
            throw new Error(error.response.data);
    }
}
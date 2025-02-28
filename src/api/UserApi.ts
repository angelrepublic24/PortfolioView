import api from "@/global/Global";
import { isAxiosError } from "axios";


export async function getUser(){
    try {
        const {data} = await api.get("auth/profile");
        return data
    } catch (error) {
        if (isAxiosError(error) && error.response)
            throw new Error(error.response.data);
    }
}
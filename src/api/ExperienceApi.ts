import api from "@/global/Global";
import { ExperienceForm, IExperience } from "@/types";
import { isAxiosError } from "axios";


export async function getExperience(): Promise<IExperience[]> {
    try {
        const { data } = await api("/experience");
        return data.experience;
    } catch (error) {
        if (isAxiosError(error) && error.response)
            throw new Error(error.response.data);
    }
    return [];
}

export async function getAllExperiencesAdmin(): Promise<IExperience[]> {
    try {
        const { data } = await api("/admin/experience");
        return data.experience;
    } catch (error) {
        if (isAxiosError(error) && error.response)
            throw new Error(error.response.data);
    }
    return [];
}

export async function getExperienceById(id: string): Promise<IExperience> {
    try {
        const { data } = await api(`/experience/${id}`);
        return data.experience;
    } catch (error) {
        if (isAxiosError(error) && error.response)
            throw new Error(error.response.data);
        throw new Error("Unexpected error fetching experience");
    }
}

export async function createExperience(formData: ExperienceForm) {
    try {
        const { data } = await api.post("/experience", formData);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response)
            throw new Error(error.response.data);
    }
}

export async function updateExperience({ id, formData }: { id: string; formData: Partial<ExperienceForm> }) {
    try {
        const { data } = await api.patch(`/experience/${id}`, formData);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response)
            throw new Error(error.response.data);
    }
}

export async function deleteExperience(id: string) {
    try {
        await api.delete(`/experience/${id}`);
        return;
    } catch (error) {
        if (isAxiosError(error) && error.response)
            throw new Error(error.response.data);
    }
}

export async function reorderExperiences(items: { id: string; order: number }[]) {
    try {
        const { data } = await api.patch("/experience/reorder/all", { items });
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response)
            throw new Error(error.response.data);
    }
}

export async function toggleExperienceVisibility(id: string) {
    try {
        const { data } = await api.patch(`/experience/${id}/visibility`);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response)
            throw new Error(error.response.data);
    }
}

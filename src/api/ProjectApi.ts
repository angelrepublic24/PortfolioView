import api from "@/global/Global";
import { IProject, ProductForm } from "@/types";
import { isAxiosError } from "axios";


export async function getProject(): Promise<IProject[]> {
    try {
        const { data } = await api("/projects");
        return data.projects;
    } catch (error) {
        if (isAxiosError(error) && error.response)
            throw new Error(error.response.data);
    }
    return [];
}

export async function getAllProjectsAdmin(): Promise<IProject[]> {
    try {
        const { data } = await api("/admin/projects");
        return data.projects;
    } catch (error) {
        if (isAxiosError(error) && error.response)
            throw new Error(error.response.data);
    }
    return [];
}

export async function getProjectById(projectId: string): Promise<IProject> {
    try {
        const { data } = await api(`/projects/${projectId}`);
        return data.project;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            throw new Error(error.response.data);
        }
        throw new Error("Unexpected error fetching project");
    }
}

export async function createProject(formData: Partial<ProductForm>) {
    try {
        const { data } = await api.post("/project", formData);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response)
            throw new Error(error.response.data);
    }
}

export async function updateProject({ id, formData }: { id: string; formData: Partial<ProductForm> }) {
    try {
        const { data } = await api.patch(`/project/${id}`, formData);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response)
            throw new Error(error.response.data);
    }
}

export async function reorderProjects(items: { id: string; order: number }[]) {
    try {
        const { data } = await api.patch("/projects/reorder", { items });
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response)
            throw new Error(error.response.data);
    }
}

export async function toggleProjectVisibility(id: string) {
    try {
        const { data } = await api.patch(`/project/${id}/visibility`);
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response)
            throw new Error(error.response.data);
    }
}

export async function uploadImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const { data } = await api.post(`/upload`, formData);
        if (!data) {
            throw new Error("Image URL not returned from server.");
        }
        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response)
            throw new Error(error.response.data);
    }
}

export async function deleteProject(projectId: string) {
    try {
        await api.delete(`project/${projectId}`);
        return;
    } catch (error) {
        if (isAxiosError(error) && error.response)
            throw new Error(error.response.data);
    }
}

export async function deleteImage(publicId: string) {
    try {
        if (!publicId) return;
        const removeData = await api.delete("/delete-image", { data: { publicId } });
        return removeData;
    } catch (error) {
        if (isAxiosError(error) && error.response)
            throw new Error(error.response.data);
    }
}

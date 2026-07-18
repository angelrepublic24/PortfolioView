import api from "@/global/Global";
import { isAxiosError } from "axios";

export async function getSiteContentAdmin() {
  try {
    const { data } = await api("/site-content");
    return data.siteContent;
  } catch (error) {
    if (isAxiosError(error) && error.response) throw new Error(error.response.data);
  }
  return null;
}

export async function updateSiteContent(payload: Record<string, unknown>) {
  try {
    const { data } = await api.patch("/site-content", payload);
    return data;
  } catch (error) {
    if (isAxiosError(error) && error.response) throw new Error(error.response.data);
  }
}

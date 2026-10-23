import { renderOG, renderProjectOG, ogSize } from "@/lib/og";
import { getProjectSheet } from "@/lib/data";
import { STATUS_META, statusFor, summaryFor } from "@/lib/stack";

// Edge like the root cards: next/og on the Node runtime fails on Windows ("Invalid URL").
export const runtime = "edge";
export const alt = "Project sheet — Angel Almonte";
export const size = ogSize;
export const contentType = "image/png";

export default async function OpengraphImage({ params }: { params: { slug: string } }) {
  const sheet = await getProjectSheet(params.slug);
  if (!sheet) return renderOG();
  const { project, sheetNo } = sheet;
  return renderProjectOG({
    sheetNo,
    name: project.name,
    status: STATUS_META[statusFor(project)].label,
    summary: summaryFor(project, 170),
  });
}

import { renderOG, ogSize, ogAlt } from "@/lib/og";

export const runtime = "edge";
export const alt = ogAlt;
export const size = ogSize;
export const contentType = "image/png";

export default function TwitterImage() {
  return renderOG();
}

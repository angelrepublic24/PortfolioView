import type { IProject, Discipline, ProjectStatus, ProjectLink } from "@/types";

/**
 * Presentation logic for the "Drawing Set" design.
 * None of this is per-project hardcoding — every value is DERIVED from the
 * project's own data (its `lang` stack, `status`, etc.) coming from the database,
 * or read straight from optional DB fields when the admin has set them.
 * It is the visual grammar (like a color legend), not content.
 */

export type Layer = "UI" | "STATE" | "API" | "DOMAIN" | "DATA" | "INFRA";
export const LAYER_ORDER: Layer[] = ["UI", "STATE", "API", "DOMAIN", "DATA", "INFRA"];

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");

// Third-party SaaS / APIs the product only INTEGRATES => drawn in blue.
const EXTERNAL = [
  "stripe", "paypal", "googlemaps", "maps", "openai", "dalle", "sendgrid", "supabase",
  "awss3", "s3", "aws", "vapi", "cloudinary", "hubspot", "twilio", "serpapi", "pubsub",
  "firebase", "fcm", "mailtrap", "genezio",
];

const LAYER_RULES: { layer: Layer; match: string[] }[] = [
  { layer: "STATE", match: ["zustand", "tanstack", "tanquery", "tanstackquery", "reactquery", "redux", "recoil", "jotai"] },
  { layer: "UI", match: ["nextjs", "next", "reactnative", "expo", "reactjs", "react", "tailwind", "tailwindcss", "shadcn", "shadcnui", "chakra", "chakraui", "html", "htmlcss", "css", "bootstrap", "vuejs", "vue", "angular", "wordpress", "woocommerce", "framer", "framermotion", "threejs", "three", "r3f", "swiftui", "flutter", "kotlin"] },
  { layer: "API", match: ["nestjs", "nest", "expressjs", "express", "nodejs", "node", "fastify", "django", "flask", "springboot", "spring", "laravel", "php", "graphql", "restapi", "rest", "socketio", "socket", "vaadin", "java"] },
  { layer: "DATA", match: ["postgresql", "postgres", "mysql", "mongodb", "mongo", "mongoose", "prisma", "typeorm", "sqlite", "redis", "supabase", "atlas", "vectorsearch", "mssql"] },
  { layer: "INFRA", match: ["stripe", "sendgrid", "cloudinary", "googlemaps", "maps", "openai", "dalle", "vapi", "docker", "vercel", "genezio", "hubspot", "twilio", "serpapi", "pubsub", "firebase", "fcm", "awss3", "s3", "aws"] },
];

export type TechNode = { label: string; key: string; layer: Layer; external: boolean };

export function classifyTech(name: string): TechNode {
  const n = norm(name);
  let layer: Layer = "DOMAIN";
  for (const rule of LAYER_RULES) {
    if (rule.match.some((m) => n === m || n.includes(m))) {
      layer = rule.layer;
      break;
    }
  }
  const external = EXTERNAL.some((m) => n === m || n.includes(m));
  return { label: name.trim(), key: n, layer, external };
}

/** Dedupe + classify a project's stack, ordered by architectural layer. */
export function stackRows(langs: string[] = []): TechNode[] {
  const seen = new Set<string>();
  const rows: TechNode[] = [];
  for (const l of langs) {
    const node = classifyTech(l);
    if (!node.key || seen.has(node.key)) continue;
    seen.add(node.key);
    rows.push(node);
  }
  return rows.sort((a, b) => LAYER_ORDER.indexOf(a.layer) - LAYER_ORDER.indexOf(b.layer));
}

const DISCIPLINE_RULES: { d: Discipline; match: string[]; not?: string[] }[] = [
  { d: "APP", match: ["reactnative", "expo", "swift", "kotlin", "flutter"] },
  { d: "WEB", match: ["nextjs", "next", "reactjs", "react", "tailwind", "shadcn", "chakra", "html", "css", "bootstrap", "vue", "angular", "wordpress", "woocommerce"], not: ["reactnative"] },
  { d: "API", match: ["nestjs", "nest", "express", "node", "fastify", "django", "spring", "php", "graphql", "socketio", "socket", "laravel", "vaadin", "java"] },
  { d: "DB", match: ["postgres", "postgresql", "mysql", "mongo", "mongodb", "mongoose", "prisma", "typeorm", "supabase", "redis", "atlas", "sqlite"] },
  { d: "PAY", match: ["stripe", "paypal"] },
  { d: "OPS", match: ["socketio", "socket", "googlemaps", "maps", "aws", "s3", "docker", "cloudinary", "sendgrid", "pubsub", "twilio", "fcm", "firebase"] },
  { d: "3D", match: ["three", "threejs", "webgl", "r3f"] },
];

export const ALL_DISCIPLINES: Discipline[] = ["WEB", "APP", "API", "DB", "PAY", "OPS", "3D"];

/** Derive discipline stamp cells from the tech stack (unless set explicitly in the DB). */
export function deriveDisciplines(langs: string[] = []): Discipline[] {
  const normed = langs.map(norm);
  const has = (arr: string[], not?: string[]) =>
    normed.some((n) => arr.some((m) => n === m || n.includes(m))) &&
    !(not && normed.some((n) => not.some((m) => n === m || n.includes(m)) && !arr.some((m) => n === m || n.includes(m))));
  const out: Discipline[] = [];
  for (const rule of DISCIPLINE_RULES) {
    const match = normed.some((n) => rule.match.some((m) => n === m || n.includes(m)));
    const blocked = rule.not ? normed.some((n) => rule.not!.some((m) => n === m || n.includes(m))) && !normed.some((n) => rule.match.some((m) => n === m)) : false;
    if (match && !blocked) out.push(rule.d);
  }
  return out;
}

export function disciplinesFor(project: IProject): Discipline[] {
  if (project.disciplines && project.disciplines.length) return project.disciplines;
  return deriveDisciplines(project.lang);
}

export const STATUS_META: Record<ProjectStatus, { label: string; glyph: string; tone: "amber" | "muted" }> = {
  live: { label: "Issued / Live", glyph: "●", tone: "amber" },
  "in-dev": { label: "In development", glyph: "◐", tone: "amber" },
  "pre-launch": { label: "Pre-launch", glyph: "◔", tone: "amber" },
  frontier: { label: "Frontier · Issued for review", glyph: "▲", tone: "amber" },
  archived: { label: "Superseded", glyph: "◌", tone: "muted" },
};

/** Read status from the DB, or infer it from the description / date. */
export function statusFor(project: IProject): ProjectStatus {
  if (project.status) return project.status;
  const text = `${project.summary ?? ""} ${project.description ?? ""}`.toLowerCase();
  if (/coming soon|in progress|in development|pre-?launch|building|wip/.test(text)) return "in-dev";
  return "live";
}

const KIND_LABEL: Record<string, string> = {
  personal: "Personal",
  client: "Client",
  employer: "Employer",
};

/** The title-block "Client" field value. */
export function clientLabel(project: IProject): string {
  if (project.client) return project.client;
  if (project.kind) return KIND_LABEL[project.kind] ?? "";
  return "";
}

/** Strip HTML to a short plain-text subtitle when `summary` isn't set. */
export function summaryFor(project: IProject, max = 240): string {
  if (project.summary) return project.summary;
  const plain = (project.description ?? "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (plain.length <= max) return plain;
  return plain.slice(0, max).replace(/\s+\S*$/, "") + "…";
}

export function yearLabel(date: number): string {
  return String(date);
}

/**
 * Every destination a project ships on, deduped by URL.
 * `links` (website + app stores…) wins; `url` is kept as the primary/fallback entry
 * so projects that only ever had one link keep rendering exactly as before.
 */
export function linksFor(project: IProject): ProjectLink[] {
  const out: ProjectLink[] = [];
  const seen = new Set<string>();
  // Tolerant of anything the API can return — a malformed subdocument must not
  // take down a page that renders every project.
  const push = (label?: string | null, url?: string | null) => {
    const href = (url ?? "").trim();
    if (!href) return;
    const key = href.replace(/\/+$/, "").toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    out.push({ label: (label ?? "").trim() || "Visit", url: href });
  };

  const extra = project.links ?? [];
  // The primary url leads; a links entry pointing at the same href won't duplicate it.
  push(extra.length ? "Website" : "Visit", project.url);
  for (const l of extra) push(l?.label, l?.url);

  return out;
}

import type { IProject, IExperience, Discipline } from "@/types";
import { site, type SiteContentType } from "@/components/drawingset/siteContent";

/**
 * Server-side data access for the public site.
 * Content lives in MongoDB and is served by the Express API. We fetch it on the
 * server (not in the browser) so every project/experience description ends up in
 * the initial HTML — which is what makes the page indexable / SEO-friendly.
 */

const API_CANDIDATES = Array.from(
  new Set(
    [
      process.env.NEXT_PUBLIC_API_URL,
      // Public production API as a resilient fallback (read-only GETs) so the
      // page still renders real content during local dev when the local server
      // (localhost:4400) isn't running.
      "https://api.almonteportfolio.com/api",
    ].filter(Boolean) as string[]
  )
);

const REVALIDATE_SECONDS = 3600; // ISR: refresh content at most once an hour

async function fetchFromApi<T>(path: string, pick: (json: any) => T, fallback: T): Promise<T> {
  for (const base of API_CANDIDATES) {
    try {
      const res = await fetch(`${base}${path}`, {
        next: { revalidate: REVALIDATE_SECONDS },
        headers: { Accept: "application/json" },
      });
      if (!res.ok) continue;
      const json = await res.json();
      const value = pick(json);
      if (value !== undefined && value !== null) return value;
    } catch {
      // try the next candidate
    }
  }
  return fallback;
}

export async function getProjects(): Promise<IProject[]> {
  return fetchFromApi<IProject[]>("/projects", (j) => j.projects, []);
}

export async function getExperience(): Promise<IExperience[]> {
  return fetchFromApi<IExperience[]>("/experience", (j) => j.experience, []);
}

/** Split projects into featured "sheets" and the archive list. */
export function splitProjects(projects: IProject[]): { featured: IProject[]; archive: IProject[] } {
  const flagged = projects.filter((p) => p.featured === true);
  let featured: IProject[];

  if (flagged.length) {
    featured = flagged;
  } else {
    // Fallback while the `featured` flag hasn't been set in the admin yet:
    // the top order-tier (min `order`) holds the flagship projects.
    const minOrder = projects.length ? Math.min(...projects.map((p) => p.order ?? 0)) : 0;
    featured = projects.filter((p) => (p.order ?? 0) === minOrder);
    if (featured.length < 3 || featured.length > 8) featured = projects.slice(0, 5);
  }

  const featuredIds = new Set(featured.map((p) => p._id));
  const archive = projects.filter((p) => !featuredIds.has(p._id));
  return { featured, archive };
}

/** Merge a DB SiteContent document over the default copy (deep, field-safe). */
function mergeSite(db: any): SiteContentType {
  if (!db) return site;
  return {
    brand: db.brand ?? site.brand,
    name: db.name ?? site.name,
    role: db.role ?? site.role,
    location: db.location ?? site.location,
    rev: db.rev ?? site.rev,
    hero: {
      eyebrow: db.hero?.eyebrow ?? site.hero.eyebrow,
      headLead: db.hero?.headLead ?? site.hero.headLead,
      headAmber: db.hero?.headAmber ?? site.hero.headAmber,
      spec: db.hero?.spec?.length ? db.hero.spec : site.hero.spec,
      lede: db.hero?.lede ?? site.hero.lede,
    },
    coverDisciplines: (db.coverDisciplines?.length ? db.coverDisciplines : site.coverDisciplines) as Discipline[],
    notes: db.notes?.length ? db.notes : site.notes,
    sectionFloors: db.sectionFloors?.length ? db.sectionFloors : site.sectionFloors,
    contact: {
      github: db.contact?.github ?? site.contact.github,
      githubLabel: db.contact?.githubLabel ?? site.contact.githubLabel,
      linkedin: db.contact?.linkedin ?? site.contact.linkedin,
      linkedinLabel: db.contact?.linkedinLabel ?? site.contact.linkedinLabel,
      email: db.contact?.email ?? site.contact.email,
      studio: db.contact?.studio ?? site.contact.studio,
      studioLabel: db.contact?.studioLabel ?? site.contact.studioLabel,
    },
    sealText: db.sealText ?? site.sealText,
  };
}

export async function getSiteContent(): Promise<SiteContentType> {
  const db = await fetchFromApi<any>("/site-content", (j) => j.siteContent, null);
  return mergeSite(db);
}

export async function getSiteData() {
  const [projects, experience, content] = await Promise.all([getProjects(), getExperience(), getSiteContent()]);
  const { featured, archive } = splitProjects(projects);
  return { projects, featured, archive, experience, content };
}

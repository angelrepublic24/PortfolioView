export type ProjectKind = "personal" | "client" | "employer";
export type ProjectStatus = "live" | "in-dev" | "pre-launch" | "frontier" | "archived";
export type Discipline = "WEB" | "APP" | "API" | "DB" | "PAY" | "OPS" | "3D";

/** One destination for a project — a product can ship on several (website, iOS, Android…). */
export type ProjectLink = {
    label: string;
    url: string;
}

export type IProject = {
    _id: string;
    name: string;
    description: string;
    lang: string[],
    /** Optional: a project still in development may have no domain yet. */
    url?: string,
    image: string | null,
    user: string,
    date: number,
    hidden?: boolean,
    order?: number,
    // --- Drawing Set design metadata (optional; derived from data when absent) ---
    summary?: string;
    kind?: ProjectKind;
    client?: string;
    role?: string;
    status?: ProjectStatus;
    disciplines?: Discipline[];
    featured?: boolean;
    links?: ProjectLink[];
}

export type ProductForm = Omit<IProject, '_id'>

export type LoginForm = {
    email: string,
    password: string
}



export type IExperience = {
    _id: string;
    company: string;
    position: string;
    description: string;
    lang: string[],
    url: string,
    user: string,
    date: [number, string | number],
    scope?: string;
    hidden?: boolean,
    order?: number
}

export type ExperienceForm = Omit<IExperience, '_id'| 'date'> & { date: [number, string | number] | string };

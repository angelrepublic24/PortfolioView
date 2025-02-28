export type IProject = {
    _id: string;
    name: string;
    description: string;
    lang: string[],
    url: string,
    image: string | null,
    user: string,
    date: number
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
    date: [number, string | number]
}

export type ExperienceForm = Omit<IExperience, '_id'| 'date'> & { date: [number, string | number] | string };
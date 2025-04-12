import { getProject, getProjectById } from "@/api/ProjectApi";
import { IProject } from "@/types";
import Image from "next/image";
import React from "react";
import Link from "next/link";

export async function generateStaticParams() {
  const allProjects = await getProject();

  const validIds: string[] = [];

  for (const project of allProjects) {
    const id = project._id.toString();
    const projectData = await getProjectById(id);
    if (projectData) {
      validIds.push(id);
    }
  }

  return validIds.map((id) => ({ id }));
}

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await  params;
  console.log("ID RECIBIDO:", id); 
  const project: IProject | null = await getProjectById(id);

  if (!project) {
    return <div>Project not found</div>;
  }
  return (
    <div className="p-10 grid grid-cols-1 md:grid-cols-2">
      <div className="flex items-center justify-center mb-3">
        <Image
          src={project.image!}
          alt={project.name}
          width={500}
          height={500}
        />
      </div>
      <div>
        <Link href={project.url}>
          <h3 className="text-2xl text-purple-500 font-signika mb-3">
            {project.name}
          </h3>
        </Link>
        <p className="whitespace-pre-line font-poppins text-md mb-3">
          {project.description}
        </p>

        <div className="py-4">
        <h3 className="text-lg font-bold text-purple-500 mb-1">Website</h3>
        <Link
          href={project.url}
          target="_blank"
          className="inline-block text-blue-400 hover:text-blue-300 underline underline-offset-2 transition"
        >
          🌐 {project.url}
        </Link>
      </div>

        <div className="space-y-4">
          <h6 className="text-purple-500 font-bold text-xl font-poppins">Tecnologies </h6>

          <ul className="flex -translate-y-1.5 flex-wrap">
            {project.lang?.map((langs, index) => {
              return (
                <li className="my-1 mr-1.5" key={index}>
                  <div className="flex items-center rounded-full bg-slate-500/20 px-3 py-1 text-xs font-medium leading-5 text-purple-300 font-poppins">
                    {langs}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}

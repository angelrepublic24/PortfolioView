import api from "@/global/Global";
import { IProject } from "@/types";
import Image from "next/image";
import Link from "next/link";

interface JobProps {
  projects: IProject[];
  limit: number;
}

export const JobList = ({ projects, limit }: JobProps) => {
  if (!Array.isArray(projects) || projects.length === 0) {
    return <p className="text-white">No projects available</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {projects.map((project, idx) => (
        <div
          key={idx}
          className="bg-zinc-900 rounded-xl overflow-hidden shadow-lg border border-zinc-800 h-[465px] "
        >
          <div className="relative w-full h-[70%] overflow-hidden">
            <Image
              src={project.image!}
              alt={project.name}
              width={500}
              height={300}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="p-6 flex justify-between">
            <div className="md:w-3/4">
              <Link href={`/project/${project._id}`}>
              <h3 className="text-lg font-semibold mb-2 hover:text-purple-500">{project.name}</h3>
              </Link>
              <p className="text-sm text-gray-300 mb-4 line-clamp-2">
                {project.description}
              </p>
            </div>
            <div className="link md:flex justify-end items-center hidden">
              <Link
                href={project.url}
                className="text-purple-500  transition inline-flex items-center border rounded-full border-purple-500 hover:bg-purple-500/30 p-2"
              >
                <span className="sr-only">View project</span>
                <Image src={'/icon_8_.png'} width={100} height={100} alt={project.name} className="w-4 h-4"/>
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
  // return (
  //     <div>
  //       <ul className="group/list">
  //         {projects.slice(0, limit).map((project) => (
  //           <li className="mb-12" key={project._id}>
  //             <div className="group relative grid gap-4 pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50">
  //               <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition lg:block lg:group-hover:bg-slate-800/50 lg:group-hover:shadow-lg"></div>
  //               <div className="z-10 order-2 sm:order-2 sm:col-span-5">
  //                 <h3>
  //                   <Link
  //                     className="inline-flex items-baseline font-medium leading-tight text-slate-200 hover:text-teal-300"
  //                     href={project.url}
  //                     target="_blank"
  //                     rel="noopener noreferrer"
  //                   >
  //                     {project.name}
  //                     <span className="inline-block">
  //                     <svg
  //                       xmlns="http://www.w3.org/2000/svg"
  //                       viewBox="0 0 20 20"
  //                       fill="currentColor"
  //                       className="inline-block h-4 w-4 shrink-0 transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1 group-focus-visible/link:-translate-y-1 group-focus-visible/link:translate-x-1 motion-reduce:transition-none ml-1 translate-y-px"
  //                       aria-hidden="true"
  //                     >
  //                       <path
  //                         fillRule="evenodd"
  //                         d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
  //                         clipRule="evenodd"
  //                       ></path>
  //                     </svg>
  //                   </span>
  //                   </Link>
  //                 </h3>
  //                 <p className="mt-2 text-sm">{project.description}</p>

  //                 {/* {token && (
  //                   <div>
  //                     <button
  //                       className="edit"
  //                       onClick={() => deleteProject.mutate(project._id)}
  //                       disabled={deleteProject.isLoading}
  //                     >
  //                       {deleteProject.isLoading ? "Deleting..." : "Delete"}
  //                     </button>
  //                     <button className="edit">Update</button>
  //                   </div>
  //                 )} */}
  //               </div>
  //               <Image
  //                 className="img-work rounded border-2 border-slate-200/10 transition group-hover:border-slate-200/30 order-1 sm:order-1 sm:col-span-3 w-full h-[180px] "
  //                 src={`${project.image}`}
  //                 alt={project.name}
  //                 width={100}
  //                 height={100}
  //                 quality={100}
  //               />
  //             </div>
  //           </li>
  //         ))}
  //       </ul>
  //     </div>
  //   );
};

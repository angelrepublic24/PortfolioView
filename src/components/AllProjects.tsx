import { IProject } from "@/types";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteImage, deleteProject } from "@/api/ProjectApi";
import { toast } from "sonner";

interface Props {
  projects: IProject[];
}

export const AllProjects = ({ projects }: Props) => {
  const queryClient = useQueryClient();
  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: async (data) => {
      toast.success("Project deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
  const deleteImageMutation = useMutation({
    mutationFn: deleteImage,
    onSuccess: (data) => {
      toast.success("Image deleted.");
    },
  });

  const extractPublicId = (imageUrl: string | undefined) => {
    if (!imageUrl) return null;

    const parts = imageUrl.split("/");
    const filename = parts.pop();
    const folder = parts.pop();

    if (filename && folder) {
      const publicId = `${folder}/${filename.split(".")[0]}`; // Concatenar carpeta + nombre sin extensión
      return publicId;
    }

    return null;
  };

  const deletingImage = async (publicIdToDelete: string | undefined) => {
    if (!publicIdToDelete) {
      console.warn(
        "⚠ No hay publicId disponible, no se puede eliminar la imagen."
      );
      return;
    }
    await deleteImageMutation.mutate(publicIdToDelete);
  };

  const handleDelete = (id: string, imageUrl: string | undefined | null) => {
    if (!id) return;

    deleteMutation.mutate(id, {
      onSuccess: () => {
        if (imageUrl) {
          const publicId = extractPublicId(imageUrl);
          if (publicId) {
            deletingImage(publicId);
          }
        }
      },
    });
  };

  return (
    <div id="__next">
      <div className="__variable_20b187 group/spotlight relative">
        <div className="point pointer-events-none fixed inset-0 z-30 transition duration-300 lg:absolute"></div>
        <div className="mx-auto min-h-screen w-full px-6 py-12 font-sans md:px-0 md:py-20 lg:py-0">
          <div className="lg:py-24">
            <div className="flex justify-between items-center">
            <h1 className="text-4xl font-bold tracking-tight text-slate-200 sm:text-5xl">
              All Projects
            </h1>
            <Link href={'/admin/create/project'}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-8"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </Link>
            </div>
            
            <table
              id="content"
              className="mt-12 w-full border-collapse text-left"
            >
              <thead className="sticky top-0 z-10 border-b border-slate-300/10 bg-slate-900/75 px-6 py-5 backdrop-blur">
                <tr>
                  <th className="py-4 pr-8 text-sm font-semibold text-slate-200">
                    Project
                  </th>
                  <th className="hidden py-4 pr-8 text-sm font-semibold text-slate-200 lg:table-cell">
                    Built with
                  </th>
                  <th className="hidden py-4 pr-8 text-sm font-semibold text-slate-200 lg:table-cell">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {projects?.map((project) => {
                  return (
                    <tr
                      key={project._id}
                      className="border-b border-slate-300/10 last:border-none"
                    >
                      <td className="py-4 pr-4 align-top font-semibold leading-snug text-slate-200">
                        <div>
                          <div className="block sm:hidden">
                            <Link
                              className="inline-flex items-baseline font-medium leading-tight text-slate-200 hover:text-teal-300 focus-visible:text-teal-300 hover:text-slate-200 focus-visible:text-teal-300 sm:hidden group/link text-base"
                              href={project.url}
                              target="_blank"
                              rel="noreferrer noopener"
                              aria-label="Emerson Collective (opens in a new tab)"
                            >
                              <span>
                                <span className="inline-block">
                                  {project.name}
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="inline-block h-4 w-4 shrink-0 transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1 group-focus-visible/link:-translate-y-1 group-focus-visible/link:translate-x-1 motion-reduce:transition-none ml-1 translate-y-px"
                                    aria-hidden="true"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                                      clipRule="evenodd"
                                    ></path>
                                  </svg>
                                </span>
                              </span>
                            </Link>
                          </div>
                          <div className="hidden sm:block">{project.name}</div>
                        </div>
                      </td>
                      <td className="hidden py-4 pr-4 align-top lg:table-cell">
                        <ul className="flex -translate-y-1.5 flex-wrap">
                          {project.lang?.map((langs, index) => {
                            return (
                              <li className="my-1 mr-1.5" key={index}>
                                <div className="flex items-center rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium leading-5 text-teal-300 ">
                                  {langs}
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </td>
                      <td className=" py-4  align-top table-cell">
                        <div className="flex justify-between space-x-3">
                          <button className="bg-teal-400/10 rounded-full px-3 py-1 text-xs font-medium leading-5 text-teal-300">
                            Update
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(project._id, project.image)
                            }
                            className="bg-red-400/10 rounded-full px-3 py-1 text-white"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

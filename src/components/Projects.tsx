import Link from "next/link";
import { IProject } from "@/types";
import { JobList } from './JobList';

interface ProjectProps {
  projects: IProject[];
}

export default function Project({projects}: ProjectProps) {

  return (
    <section id="projects" className="bg-black text-white px-6 py-20 font-poppins">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <p className="text-purple-500 text-sm font-semibold tracking-wider uppercase">
              Portfolio
            </p>
            <h2 className="text-4xl font-extrabold font-signika mt-2">MY PROJECTS</h2>
          </div>

          {/* <Link
            href="/projects"
            className="bg-purple-600 hover:bg-purple-700 transition text-white text-sm font-semibold px-6 py-3 rounded-full inline-flex items-center"
          >
            VIEW ALL PROJECTS
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-4 h-4 ml-2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.25 6.75L21 12m0 0l-3.75 5.25M21 12H3"
              />
            </svg>
          </Link> */}
        </div>

        <JobList
          projects={projects}
          limit={6}
            />
      </div>
    </section>
  );
}

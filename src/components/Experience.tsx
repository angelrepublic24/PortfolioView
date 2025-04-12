import React from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

import { IExperience } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { getExperience } from "@/api/ExperienceApi";

interface Props {
  experiences: IExperience[]
}
export default function Experiences() {
  const {data: experiences = [], isLoading, isError} = useQuery<IExperience[]>({
    queryFn: getExperience,
    queryKey: ['experiences'],
    retry: 1,
    refetchOnWindowFocus: false
})

if(isLoading) return 'Loading....'
if(isError) return 'Error loading'
  const openResume = () => {
    window.open('/Resume.pdf', "_blank")
  }

  if(!experiences) return


  return (
    <section id="experience" className="relative px-6 py-20 bg-black/80 flex justify-center font-poppins">
      {/* <div className=" inset-0 rounded-xl z-0 " /> */}

      <div className="relative z-10 flex flex-col items-center justify-center text-center text-white font-poppins rounded-b-2xl py-20 bg-[url('/wavy.png')] bg-no-repeat bg-cover h-full w-[95%] px-4">
        <p className="text-purple-500 text-sm font-semibold tracking-wider uppercase font-poppins">
          Working Skills
        </p>
        <h2 className="text-[40px] font-bold font-signika mt-2">
          MY EXPERIENCE
        </h2>

        <Link
          href="/Resume.pdf"
          target="_blank"
          className="mt-6 font-signika inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full transition text-base"
        >
          VIEW FULL RESUME
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 ml-2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L21 12m0 0l-3.75 5.25M21 12H3" />
          </svg>
        </Link>
      </div>
    </section>
  );
// return (
//     <>
//       <section
//         id="experience"
//         className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
//         aria-label="Work experience"
//       >
//         <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-slate-900/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
//           <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200 lg:sr-only">
//             Experience
//           </h2>
//         </div>
//         <div>
//           <ol className="group/list">

//         {experiences.map((experience) =>(
//           <li className="mb-12" key={experience._id}>
//           <div className="group relative grid pb-1 transition-all sm:grid-cols-8 sm:gap-8 md:gap-4 lg:hover:!opacity-100 lg:group-hover/list:opacity-50">
//             <div className="absolute -inset-x-4 -inset-y-4 z-0 hidden rounded-md transition motion-reduce:transition-none lg:-inset-x-6 lg:block lg:group-hover:bg-slate-800/50 lg:group-hover:shadow-[inset_0_1px_0_0_rgba(148,163,184,0.1)] lg:group-hover:drop-shadow-lg"></div>
//             <header
//               className="z-10 mb-2 mt-1 text-xs font-semibold uppercase tracking-wide text-slate-500 sm:col-span-2"
//               aria-label="2018 to 2024"
//             >
//               {experience.date[0]} - {experience.date[1]}
//             </header>
//             <div className="z-10 sm:col-span-6">
//               <h3 className="font-medium leading-snug text-slate-200">
//                 <div>
//                   <a
//                     className="inline-flex items-baseline font-medium leading-tight text-slate-200 hover:text-teal-300 focus-visible:text-teal-300  group/link text-base"
//                     href={experience.url}
//                     target="_blank"
//                     rel="noreferrer noopener"
//                     aria-label="Lead Engineer at Upstatement (opens in a new tab)"
//                   >
//                     <span className="absolute -inset-x-4 -inset-y-2.5 hidden rounded md:-inset-x-6 md:-inset-y-4 lg:block"></span>
//                     <span>
//                       {experience.position}
//                       <span className="inline-block">
//                         <svg
//                           xmlns="http://www.w3.org/2000/svg"
//                           viewBox="0 0 20 20"
//                           fill="currentColor"
//                           className="inline-block h-4 w-4 shrink-0 transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1 group-focus-visible/link:-translate-y-1 group-focus-visible/link:translate-x-1 motion-reduce:transition-none ml-1 translate-y-px"
//                           aria-hidden="true"
//                         >
//                           <path
//                             fillRule="evenodd"
//                             d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
//                             clipRule="evenodd"
//                           ></path>
//                         </svg>
//                       </span>
//                     </span>
//                   </a>
//                 </div>
//                 <div>
//                   <div className="text-slate-500" aria-hidden="true">
//                     {experience.company}
//                   </div>
//                 </div>
//                 <div>
//                   {/* <div className="text-slate-500" aria-hidden="true">
//                     Engineer
//                   </div> */}
//                 </div>
//               </h3>
//               <p className="mt-2 text-sm leading-normal">
//               <ReactMarkdown>{experience.description}</ReactMarkdown>
//               </p>
//               <ul
//                 className="mt-2 flex flex-wrap"
//                 aria-label="Technologies used"
//               >
//                 {experience.lang.map((skill, index )=> (
//                   <li className="mr-1.5 mt-2" key={index}>
//                   <div className="flex items-center rounded-full bg-teal-400/10 px-3 py-1 text-xs font-medium leading-5 text-teal-300 ">
//                     {skill}
//                   </div>
//                 </li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         </li>
//         ))}
//           </ol>
//           <div className="mt-12">
//             <Link
//               className="inline-flex items-baseline font-medium leading-tight text-slate-200 hover:text-teal-300 focus-visible:text-teal-300 font-semibold text-slate-200 group/link text-base"
//               href="/Resume.pdf"
              
//               target="_blank"
//               rel="noreferrer noopener"
//               aria-label="View Full Résumé (opens in a new tab)"
//             >
//               <span>
//                 View Full &nbsp;
//                 <span className="inline-block">
//                   Resume
//                   <svg
//                     xmlns="http://www.w3.org/2000/svg"
//                     viewBox="0 0 20 20"
//                     fill="currentColor"
//                     className="inline-block h-4 w-4 shrink-0 transition-transform group-hover/link:-translate-y-1 group-hover/link:translate-x-1 group-focus-visible/link:-translate-y-1 group-focus-visible/link:translate-x-1 motion-reduce:transition-none ml-1 translate-y-px"
//                     aria-hidden="true"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
//                       clipRule="evenodd"
//                     ></path>
//                   </svg>
//                 </span>
//               </span>
//             </Link>
//           </div>
//         </div>
//       </section>
//     </>
//   );
}

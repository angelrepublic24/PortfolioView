export default function About() {
    return (
      <>
        <section
          id="about"
          className="mb-16 scroll-mt-16 md:mb-24 lg:mb-36 lg:scroll-mt-24"
          aria-label="About me"
        >
          <div className="sticky top-0 z-20 -mx-6 mb-4 w-screen bg-slate-900/75 px-6 py-5 backdrop-blur md:-mx-12 md:px-12 lg:sr-only lg:relative lg:top-auto lg:mx-auto lg:w-full lg:px-0 lg:py-0 lg:opacity-0">
            <h2 className="text-sm font-bold uppercase tracking-widest text-slate-200 lg:sr-only">
              About
            </h2>
          </div>
          <div>
            <p className="mb-4">
            Back in 2018, I started my journey in web development, diving deep into coding and problem-solving. 
            Over the years, I’ve had the opportunity to contribute to projects like&ensp;
              <a
                className="font-medium text-slate-200 hover:text-teal-300 focus-visible:text-teal-300"
                href="https://xaplu.com/"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="advertising agency (opens in a new tab)"
              >
                Xaplu
              </a>, an online invoicing and inventory system, and <a
                className="font-medium text-slate-200 hover:text-teal-300 focus-visible:text-teal-300"
                href="https://diamanterd.com/"
                target="_blank"
                rel="noreferrer noopener"
                aria-label="advertising agency (opens in a new tab)"
              >
                Diamanterd
              </a> where I helped enhance its digital platform. Today, as the Founder & Full-Stack Web Developer at DRTS, I focus on building scalable, high-performance applications that seamlessly integrate design and engineering for an optimal user experience
            </p>
            <p className="mb-4">
            I'm committed to continuous learning, constantly expanding my skill set through 
            Udemy courses and hands-on projects. My expertise includes NestJS, Express, Next.js, 
            React, MongoDB, and Tailwind CSS, with a strong emphasis on API development, authentication, 
            and system architecture.
            </p>
            <p>
            When I’m not coding, I’m usually at the gym, reading, staying updated on the latest tech trends, or playing basketball. I thrive on innovation and enjoy creating software that is both efficient and visually engaging.
            </p>
          </div>
        </section>
      </>
    );
  }
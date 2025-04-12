import React from 'react'

export  const HeroSection = () => {
    return (
        <section className="relative flex items-center justify-center min-h-screen bg-black text-white px-6">
          <div className="absolute inset- z-10"></div>
          <img
            src="/Hero.png"
            alt="Hero Background"
            className="absolute inset-0 w-full h-screen object-cover z-0"
          />
    
          <div className="relative z-20 text-center max-w-3xl">
            <p className="text-lg tracking-widest text-purple-500 font-bold mb-4 font-poppins">
              Full-Stack Web Developer
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-[63px] font-base mt-2 font-signika">
              ANGEL <span className="text-purple-500">ALMONTE</span>
            </h1>
            <p className="mt-4 text-sm sm:text-base  text-gray-200 px-8 font-poppins">
              I develop efficient, scalable server-side applications and craft accessible, user-friendly interfaces, ensuring seamless performance, reliability, and a great user experience.
            </p>
            <div className="mt-8">
              <a
                href="#about"
                className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-full transition"
              >
                MORE ABOUT ME
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
              </a>
            </div>
          </div>
        </section>
      );
}

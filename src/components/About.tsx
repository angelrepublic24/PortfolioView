import Image from "next/image";

export default function About() {
  return (
    <section id="about" className=" bg-black text-white px-6 pt-20 pb-12 font-poppins">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Left Column */}
        <div>
          <p className="text-purple-500 text-sm font-semibold  uppercase tracking-widest">
            What I Do
          </p>
          <h2 className="text-4xl font-extrabold font-signika mt-2">ABOUT <span className="text-white">ME</span></h2>
          <p className="mt-6 text-gray-300 text-[15px] max-w-[550px]">
            Back in 2018, I started my journey in web development, diving deep into coding and problem-solving. Over the years, I’ve had the opportunity to contribute to projects like Xaplu, an online invoicing and inventory system, and Diamantdier where I helped enhance its digital platform. Today, as the Founder & Full-Stack Web Developer at DRTS, I focus on building scalable, high-performance applications that seamlessly integrate design and engineering for an optimal user experience.
          </p>
          <p className="mt-4 text-gray-300 text-[15px] max-w-[550px]">
            I’m committed to continuous learning, constantly expanding my skill set through Udemy courses and hands-on projects. My expertise includes <span className="font-semibold text-white">NestJS, Express, Next.js, React, MongoDB, and Tailwind CSS</span>, with a strong emphasis on API development, authentication, and system architecture.
          </p>
        </div>

        {/* Right Column */}
        <div className="flex flex-col justify-center items-center px-4 h-full">
        <div className="relative text-[#9735ED] text-xl md:text-2xl font-semibold ">
                <Image
                src="/Vector1.png"
                alt="quote"
                width={58}
                height={43}
                className="absolute -top-2 left-1 w-14 z-0"
              />

              {/* Texto */}
              <p className="relative z-10 text-purple-500 ml-[72px]">
                When I’m not coding, I’m usually at the gym, reading, staying updated
                on the latest tech trends, or playing basketball. I thrive on
                innovation and enjoy creating software that is both efficient and
                visually engaging
              </p>

              {/* Comilla Derecha */}
              <Image
                src="/Vector.png"
                alt="quote"
                width={58}
                height={43}
                className="absolute -bottom-5 right-1 w-14 z-0"
              />
          </div>
        </div>
      </div>
    </section>
  );
  }
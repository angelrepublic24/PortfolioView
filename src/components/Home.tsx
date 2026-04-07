import Link from "next/link";
import { Github, Linkedin, Mail, ArrowRight, FileText } from "lucide-react";

export const HeroSection = () => {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden pt-24"
    >
      {/* Background grid + radial glow */}
      <div className="absolute inset-0 bg-grid-pattern bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)] pointer-events-none" />
      <div className="absolute inset-0 bg-radial-violet pointer-events-none animate-glow-pulse" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-8 w-full">
        <div className="max-w-3xl animate-slide-up">
          <p className="font-mono text-sm text-brand-400 mb-6">
            Hi, my name is
          </p>
          <h1 className="font-signika text-5xl md:text-7xl font-bold tracking-tight text-zinc-100 leading-[1.05]">
            Angel Almonte.
          </h1>
          <h2 className="mt-3 font-signika text-4xl md:text-6xl font-bold tracking-tight text-zinc-500 leading-[1.05]">
            I build things for the web.
          </h2>
          <p className="mt-8 max-w-xl text-base md:text-lg text-zinc-400 leading-relaxed">
            I&apos;m a full-stack web developer specializing in building
            scalable, high-performance applications with modern stacks like{" "}
            <span className="text-zinc-200">Next.js</span>,{" "}
            <span className="text-zinc-200">NestJS</span> and{" "}
            <span className="text-zinc-200">MongoDB</span>. Currently focused on
            crafting accessible, delightful digital experiences.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="#work"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium transition-all shadow-[0_0_30px_-5px_rgba(139,92,246,0.5)] hover:shadow-[0_0_50px_-5px_rgba(139,92,246,0.7)]"
            >
              View my work
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="/Resume.pdf"
              target="_blank"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-brand-500/40 text-brand-300 text-sm font-medium hover:bg-brand-500/10 hover:border-brand-400 transition-all"
            >
              <FileText size={16} />
              Download CV
            </Link>
          </div>

          <div className="mt-12 flex items-center gap-5">
            <a
              href="https://github.com/angelrepublic24"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-brand-400 transition-colors"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a
              href="https://www.linkedin.com/in/angel-almonte/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-brand-400 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="mailto:angelalmonte.dev@gmail.com"
              className="text-zinc-500 hover:text-brand-400 transition-colors"
              aria-label="Email"
            >
              <Mail size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-zinc-600">
        <span className="text-xs uppercase tracking-widest">Scroll</span>
        <div className="w-px h-12 bg-gradient-to-b from-brand-500/60 to-transparent" />
      </div>
    </section>
  );
};

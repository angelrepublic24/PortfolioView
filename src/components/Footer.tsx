import Link from "next/link";
import Logo from "./ui/Logo";
import { Github, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-900 mt-16">
      <div className="max-w-6xl mx-auto px-6 md:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-2">
            <Logo size={32} />
            <p className="text-xs text-zinc-500 font-mono">
              Designed &amp; built by Angel Almonte
            </p>
          </div>

          <div className="flex items-center gap-5">
            <Link
              href="https://github.com/angelrepublic24"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-brand-400 transition-colors"
              aria-label="GitHub"
            >
              <Github size={18} />
            </Link>
            <Link
              href="https://www.linkedin.com/in/angel-almonte/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-500 hover:text-brand-400 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin size={18} />
            </Link>
            <Link
              href="mailto:angelalmonte.dev@gmail.com"
              className="text-zinc-500 hover:text-brand-400 transition-colors"
              aria-label="Email"
            >
              <Mail size={18} />
            </Link>
          </div>

          <p className="text-xs text-zinc-600 font-mono">
            © {new Date().getFullYear()} · All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}

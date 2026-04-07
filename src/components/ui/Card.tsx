import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export default function Card({ children, className = "", hover = false }: CardProps) {
  return (
    <div
      className={`relative bg-zinc-900/40 border border-zinc-800 rounded-xl backdrop-blur-sm ${
        hover
          ? "transition-all duration-300 hover:border-brand-500/40 hover:bg-zinc-900/60 hover:shadow-[0_0_40px_-12px_rgba(139,92,246,0.35)] hover:-translate-y-1"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}

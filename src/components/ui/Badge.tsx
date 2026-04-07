import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?: "brand" | "neutral" | "success" | "warning";
  className?: string;
}

const variants = {
  brand: "bg-brand-500/10 text-brand-300 border-brand-500/30",
  neutral: "bg-zinc-800/60 text-zinc-300 border-zinc-700",
  success: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
  warning: "bg-amber-500/10 text-amber-300 border-amber-500/30",
};

export default function Badge({ children, variant = "brand", className = "" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

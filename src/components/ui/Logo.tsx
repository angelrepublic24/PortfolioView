import Link from "next/link";

interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  href?: string | null;
}

/**
 * Angel Almonte monogram logo. Two stylized "A" forms locked together.
 * Uses currentColor so it can be themed via Tailwind text-* classes.
 */
export default function Logo({
  size = 36,
  className = "",
  showText = true,
  href = "/",
}: LogoProps) {
  const mark = (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="aaGrad" x1="0" y1="0" x2="48" y2="48">
          <stop offset="0%" stopColor="#a78bfa" />
          <stop offset="100%" stopColor="#7c3aed" />
        </linearGradient>
      </defs>
      <rect
        x="2"
        y="2"
        width="44"
        height="44"
        rx="11"
        stroke="url(#aaGrad)"
        strokeWidth="2"
        fill="rgba(139,92,246,0.08)"
      />
      {/* First A */}
      <path
        d="M11 34 L18 14 L25 34"
        stroke="url(#aaGrad)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M13.5 27 L22.5 27"
        stroke="url(#aaGrad)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      {/* Second A — overlapping */}
      <path
        d="M23 34 L30 14 L37 34"
        stroke="url(#aaGrad)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M25.5 27 L34.5 27"
        stroke="url(#aaGrad)"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );

  const content = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {mark}
      {showText && (
        <span className="font-signika text-base font-semibold tracking-tight text-zinc-100">
          angel<span className="text-brand-400">.</span>
        </span>
      )}
    </span>
  );

  if (href === null) return content;
  return (
    <Link href={href} className="inline-flex items-center group">
      {content}
    </Link>
  );
}

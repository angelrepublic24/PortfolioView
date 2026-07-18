import Link from "next/link";

interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  href?: string | null;
}

/**
 * Angel Almonte monogram — Drawing-Set style: an "AA" in amber line-work inside a
 * drafting frame (matches the favicon), with a monospace "A·ALMONTE" wordmark.
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
      <rect x="2" y="2" width="44" height="44" rx="11" stroke="#F2A63C" strokeWidth="2" fill="rgba(242,166,60,0.06)" />
      {/* First A */}
      <path d="M11 34 L18 14 L25 34" stroke="#F2A63C" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M13.5 27 L22.5 27" stroke="#F2A63C" strokeWidth="2.4" strokeLinecap="round" />
      {/* Second A */}
      <path d="M23 34 L30 14 L37 34" stroke="#F2A63C" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M25.5 27 L34.5 27" stroke="#F2A63C" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );

  const content = (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {mark}
      {showText && (
        <span className="font-mono text-sm font-semibold uppercase tracking-[0.12em] text-zinc-100">
          A<span className="text-brand-400">·</span>Almonte
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

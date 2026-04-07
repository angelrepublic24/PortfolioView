interface SectionHeadingProps {
  number?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "left" | "center";
}

export default function SectionHeading({
  number,
  eyebrow,
  title,
  subtitle,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div
      className={`mb-12 md:mb-16 ${
        align === "center" ? "text-center mx-auto max-w-2xl" : ""
      }`}
    >
      {(number || eyebrow) && (
        <div
          className={`flex items-center gap-3 mb-3 ${
            align === "center" ? "justify-center" : ""
          }`}
        >
          {number && (
            <span className="font-mono text-sm text-brand-400">{number}.</span>
          )}
          {eyebrow && (
            <span className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              {eyebrow}
            </span>
          )}
          <span className="hidden sm:block h-px w-12 bg-gradient-to-r from-brand-500/60 to-transparent" />
        </div>
      )}
      <h2 className="font-signika text-3xl md:text-4xl font-bold tracking-tight text-zinc-100">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-3 text-zinc-400 text-base max-w-2xl">{subtitle}</p>
      )}
    </div>
  );
}

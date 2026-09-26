type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className = "",
}: SectionHeadingProps) {
  const alignment = align === "center" ? "mx-auto text-center" : "";

  return (
    <div className={`max-w-2xl ${alignment} ${className}`}>
      {eyebrow ? (
        <p className="text-xs font-semibold tracking-[0.2em] text-[#b31322] uppercase">{eyebrow}</p>
      ) : null}

      <h2 className="mt-3 text-2xl leading-tight font-semibold tracking-tight text-neutral-950 sm:text-3xl">
        {title}
      </h2>

      {description ? (
        <p className="mt-4 text-sm leading-6 text-neutral-600 sm:text-base">{description}</p>
      ) : null}
    </div>
  );
}

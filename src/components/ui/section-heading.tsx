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
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}

      <h2 className="heading-section mt-5 leading-[1.05] tracking-[-0.02em]">{title}</h2>

      {description ? <p className="text-lead mt-6">{description}</p> : null}
    </div>
  );
}

import Image from "next/image";

type BrandLogoProps = {
  src?: string;
  name: string;
  className?: string;
  imageClassName?: string;
  sizes?: string;
};

export function BrandLogo({
  src,
  name,
  className = "",
  imageClassName = "",
  sizes = "96px",
}: BrandLogoProps) {
  if (!src) {
    return null;
  }

  return (
    <span
      className={`relative block overflow-hidden bg-white ${className}`}
      aria-label={`Logo de ${name}`}
    >
      <Image src={src} alt="" fill sizes={sizes} className={`object-contain ${imageClassName}`} />
    </span>
  );
}

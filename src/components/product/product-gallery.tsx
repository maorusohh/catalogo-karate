"use client";

import Image from "next/image";
import { useState } from "react";

import type { ProductImage } from "@/types/catalog";

type ProductGalleryProps = {
  images: ProductImage[];
  productName: string;
};

export function ProductGallery({ images, productName }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectedImage = images[selectedIndex];

  if (images.length === 0) {
    return (
      <div className="overflow-hidden rounded-[2rem] border border-black/10 bg-neutral-100">
        <div className="flex aspect-square items-center justify-center p-8 text-center">
          <div>
            <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-neutral-950 text-sm font-black tracking-tight text-white">
              KD
            </span>

            <p className="mt-4 text-xs font-semibold tracking-[0.18em] text-neutral-400 uppercase">
              Imagen pendiente
            </p>

            <p className="mx-auto mt-2 max-w-xs text-sm leading-6 text-neutral-500">
              La fotografía del producto se incorporará antes de publicar la ficha comercial.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-[2rem] bg-neutral-100">
        <Image
          src={selectedImage.src}
          alt={selectedImage.alt || productName}
          fill
          priority
          sizes="(max-width: 1023px) 100vw, 55vw"
          className="object-contain p-6 sm:p-10"
        />
      </div>

      {images.length > 1 ? (
        <div className="mt-4 grid grid-cols-5 gap-3">
          {images.map((image, index) => {
            const isSelected = index === selectedIndex;

            return (
              <button
                key={`${image.src}-${index}`}
                type="button"
                onClick={() => setSelectedIndex(index)}
                aria-label={`Ver imagen ${index + 1}`}
                aria-pressed={isSelected}
                className={`relative aspect-square overflow-hidden rounded-xl border bg-white ${
                  isSelected ? "border-neutral-950" : "border-black/10"
                }`}
              >
                <Image src={image.src} alt="" fill sizes="120px" className="object-contain p-2" />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

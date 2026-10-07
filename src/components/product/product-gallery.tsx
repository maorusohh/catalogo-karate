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

  function showPreviousImage() {
    setSelectedIndex((current) => (current === 0 ? images.length - 1 : current - 1));
  }

  function showNextImage() {
    setSelectedIndex((current) => (current === images.length - 1 ? 0 : current + 1));
  }

  if (images.length === 0) {
    return (
      <div className="overflow-hidden rounded-[2rem] border border-black/10 bg-[#ebe7de]">
        <div className="flex aspect-square items-center justify-center p-8 text-center sm:p-12">
          <div className="max-w-sm">
            <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-neutral-950 text-sm font-black tracking-tight text-white">
              KD
            </span>

            <p className="mt-5 text-xs font-semibold tracking-[0.18em] text-neutral-400 uppercase">
              Fotografía próximamente
            </p>

            <p className="mt-3 text-sm leading-6 text-neutral-600">
              La ficha comercial está preparada para incorporar las fotografías reales de este
              producto.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-[2rem] border border-black/10 bg-white shadow-[0_16px_40px_rgba(0,0,0,0.05)]">
        <Image
          src={selectedImage.src}
          alt={selectedImage.alt || productName}
          fill
          priority
          sizes="(max-width: 1023px) 100vw, 55vw"
          className="object-contain p-7 sm:p-10 lg:p-12"
        />

        {images.length > 1 ? (
          <>
            <button
              type="button"
              onClick={showPreviousImage}
              aria-label="Ver imagen anterior"
              className="absolute top-1/2 left-4 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white/90 text-xl text-neutral-950 shadow-lg backdrop-blur transition-transform hover:scale-105"
            >
              ←
            </button>

            <button
              type="button"
              onClick={showNextImage}
              aria-label="Ver imagen siguiente"
              className="absolute top-1/2 right-4 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white/90 text-xl text-neutral-950 shadow-lg backdrop-blur transition-transform hover:scale-105"
            >
              →
            </button>

            <div className="absolute right-4 bottom-4 rounded-full bg-neutral-950/90 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur">
              {selectedIndex + 1} / {images.length}
            </div>
          </>
        ) : null}
      </div>

      {images.length > 1 ? (
        <div
          className="mt-4 grid grid-cols-4 gap-3 sm:grid-cols-5"
          aria-label="Galería de imágenes"
        >
          {images.map((image, index) => {
            const isSelected = index === selectedIndex;

            return (
              <button
                key={`${image.src}-${index}`}
                type="button"
                onClick={() => setSelectedIndex(index)}
                aria-label={`Ver imagen ${index + 1} de ${images.length}`}
                aria-pressed={isSelected}
                className={`relative aspect-square overflow-hidden rounded-2xl border bg-white transition-[border-color,transform,box-shadow] ${
                  isSelected
                    ? "border-neutral-950 shadow-[0_8px_20px_rgba(0,0,0,0.08)]"
                    : "border-black/10 hover:-translate-y-0.5 hover:border-black/30"
                }`}
              >
                <Image
                  src={image.src}
                  alt=""
                  fill
                  sizes="(max-width: 639px) 25vw, 120px"
                  className="object-contain p-2.5"
                />
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

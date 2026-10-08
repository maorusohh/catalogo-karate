"use client";

import { useMemo, useState } from "react";

import type { ProductVariant } from "@/types/catalog";

type VariantSelectorProps = {
  variants: ProductVariant[];
  onVariantChange?: (variant: ProductVariant | undefined) => void;
};

type SelectedOptions = Record<string, string>;
type ColorKind = "BLUE" | "RED" | "YELLOW" | "ORANGE" | "GREEN" | "BROWN" | "OTHER";

function getOptionGroups(variants: ProductVariant[]): Record<string, string[]> {
  const groups: Record<string, string[]> = {};

  for (const variant of variants) {
    for (const option of variant.options) {
      if (!groups[option.name]) {
        groups[option.name] = [];
      }

      if (!groups[option.name].includes(option.value)) {
        groups[option.name].push(option.value);
      }
    }
  }

  return groups;
}

function variantMatchesSelection(variant: ProductVariant, selection: SelectedOptions): boolean {
  return Object.entries(selection).every(([name, value]) =>
    variant.options.some((option) => option.name === name && option.value === value),
  );
}

function findSelectedVariant(
  variants: ProductVariant[],
  selection: SelectedOptions,
  groupNames: string[],
): ProductVariant | undefined {
  const allOptionsSelected = groupNames.every((groupName) => Boolean(selection[groupName]));

  if (!allOptionsSelected) {
    return undefined;
  }

  return variants.find(
    (variant) => variant.available && variantMatchesSelection(variant, selection),
  );
}

function normalizeValue(value: string): string {
  return value.trim().toLowerCase();
}

function isColorGroup(groupName: string): boolean {
  const normalized = normalizeValue(groupName);

  return normalized === "color" || normalized === "colour";
}

function getOptionGroupLabel(groupName: string, valueCount: number): string {
  const normalized = normalizeValue(groupName);
  const plural = valueCount > 1;

  if (normalized === "talla") {
    return plural ? "Tallas:" : "Talla:";
  }

  if (normalized === "color" || normalized === "colour") {
    return plural ? "Colores:" : "Color:";
  }

  if (normalized === "longitud") {
    return plural ? "Longitudes:" : "Longitud:";
  }

  return `${groupName}:`;
}

function getColorKind(value: string): ColorKind {
  const normalized = normalizeValue(value);

  if (normalized === "ao" || normalized === "azul" || normalized === "blue") {
    return "BLUE";
  }

  if (normalized === "aka" || normalized === "rojo" || normalized === "red") {
    return "RED";
  }

  if (normalized === "amarillo" || normalized === "yellow") {
    return "YELLOW";
  }

  if (normalized === "naranja" || normalized === "orange") {
    return "ORANGE";
  }

  if (normalized === "verde" || normalized === "green") {
    return "GREEN";
  }

  if (normalized === "marrón" || normalized === "marron" || normalized === "brown") {
    return "BROWN";
  }

  return "OTHER";
}

function usesCompetitionColorPair(values: string[]): boolean {
  if (values.length !== 2) {
    return false;
  }

  const kinds = new Set(values.map(getColorKind));

  return kinds.size === 2 && kinds.has("BLUE") && kinds.has("RED");
}

function getCompetitionColorDisplayValue(kind: ColorKind, fallback: string): string {
  if (kind === "BLUE") {
    return "Ao";
  }

  if (kind === "RED") {
    return "Aka";
  }

  return fallback;
}

function getColorButtonClasses(kind: ColorKind, selected: boolean, available: boolean): string {
  if (!available) {
    return "cursor-not-allowed border-black/5 bg-neutral-50 text-neutral-300 line-through";
  }

  if (selected) {
    switch (kind) {
      case "BLUE":
        return "border-blue-600 bg-blue-100 text-blue-950 ring-2 ring-blue-600/15 shadow-sm";
      case "RED":
        return "border-red-600 bg-red-100 text-red-950 ring-2 ring-red-600/15 shadow-sm";
      case "YELLOW":
        return "border-yellow-500 bg-yellow-100 text-yellow-950 ring-2 ring-yellow-500/15 shadow-sm";
      case "ORANGE":
        return "border-orange-500 bg-orange-100 text-orange-950 ring-2 ring-orange-500/15 shadow-sm";
      case "GREEN":
        return "border-green-600 bg-green-100 text-green-950 ring-2 ring-green-600/15 shadow-sm";
      case "BROWN":
        return "border-amber-800 bg-amber-100 text-amber-950 ring-2 ring-amber-800/15 shadow-sm";
      default:
        return "border-neutral-500 bg-neutral-100 text-neutral-950 ring-2 ring-neutral-500/15 shadow-sm";
    }
  }

  switch (kind) {
    case "BLUE":
      return "border-blue-200 bg-white text-blue-800 hover:border-blue-500 hover:bg-blue-50";
    case "RED":
      return "border-red-200 bg-white text-red-800 hover:border-red-500 hover:bg-red-50";
    case "YELLOW":
      return "border-yellow-200 bg-white text-yellow-900 hover:border-yellow-500 hover:bg-yellow-50";
    case "ORANGE":
      return "border-orange-200 bg-white text-orange-900 hover:border-orange-500 hover:bg-orange-50";
    case "GREEN":
      return "border-green-200 bg-white text-green-800 hover:border-green-500 hover:bg-green-50";
    case "BROWN":
      return "border-amber-300 bg-white text-amber-900 hover:border-amber-700 hover:bg-amber-50";
    default:
      return "border-black/10 bg-white text-neutral-700 hover:border-neutral-950";
  }
}

function getSwatchClasses(kind: ColorKind): string {
  switch (kind) {
    case "BLUE":
      return "bg-blue-700";
    case "RED":
      return "bg-[#b31322]";
    case "YELLOW":
      return "bg-yellow-400";
    case "ORANGE":
      return "bg-orange-500";
    case "GREEN":
      return "bg-green-600";
    case "BROWN":
      return "bg-amber-900";
    default:
      return "bg-neutral-400";
  }
}

export function VariantSelector({ variants, onVariantChange }: VariantSelectorProps) {
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({});

  const optionGroups = useMemo(() => getOptionGroups(variants), [variants]);

  const groupNames = Object.keys(optionGroups);

  const selectedVariant = useMemo(
    () => findSelectedVariant(variants, selectedOptions, groupNames),
    [groupNames, selectedOptions, variants],
  );

  function isOptionAvailable(groupName: string, value: string): boolean {
    const tentativeSelection = {
      ...selectedOptions,
      [groupName]: value,
    };

    return variants.some(
      (variant) => variant.available && variantMatchesSelection(variant, tentativeSelection),
    );
  }

  function selectOption(groupName: string, value: string): void {
    const nextSelection = {
      ...selectedOptions,
      [groupName]: value,
    };

    const nextVariant = findSelectedVariant(variants, nextSelection, groupNames);

    setSelectedOptions(nextSelection);
    onVariantChange?.(nextVariant);
  }

  return (
    <div className="space-y-7">
      {groupNames.map((groupName) => {
        const values = optionGroups[groupName];
        const selectedValue = selectedOptions[groupName];
        const isColor = isColorGroup(groupName);
        const competitionColors = isColor && usesCompetitionColorPair(values);

        return (
          <fieldset key={groupName}>
            <div className="flex items-end justify-between gap-4">
              <legend className="text-sm font-semibold tracking-tight text-neutral-950">
                {getOptionGroupLabel(groupName, values.length)}
              </legend>

              {competitionColors ? (
                <span className="text-[10px] font-semibold tracking-[0.12em] text-neutral-400 uppercase">
                  Ao / Aka
                </span>
              ) : null}
            </div>

            <div className="mt-3 flex flex-wrap gap-2">
              {values.map((value) => {
                const selected = selectedValue === value;
                const available = isOptionAvailable(groupName, value);
                const colorKind = isColor ? getColorKind(value) : "OTHER";
                const displayValue = competitionColors
                  ? getCompetitionColorDisplayValue(colorKind, value)
                  : value;

                const buttonClasses = isColor
                  ? getColorButtonClasses(colorKind, selected, available)
                  : available
                    ? selected
                      ? "border-neutral-950 bg-neutral-950 text-white shadow-sm"
                      : "border-black/10 bg-white text-neutral-700 hover:border-neutral-950"
                    : "cursor-not-allowed border-black/5 bg-neutral-50 text-neutral-300 line-through";

                const accessibleColorLabel = competitionColors
                  ? colorKind === "BLUE"
                    ? "Ao, azul"
                    : colorKind === "RED"
                      ? "Aka, rojo"
                      : value
                  : value;

                return (
                  <button
                    key={value}
                    type="button"
                    disabled={!available}
                    aria-pressed={selected}
                    aria-label={
                      isColor ? `Color ${accessibleColorLabel}` : `${groupName}: ${value}`
                    }
                    onClick={() => selectOption(groupName, value)}
                    className={`inline-flex min-h-11 items-center gap-2 rounded-xl border px-4 text-sm font-semibold transition-all duration-200 ${buttonClasses}`}
                  >
                    {isColor ? (
                      <span
                        aria-hidden="true"
                        className={`size-3 rounded-full ring-1 ring-black/10 ${getSwatchClasses(
                          colorKind,
                        )}`}
                      />
                    ) : null}

                    {displayValue}
                  </button>
                );
              })}
            </div>
          </fieldset>
        );
      })}

      <div
        className={`rounded-2xl border p-4 transition-colors ${
          selectedVariant
            ? "border-[var(--ck-red)]/15 bg-[var(--ck-red-soft)]"
            : "border-black/8 bg-neutral-50"
        }`}
      >
        {selectedVariant ? (
          <>
            <p className="text-[10px] font-semibold tracking-[0.15em] text-[var(--ck-red)] uppercase">
              Variante seleccionada
            </p>

            <p className="mt-2 font-semibold tracking-tight text-neutral-950">
              {selectedVariant.label}
            </p>
          </>
        ) : (
          <>
            <p className="text-sm font-semibold tracking-tight text-neutral-950">
              Selecciona las opciones del producto.
            </p>

            <p className="mt-1 text-sm leading-6 text-neutral-500">
              Las combinaciones no disponibles se desactivan automáticamente.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

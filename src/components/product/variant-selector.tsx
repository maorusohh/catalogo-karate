"use client";

import { useMemo, useState } from "react";

import type { ProductVariant } from "@/types/catalog";

type VariantSelectorProps = {
  variants: ProductVariant[];
  onVariantChange?: (variant: ProductVariant | undefined) => void;
};

type SelectedOptions = Record<string, string>;

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

function getColorKind(value: string): "AO" | "AKA" | "OTHER" {
  const normalized = normalizeValue(value);

  if (normalized === "ao" || normalized === "azul" || normalized === "blue") {
    return "AO";
  }

  if (normalized === "aka" || normalized === "rojo" || normalized === "red") {
    return "AKA";
  }

  return "OTHER";
}

function getColorButtonClasses(
  kind: "AO" | "AKA" | "OTHER",
  selected: boolean,
  available: boolean,
): string {
  if (!available) {
    return "cursor-not-allowed border-black/5 bg-neutral-50 text-neutral-300 line-through";
  }

  if (selected && kind === "AO") {
    return "border-blue-700 bg-blue-700 text-white shadow-sm shadow-blue-900/15";
  }

  if (selected && kind === "AKA") {
    return "border-[#b31322] bg-[#b31322] text-white shadow-sm shadow-red-950/15";
  }

  if (kind === "AO") {
    return "border-blue-200 bg-blue-50 text-blue-800 hover:border-blue-500 hover:bg-blue-100";
  }

  if (kind === "AKA") {
    return "border-red-200 bg-red-50 text-red-800 hover:border-[#b31322] hover:bg-red-100";
  }

  return "border-black/10 bg-white text-neutral-700 hover:border-neutral-950";
}

function getSwatchClasses(kind: "AO" | "AKA" | "OTHER"): string {
  if (kind === "AO") {
    return "bg-blue-700";
  }

  if (kind === "AKA") {
    return "bg-[#b31322]";
  }

  return "bg-neutral-400";
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

        return (
          <fieldset key={groupName}>
            <div className="flex items-end justify-between gap-4">
              <legend className="text-sm font-semibold tracking-tight text-neutral-950">
                {groupName}
              </legend>

              {isColor ? (
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

                const buttonClasses = isColor
                  ? getColorButtonClasses(colorKind, selected, available)
                  : available
                    ? selected
                      ? "border-neutral-950 bg-neutral-950 text-white shadow-sm"
                      : "border-black/10 bg-white text-neutral-700 hover:border-neutral-950"
                    : "cursor-not-allowed border-black/5 bg-neutral-50 text-neutral-300 line-through";

                const accessibleColorLabel =
                  colorKind === "AO" ? "Ao, azul" : colorKind === "AKA" ? "Aka, rojo" : value;

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

                    {value}
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

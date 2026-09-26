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

        return (
          <fieldset key={groupName}>
            <legend className="text-sm font-semibold text-neutral-950">{groupName}</legend>

            <div className="mt-3 flex flex-wrap gap-2">
              {values.map((value) => {
                const selected = selectedValue === value;

                const available = isOptionAvailable(groupName, value);

                return (
                  <button
                    key={value}
                    type="button"
                    disabled={!available}
                    aria-pressed={selected}
                    onClick={() => selectOption(groupName, value)}
                    className={`min-h-11 rounded-xl border px-4 text-sm font-semibold transition-colors ${
                      selected
                        ? "border-neutral-950 bg-neutral-950 text-white"
                        : available
                          ? "border-black/10 bg-white text-neutral-700 hover:border-neutral-950"
                          : "cursor-not-allowed border-black/5 bg-neutral-50 text-neutral-300 line-through"
                    }`}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
          </fieldset>
        );
      })}

      <div
        className={`rounded-2xl border p-4 ${
          selectedVariant ? "border-emerald-200 bg-emerald-50" : "border-black/10 bg-neutral-50"
        }`}
      >
        {selectedVariant ? (
          <>
            <p className="text-xs font-semibold tracking-[0.15em] text-emerald-700 uppercase">
              Variante seleccionada
            </p>

            <p className="mt-2 font-semibold text-neutral-950">{selectedVariant.label}</p>
          </>
        ) : (
          <>
            <p className="text-sm font-semibold text-neutral-950">
              Selecciona las opciones del producto.
            </p>

            <p className="mt-1 text-sm leading-6 text-neutral-500">
              Algunas combinaciones pueden no estar disponibles.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

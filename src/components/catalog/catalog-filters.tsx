"use client";

import type { ReactNode } from "react";

import { approvalPresentation } from "@/lib/catalog/approval";
import type { CatalogFilters as CatalogFiltersState } from "@/lib/catalog/queries";
import { getCategoryTreeIds } from "@/lib/catalog/scoped";
import type { ApprovalLevel, Brand, Category, Product } from "@/types/catalog";

type CatalogFiltersProps = {
  filters: CatalogFiltersState;
  brands: Brand[];
  categories: Category[];
  products: Product[];
  onChange: (filters: CatalogFiltersState) => void;
  onReset: () => void;
};

type ApprovalOption = {
  value: ApprovalLevel;
  label: string;
  detail?: string;
};

const approvalLevels: ApprovalLevel[] = ["WKF", "NATIONAL", "NON_APPROVED", "UNSPECIFIED"];

const approvalOptions: ApprovalOption[] = approvalLevels.map((value) => ({
  value,
  label: approvalPresentation[value].shortLabel,
  detail: approvalPresentation[value].detail,
}));

const categoryOrder = ["karategis", "protecciones", "cinturones", "accesorios"];

function getCategoryOrder(category: Category): number {
  const index = categoryOrder.indexOf(category.id);

  return index === -1 ? categoryOrder.length : index;
}

function getApprovalLabel(value: ApprovalLevel | "ALL"): string {
  if (value === "ALL") {
    return "Sin filtro";
  }

  return approvalPresentation[value].shortLabel;
}

function ChevronIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m7 10 5 5 5-5" />
    </svg>
  );
}

function FilterSection({
  title,
  value,
  children,
}: {
  title: string;
  value: string;
  children: ReactNode;
}) {
  return (
    <details className="group overflow-hidden rounded-2xl border border-black/10 bg-white">
      <summary className="flex cursor-pointer list-none items-center gap-3 px-4 py-3.5 [&::-webkit-details-marker]:hidden">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold tracking-[0.14em] text-neutral-500 uppercase">
            {title}
          </p>
          <p className="mt-1 truncate text-sm font-medium text-neutral-950">{value}</p>
        </div>

        <ChevronIcon className="size-4 shrink-0 text-neutral-400 transition-transform duration-200 group-open:rotate-180" />
      </summary>

      <div className="border-t border-black/10 bg-neutral-50/70 p-2.5">{children}</div>
    </details>
  );
}

function OptionCount({ count, selected = false }: { count: number; selected?: boolean }) {
  return (
    <span
      className={`shrink-0 text-[11px] font-semibold tabular-nums ${selected ? "text-white/60" : "text-neutral-400"}`}
    >
      {count}
    </span>
  );
}

function ClearFacetButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-xl border border-dashed border-black/10 bg-white px-3 py-2.5 text-left text-xs font-semibold text-neutral-500 transition-colors hover:border-black/20 hover:text-neutral-950"
    >
      {label}
    </button>
  );
}

export function CatalogFilters({
  filters,
  brands,
  categories,
  products,
  onChange,
  onReset,
}: CatalogFiltersProps) {
  const activeProducts = products.filter((product) => product.active);
  const activeProductBrandIds = new Set(activeProducts.map((product) => product.brandId));

  const activeBrands = brands
    .filter((brand) => brand.active && activeProductBrandIds.has(brand.id))
    .sort((a, b) => a.name.localeCompare(b.name, "es"));

  const activeCategories = categories.filter((category) => category.active);

  const topLevelCategories = activeCategories
    .filter((category) => category.parentId === null)
    .sort((a, b) => {
      const orderDifference = getCategoryOrder(a) - getCategoryOrder(b);
      return orderDifference || a.name.localeCompare(b.name, "es");
    });

  const selectedBrandName =
    filters.brandId === "ALL"
      ? `${activeBrands.length} ${activeBrands.length === 1 ? "marca" : "marcas"}`
      : (activeBrands.find((brand) => brand.id === filters.brandId)?.name ?? "Marca seleccionada");

  const selectedCategoryName =
    filters.categoryId === "ALL"
      ? `${activeCategories.length} ${activeCategories.length === 1 ? "categoría" : "categorías"}`
      : (activeCategories.find((category) => category.id === filters.categoryId)?.name ??
        "Categoría seleccionada");

  return (
    <div className="rounded-3xl border border-black/10 bg-white p-5">
      <div className="border-b border-black/8 pb-4">
        <div className="flex items-baseline justify-between gap-4">
          <h2 className="text-base font-semibold tracking-tight text-neutral-950">
            Filtrar productos
          </h2>

          <button
            type="button"
            onClick={onReset}
            className="text-xs font-semibold text-neutral-500 transition-colors hover:text-[#b31322]"
          >
            Limpiar
          </button>
        </div>

        <p className="mt-1 text-xs leading-5 text-neutral-500">Marcas, categorías y aprobación.</p>
      </div>

      <div className="mt-4 space-y-3">
        <FilterSection title="Marcas" value={selectedBrandName}>
          <div className="space-y-2">
            {filters.brandId !== "ALL" ? (
              <ClearFacetButton
                label="Quitar filtro de marca"
                onClick={() => onChange({ ...filters, brandId: "ALL" })}
              />
            ) : null}

            {activeBrands.map((brand) => {
              const brandProducts = activeProducts.filter(
                (product) => product.brandId === brand.id,
              );
              const categoryIds = new Set(brandProducts.map((product) => product.categoryId));

              const brandCategories = activeCategories
                .filter((category) => categoryIds.has(category.id))
                .sort((a, b) => a.name.localeCompare(b.name, "es"));

              const brandSelected = filters.brandId === brand.id;

              return (
                <details
                  key={brand.id}
                  className="group/brand overflow-hidden rounded-xl border border-black/10 bg-white"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2.5 text-sm font-semibold text-neutral-900 [&::-webkit-details-marker]:hidden">
                    <span className="min-w-0 truncate">{brand.name}</span>
                    <span className="flex shrink-0 items-center gap-2">
                      <OptionCount count={brandProducts.length} />
                      <ChevronIcon
                        className={`size-4 transition-transform duration-200 group-open/brand:rotate-180 ${
                          brandSelected ? "text-[#b31322]" : "text-neutral-400"
                        }`}
                      />
                    </span>
                  </summary>

                  <div className="space-y-1 border-t border-black/8 p-2">
                    <button
                      type="button"
                      aria-pressed={brandSelected && filters.categoryId === "ALL"}
                      onClick={() => onChange({ ...filters, brandId: brand.id, categoryId: "ALL" })}
                      className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                        brandSelected && filters.categoryId === "ALL"
                          ? "bg-neutral-950 font-semibold text-white"
                          : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950"
                      }`}
                    >
                      <span>Ver todos</span>
                      <OptionCount
                        count={brandProducts.length}
                        selected={brandSelected && filters.categoryId === "ALL"}
                      />
                    </button>

                    {brandCategories.map((category) => {
                      const selected = brandSelected && filters.categoryId === category.id;
                      const count = brandProducts.filter(
                        (product) => product.categoryId === category.id,
                      ).length;

                      return (
                        <button
                          key={category.id}
                          type="button"
                          aria-pressed={selected}
                          onClick={() =>
                            onChange({
                              ...filters,
                              brandId: brand.id,
                              categoryId: category.id,
                            })
                          }
                          className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                            selected
                              ? "bg-neutral-950 font-semibold text-white"
                              : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950"
                          }`}
                        >
                          <span className="min-w-0">{category.name}</span>
                          <OptionCount count={count} selected={selected} />
                        </button>
                      );
                    })}
                  </div>
                </details>
              );
            })}
          </div>
        </FilterSection>

        <FilterSection title="Categorías" value={selectedCategoryName}>
          <div className="space-y-2">
            {filters.categoryId !== "ALL" ? (
              <ClearFacetButton
                label="Quitar filtro de categoría"
                onClick={() => onChange({ ...filters, categoryId: "ALL" })}
              />
            ) : null}

            {topLevelCategories.map((parent) => {
              const children = activeCategories
                .filter((category) => category.parentId === parent.id)
                .sort((a, b) => a.name.localeCompare(b.name, "es"));
              const categoryTreeIds = new Set(getCategoryTreeIds(parent.id, activeCategories));
              const parentProductCount = activeProducts.filter((product) =>
                categoryTreeIds.has(product.categoryId),
              ).length;

              const selectedInGroup =
                filters.categoryId === parent.id ||
                children.some((child) => child.id === filters.categoryId);

              return (
                <details
                  key={parent.id}
                  className="group/category overflow-hidden rounded-xl border border-black/10 bg-white"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2.5 text-sm font-semibold text-neutral-900 [&::-webkit-details-marker]:hidden">
                    <span>{parent.name}</span>
                    <span className="flex shrink-0 items-center gap-2">
                      <OptionCount count={parentProductCount} />
                      <ChevronIcon
                        className={`size-4 transition-transform duration-200 group-open/category:rotate-180 ${
                          selectedInGroup ? "text-[#b31322]" : "text-neutral-400"
                        }`}
                      />
                    </span>
                  </summary>

                  <div className="space-y-1 border-t border-black/8 p-2">
                    <button
                      type="button"
                      aria-pressed={filters.categoryId === parent.id}
                      onClick={() => onChange({ ...filters, categoryId: parent.id })}
                      className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                        filters.categoryId === parent.id
                          ? "bg-neutral-950 font-semibold text-white"
                          : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950"
                      }`}
                    >
                      <span>Ver todo en {parent.name}</span>
                      <OptionCount
                        count={parentProductCount}
                        selected={filters.categoryId === parent.id}
                      />
                    </button>

                    {children.map((child) => {
                      const selected = filters.categoryId === child.id;
                      const count = activeProducts.filter(
                        (product) => product.categoryId === child.id,
                      ).length;

                      return (
                        <button
                          key={child.id}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => onChange({ ...filters, categoryId: child.id })}
                          className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                            selected
                              ? "bg-neutral-950 font-semibold text-white"
                              : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950"
                          }`}
                        >
                          <span>{child.name}</span>
                          <OptionCount count={count} selected={selected} />
                        </button>
                      );
                    })}
                  </div>
                </details>
              );
            })}
          </div>
        </FilterSection>

        <FilterSection title="Aprobación" value={getApprovalLabel(filters.approval)}>
          <div className="grid gap-2">
            {filters.approval !== "ALL" ? (
              <ClearFacetButton
                label="Quitar filtro de aprobación"
                onClick={() => onChange({ ...filters, approval: "ALL" })}
              />
            ) : null}

            {approvalOptions.map((option) => {
              const selected = filters.approval === option.value;
              const count = activeProducts.filter(
                (product) => product.approval === option.value,
              ).length;

              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => onChange({ ...filters, approval: option.value })}
                  className={`flex items-start justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${
                    selected
                      ? "bg-neutral-950 text-white"
                      : "bg-white text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold">{option.label}</span>
                    {option.detail ? (
                      <span
                        className={`mt-0.5 block text-[11px] leading-4 ${
                          selected ? "text-white/65" : "text-neutral-500"
                        }`}
                      >
                        {option.detail}
                      </span>
                    ) : null}
                  </span>

                  <OptionCount count={count} selected={selected} />
                </button>
              );
            })}
          </div>
        </FilterSection>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-3.5 py-3">
          <p className="text-xs font-semibold text-amber-900">Disponibilidad por confirmar</p>
          <p className="mt-1 text-xs leading-5 text-amber-800/80">
            Se valida al momento de realizar la consulta por WhatsApp.
          </p>
        </div>
      </div>
    </div>
  );
}

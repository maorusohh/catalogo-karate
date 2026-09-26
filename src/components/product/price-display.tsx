import type { ProductPrice } from "@/types/catalog";

type PriceDisplayProps = {
  prices: ProductPrice[];
};

export function PriceDisplay({ prices }: PriceDisplayProps) {
  if (prices.length === 0) {
    return (
      <div>
        <p className="text-lg font-semibold text-neutral-950">Consultar precio</p>

        <p className="mt-1 text-sm text-neutral-500">
          Confirma la condición comercial al realizar la consulta.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {prices.map((price, index) => (
        <div
          key={`${price.basis}-${index}`}
          className="rounded-2xl border border-black/10 bg-neutral-50 p-4"
        >
          <p className="text-lg font-semibold text-neutral-950">{price.label}</p>

          {price.note ? (
            <p className="mt-1 text-sm leading-6 text-neutral-500">{price.note}</p>
          ) : null}
        </div>
      ))}
    </div>
  );
}

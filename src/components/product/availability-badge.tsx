import type { AvailabilityStatus } from "@/types/catalog";

const labels: Record<AvailabilityStatus, string> = {
  AVAILABLE: "Disponible",
  CONSULT: "Consultar disponibilidad",
  OUT_OF_STOCK: "Agotado",
  COMING_SOON: "Próximamente",
};

type AvailabilityBadgeProps = {
  availability: AvailabilityStatus;
};

export function AvailabilityBadge({ availability }: AvailabilityBadgeProps) {
  return (
    <span className="inline-flex items-center gap-2 text-sm font-medium text-neutral-700">
      <span
        aria-hidden="true"
        className={`size-2 rounded-full ${
          availability === "AVAILABLE"
            ? "bg-emerald-500"
            : availability === "OUT_OF_STOCK"
              ? "bg-red-500"
              : "bg-amber-500"
        }`}
      />

      {labels[availability]}
    </span>
  );
}

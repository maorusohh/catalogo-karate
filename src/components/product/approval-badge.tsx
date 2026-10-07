import type { ApprovalLevel } from "@/types/catalog";

const labels: Record<ApprovalLevel, string> = {
  WKF: "WKF · Aprobación World Karate Federation",
  NATIONAL: "FVKD · Aprobación nacional",
  NON_APPROVED: "No aprobado",
  UNSPECIFIED: "Sin aprobación especificada",
};

type ApprovalBadgeProps = {
  approval: ApprovalLevel;
};

export function ApprovalBadge({ approval }: ApprovalBadgeProps) {
  return (
    <span className="inline-flex min-h-8 items-center rounded-full bg-[#b31322]/10 px-3 py-1 text-xs font-semibold text-[#8d0f1b]">
      {labels[approval]}
    </span>
  );
}

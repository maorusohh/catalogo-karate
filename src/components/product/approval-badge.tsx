import type { ApprovalLevel } from "@/types/catalog";

const labels: Record<ApprovalLevel, string> = {
  WKF: "WKF",
  NATIONAL: "Aprobación nacional",
  NON_APPROVED: "No aprobado",
  UNSPECIFIED: "Por confirmar",
};

type ApprovalBadgeProps = {
  approval: ApprovalLevel;
};

export function ApprovalBadge({ approval }: ApprovalBadgeProps) {
  return (
    <span className="inline-flex min-h-8 items-center rounded-full bg-[#b31322]/10 px-3 text-xs font-semibold text-[#8d0f1b]">
      {labels[approval]}
    </span>
  );
}

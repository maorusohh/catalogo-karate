import { approvalPresentation } from "@/lib/catalog/approval";
import type { ApprovalLevel } from "@/types/catalog";

type ApprovalBadgeProps = {
  approval: ApprovalLevel;
};

export function ApprovalBadge({ approval }: ApprovalBadgeProps) {
  return (
    <span className="inline-flex min-h-8 items-center rounded-full bg-[#b31322]/10 px-3 py-1 text-xs font-semibold text-[#8d0f1b]">
      {approvalPresentation[approval].badgeLabel}
    </span>
  );
}

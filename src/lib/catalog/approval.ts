import type { ApprovalLevel } from "@/types/catalog";

type ApprovalPresentation = {
  shortLabel: string;
  cardLabel: string;
  badgeLabel: string;
  detail?: string;
};

export const approvalPresentation: Record<ApprovalLevel, ApprovalPresentation> = {
  WKF: {
    shortLabel: "WKF",
    cardLabel: "Aprobación WKF",
    badgeLabel: "WKF · World Karate Federation",
    detail: "World Karate Federation · Mundial",
  },
  NATIONAL: {
    shortLabel: "FVKD",
    cardLabel: "Aprobación FVKD",
    badgeLabel: "FVKD · Federación Venezolana de Karate Do",
    detail: "Federación Venezolana de Karate Do · Nacional",
  },
  NON_APPROVED: {
    shortLabel: "Sin homologación",
    cardLabel: "Sin homologación",
    badgeLabel: "Sin homologación deportiva",
  },
  UNSPECIFIED: {
    shortLabel: "Por confirmar",
    cardLabel: "Aprobación por confirmar",
    badgeLabel: "Aprobación por confirmar",
  },
};

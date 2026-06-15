const playerStyles: Record<string, string> = {
  APPROVED: "bg-emerald-100 text-emerald-800",
  REJECTED: "bg-red-100 text-red-800",
  "UNDER REVIEW": "bg-blue-100 text-blue-800",
  "PENDING VERIFICATION": "bg-amber-100 text-amber-800"
};

const franchiseStyles: Record<string, string> = {
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-red-100 text-red-800",
  pending: "bg-amber-100 text-amber-800"
};

export function PlayerStatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide ${playerStyles[status] || playerStyles["UNDER REVIEW"]}`}>
      {status || "UNDER REVIEW"}
    </span>
  );
}

export function FranchiseStatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide ${franchiseStyles[status] || franchiseStyles.pending}`}>
      {status}
    </span>
  );
}

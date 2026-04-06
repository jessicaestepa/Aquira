import { Badge } from "@/components/ui/badge";
import type { LeadStatus, DealStatus } from "@/lib/supabase/types";

const leadStatusColors: Record<LeadStatus, string> = {
  new: "bg-blue-100 text-blue-800",
  qualified: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  contacted: "bg-yellow-100 text-yellow-800",
  intro_sent: "bg-purple-100 text-purple-800",
  in_process: "bg-orange-100 text-orange-800",
  closed: "bg-gray-100 text-gray-800",
};

const dealStatusColors: Record<DealStatus, string> = {
  draft: "bg-gray-100 text-gray-800",
  live: "bg-green-100 text-green-800",
  archived: "bg-red-100 text-red-800",
};

export function LeadStatusBadge({ status }: { status: LeadStatus }) {
  return (
    <Badge
      variant="secondary"
      className={leadStatusColors[status] || "bg-gray-100 text-gray-800"}
    >
      {status.replace("_", " ")}
    </Badge>
  );
}

export function DealStatusBadge({ status }: { status: DealStatus }) {
  return (
    <Badge
      variant="secondary"
      className={dealStatusColors[status] || "bg-gray-100 text-gray-800"}
    >
      {status}
    </Badge>
  );
}

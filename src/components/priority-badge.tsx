import { TriangleAlert } from "lucide-react";
import { Badge } from "./shadcn/badge";
import { Priority } from "../types/enum";

export function PriorityBadge({ priority }: { priority: Priority }) {
  const config: any = {
    LOW: {
      color: "bg-slate-500/10 text-slate-500",
      label: "Low",
    },
    MEDIUM: {
      color: "bg-blue-500/10 text-blue-500",
      label: "Medium",
    },
    HIGH: {
      color: "bg-orange-500/10 text-orange-500",
      label: "High",
    },
    URGENT: {
      color: "bg-red-500/10 text-red-500",
      label: "Urgent",
    },
  };

  const { color, label } = config[priority] || config.MEDIUM;

  return (
    <Badge
      className={`text-[10px] gap-2 shrink-none shadow font-bold ${color}`}
    >
      <TriangleAlert className="size-4" />
      {label}
    </Badge>
  );
}

"use client";

import { Badge } from "@/src/components/shadcn/badge";

export const priorityColorMap: Record<string, string> = {
  URGENT: "bg-red-200 text-red-700 hover:bg-red-300",
  HIGH: "bg-yellow-200 text-yellow-700 hover:bg-yellow-300",
  MEDIUM: "bg-green-200 text-green-700 hover:bg-green-300",
  LOW: "bg-blue-200 text-blue-700 hover:bg-blue-300 ",
};
export default function PriorityBadge({ priority }: { priority: string }) {
  return (
    <Badge
      className={`text-xs ${priorityColorMap[priority] ?? "bg-gray-200 text-gray-700"}`}
    >
      {priority}
    </Badge>
  );
}

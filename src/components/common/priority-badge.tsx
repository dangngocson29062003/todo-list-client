"use client";

import { Badge } from "@/src/components/shadcn/badge"

export default function PriorityBadge({ priority }: { priority: string }) {
  const colorMap: Record<string, string> = {
    URGENT: "bg-red-200 text-red-700",
    HIGH: "bg-yellow-200 text-yellow-700",
    MEDIUM: "bg-green-200 text-green-700",
    LOW: "bg-blue-200 text-blue-700",
  }

  return (
    <Badge className={`text-xs ${colorMap[priority] ?? "bg-gray-200 text-gray-700"}`}>
      {priority}
    </Badge>
  );
}
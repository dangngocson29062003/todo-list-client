"use client";

import { addDays, format } from "date-fns";

type Props = {
  viewMode: "day" | "week" | "month";
  // Nhận width động từ cha
  dayWidth: number;
  weekWidth: number;
  monthWidth: number;

  totalDays: number;
  weeks: Date[];
  monthGroups: { start: number; end: number }[];
  weekMonthGroups: { start: number; end: number; label: string }[];
  startDate: Date;
};

export default function GanttHeader({
  viewMode,
  dayWidth,
  weekWidth,
  monthWidth,
  totalDays,
  weeks,
  monthGroups,
  weekMonthGroups,
  startDate,
}: Props) {
  return (
    <>
      {viewMode !== "month" && (
        <div
          className="grid border-b bg-gray-50 dark:bg-muted h-(--gantt-height) items-center font-bold"
          style={{
            gridTemplateColumns:
              viewMode === "day"
                ? `repeat(${totalDays}, ${dayWidth}px)`
                : viewMode === "week"
                  ? `repeat(${weeks.length}, ${weekWidth}px)`
                  : `repeat(${weeks.length}, ${monthWidth}px)`,
          }}
        >
          {viewMode === "day" &&
            monthGroups.map((m, i) => (
              <div
                key={i}
                className="text-xl text-gray-500 dark:text-gray-100 text-center border-r"
                style={{
                  gridColumn: `${m.start + 1} / ${m.end + 2}`,
                }}
              >
                {format(addDays(startDate, m.start), "MMM yyyy")}
              </div>
            ))}
          {viewMode === "week" &&
            weekMonthGroups.map((group, i) => (
              <div
                key={i}
                className="text-xl text-gray-500 dark:text-gray-100 text-center border-r bg-gray-100/50 dark:bg-muted/50"
                style={{
                  gridColumn: `${group.start + 1} / ${group.end + 2}`,
                }}
              >
                {group.label}
              </div>
            ))}
        </div>
      )}
    </>
  );
}

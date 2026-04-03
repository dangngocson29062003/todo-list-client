"use client";

import { format, getWeek } from "date-fns";

type Props = {
  viewMode: "day" | "week" | "month";
  // Nhận width động từ props thay vì import hằng số
  dayWidth: number;
  weekWidth: number;
  monthWidth: number;

  dates: Date[];
  weeks: Date[];
  months: Date[];
  totalDays: number;
};

export default function GanttSubHeader({
  viewMode,
  dayWidth,
  weekWidth,
  monthWidth,
  dates,
  weeks,
  months,
  totalDays,
}: Props) {
  return (
    <div
      className={`grid border-b sticky top-0 bg-gray-50 dark:bg-border z-10 items-center text-sm text-center 
    ${viewMode === "month" ? "min-h-[calc(var(--gantt-height)*2)]" : "h-[var(--gantt-height)]"}`}
    >
      {viewMode === "day" ? (
        <div
          className="grid h-(--gantt-height) items-center text-sm text-center"
          style={{
            gridTemplateColumns: `repeat(${totalDays}, ${dayWidth}px)`,
          }}
        >
          {dates.map((date, i) => (
            <div
              key={i}
              className="border-r h-full flex items-center justify-center"
            >
              {format(date, "d")}
            </div>
          ))}
        </div>
      ) : viewMode === "week" ? (
        <div
          className="grid h-full items-center"
          style={{
            gridTemplateColumns: `repeat(${weeks.length}, ${weekWidth}px)`,
          }}
        >
          {weeks.map((week, i) => (
            <div
              key={i}
              className="border-r h-full flex items-center justify-center"
            >
              W{getWeek(week)}
            </div>
          ))}
        </div>
      ) : (
        <div
          className="grid items-center h-full"
          style={{
            gridTemplateColumns: `repeat(${months.length}, ${monthWidth}px)`,
          }}
        >
          {months.map((m, i) => (
            <div
              key={i}
              className="border-r text-center text-sm font-bold h-full flex items-center justify-center"
            >
              {format(m, "MMM yyyy")}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

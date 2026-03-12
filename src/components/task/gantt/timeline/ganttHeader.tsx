import { addDays, format } from "date-fns";

type Props = {
  viewMode: "day" | "week" | "month";
  totalDays: number;
  weeks: Date[];
  months: Date[];
  DAY_WIDTH: number;
  WEEK_WIDTH: number;
  MONTH_WIDTH: number;
  monthGroups: { start: number; end: number }[];
  weekMonthGroups: { start: number; end: number; label: string }[];
  startDate: Date;
};

export default function GanttHeader({
  viewMode,
  totalDays,
  weeks,
  months,
  DAY_WIDTH,
  WEEK_WIDTH,
  MONTH_WIDTH,
  monthGroups,
  weekMonthGroups,
  startDate,
}: Props) {
  return (
    <div
      className="grid border-b bg-gray-50 dark:bg-muted h-[var(--gantt-height)] items-center font-bold"
      style={{
        gridTemplateColumns:
          viewMode === "day"
            ? `repeat(${totalDays}, ${DAY_WIDTH}px)`
            : viewMode === "week"
              ? `repeat(${weeks.length}, ${WEEK_WIDTH}px)`
              : `repeat(${months.length}, ${MONTH_WIDTH}px)`,
      }}
    >
      {/* DAY MODE */}
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

      {/* WEEK MODE */}
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

      {/* MONTH MODE */}
      {viewMode === "month" &&
        months.map((m, i) => (
          <div
            key={i}
            className="border-r text-center text-gray-500 dark:text-gray-100"
          >
            {format(m, "yyyy")}
          </div>
        ))}
    </div>
  );
}

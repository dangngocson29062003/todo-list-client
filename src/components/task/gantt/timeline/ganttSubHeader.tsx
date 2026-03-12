import { format, getWeek } from "date-fns";

type Props = {
  viewMode: "day" | "week" | "month";
  dates: Date[];
  weeks: Date[];
  months: Date[];
  totalDays: number;
  DAY_WIDTH: number;
  WEEK_WIDTH: number;
  MONTH_WIDTH: number;
};

export default function GanttSubHeader({
  viewMode,
  dates,
  weeks,
  months,
  totalDays,
  DAY_WIDTH,
  WEEK_WIDTH,
  MONTH_WIDTH,
}: Props) {
  return (
    <div className="grid border-b sticky top-0 bg-gray-50 dark:bg-border z-10 h-[var(--gantt-height)] items-center text-sm text-center">
      {/* DAY MODE */}
      {viewMode === "day" && (
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${totalDays}, ${DAY_WIDTH}px)`,
          }}
        >
          {dates.map((date, i) => (
            <div key={i} className="border-r">
              {format(date, "d")}
            </div>
          ))}
        </div>
      )}

      {/* WEEK MODE */}
      {viewMode === "week" && (
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${weeks.length}, ${WEEK_WIDTH}px)`,
          }}
        >
          {weeks.map((week, i) => (
            <div key={i} className="border-r">
              W{getWeek(week)}
            </div>
          ))}
        </div>
      )}

      {/* MONTH MODE */}
      {viewMode === "month" && (
        <div
          className="grid"
          style={{
            gridTemplateColumns: `repeat(${months.length}, ${MONTH_WIDTH}px)`,
          }}
        >
          {months.map((m, i) => (
            <div key={i} className="border-r">
              {format(m, "MMM")}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

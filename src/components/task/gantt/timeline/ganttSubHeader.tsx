import { DAY_WIDTH, MONTH_WIDTH, WEEK_WIDTH } from "@/src/helpers/ganttHelper";
import { format, getWeek } from "date-fns";

type Props = {
  viewMode: "day" | "week" | "month";
  dates: Date[];
  weeks: Date[];
  months: Date[];
  totalDays: number;
};

export default function GanttSubHeader({
  viewMode,
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
          className="grid border-b sticky top-0 bg-gray-50 dark:bg-border z-10 h-(--gantt-height) items-center text-sm text-center"
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
      ) : viewMode === "week" ? (
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
      ) : (
        <div
          className="grid items-center border-b sticky top-0 bg-gray-50 dark:bg-border z-10 min-h-[calc(var(--gantt-height)*2)]"
          style={{
            gridTemplateColumns: `repeat(${months.length}, ${MONTH_WIDTH}px)`,
          }}
        >
          {months.map((m, i) => (
            <div key={i} className="border-r text-center text-sm font-bold">
              {format(m, "MMM yyyy")}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { RefObject } from "react";
import { Task } from "@/src/types/task";
import GanttHeader from "./ganttHeader";
import GanttSubHeader from "./ganttSubHeader";
import GanttTodayMarker from "./ganttTodayMarker";
import GanttTaskRows from "./ganttTaskRow";

type DragType = "move" | "resize-left" | "resize-right";

type MonthGroup = {
  start: number;
  end: number;
};

type WeekMonthGroup = {
  start: number;
  end: number;
  label: string;
};

type Props = {
  timelineRef: RefObject<HTMLDivElement | null>;

  viewMode: "day" | "week" | "month";

  totalDays: number;

  weeks: Date[];
  months: Date[];
  dates: Date[];

  DAY_WIDTH: number;
  WEEK_WIDTH: number;
  MONTH_WIDTH: number;

  monthGroups: MonthGroup[];
  weekMonthGroups: WeekMonthGroup[];

  todayOffset: number;

  flatTasks: Task[];

  startDate: Date;
  startMonth: Date;
  firstWeekStart: Date;

  startDrag: (e: React.MouseEvent, id: number, type: DragType) => void;

  priorityColorMap: Record<string, string>;
};

export default function GanttTimeline({
  timelineRef,
  viewMode,
  totalDays,
  weeks,
  months,
  DAY_WIDTH,
  WEEK_WIDTH,
  MONTH_WIDTH,
  dates,
  monthGroups,
  weekMonthGroups,
  todayOffset,
  flatTasks,
  startDate,
  startMonth,
  firstWeekStart,
  startDrag,
  priorityColorMap,
}: Props) {
  const width =
    viewMode === "day"
      ? totalDays * DAY_WIDTH
      : viewMode === "week"
        ? weeks.length * WEEK_WIDTH
        : months.length * MONTH_WIDTH;

  return (
    <div ref={timelineRef} className="flex-1 overflow-x-auto relative">
      <div className="relative" style={{ width }}>
        <GanttHeader
          viewMode={viewMode}
          totalDays={totalDays}
          weeks={weeks}
          months={months}
          DAY_WIDTH={DAY_WIDTH}
          WEEK_WIDTH={WEEK_WIDTH}
          MONTH_WIDTH={MONTH_WIDTH}
          monthGroups={monthGroups}
          weekMonthGroups={weekMonthGroups}
          startDate={startDate}
        />

        <GanttSubHeader
          viewMode={viewMode}
          dates={dates}
          weeks={weeks}
          months={months}
          DAY_WIDTH={DAY_WIDTH}
          WEEK_WIDTH={WEEK_WIDTH}
          MONTH_WIDTH={MONTH_WIDTH}
          totalDays={totalDays}
        />

        <GanttTodayMarker todayOffset={todayOffset} />

        <GanttTaskRows
          flatTasks={flatTasks}
          viewMode={viewMode}
          startDate={startDate}
          startMonth={startMonth}
          firstWeekStart={firstWeekStart}
          startDrag={startDrag}
          priorityColorMap={priorityColorMap}
        />
      </div>
    </div>
  );
}

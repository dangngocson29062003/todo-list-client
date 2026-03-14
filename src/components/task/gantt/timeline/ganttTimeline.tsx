"use client";
import { RefObject, useEffect } from "react";
import { Task } from "@/src/types/task";
import GanttHeader from "./ganttHeader";
import GanttSubHeader from "./ganttSubHeader";
import GanttTodayMarker from "./ganttTodayMarker";
import GanttTaskRows from "./ganttTaskRow";
import {
  calculateTodayMarker,
  DAY_WIDTH,
  MONTH_WIDTH,
  WEEK_WIDTH,
} from "@/src/helpers/ganttHelper";

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
  range: { start: Date; end: Date };

  monthGroups: MonthGroup[];
  weekMonthGroups: WeekMonthGroup[];

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
  dates,
  range,
  monthGroups,
  weekMonthGroups,
  flatTasks,
  startDate,
  startMonth,
  firstWeekStart,
  startDrag,
  priorityColorMap,
}: Props) {
  const { todayOffset } = calculateTodayMarker(
    viewMode,
    startDate,
    firstWeekStart,
    startMonth,
  );
  const width =
    viewMode === "day"
      ? totalDays * DAY_WIDTH
      : viewMode === "week"
        ? weeks.length * WEEK_WIDTH
        : 12 * MONTH_WIDTH;
  useEffect(() => {
    if (!timelineRef.current) return;

    const container = timelineRef.current;

    const centerOffset =
      todayOffset -
      container.clientWidth / 2 +
      (viewMode === "day" ? DAY_WIDTH : MONTH_WIDTH) / 2;

    container.scrollTo({
      left: Math.max(centerOffset, 0),
      behavior: "smooth",
    });
  }, [viewMode, range]);
  return (
    <div ref={timelineRef} className="flex-1 overflow-x-auto relative">
      <div className="relative" style={{ width }}>
        <GanttHeader
          viewMode={viewMode}
          totalDays={totalDays}
          weeks={weeks}
          monthGroups={monthGroups}
          weekMonthGroups={weekMonthGroups}
          startDate={startDate}
        />

        <GanttSubHeader
          viewMode={viewMode}
          dates={dates}
          weeks={weeks}
          months={months}
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

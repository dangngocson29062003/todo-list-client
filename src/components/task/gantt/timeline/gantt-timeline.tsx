"use client";

import React, { useEffect } from "react";
import { Task } from "@/src/types/task";
import GanttHeader from "./gantt-header";
import GanttSubHeader from "./gantt-sub-header";
import GanttTodayMarker from "./gantt-today-marker";
import GanttTaskRows from "./gantt-task-row";
import {
  calculateTodayMarker,
  DAY_WIDTH,
  MONTH_WIDTH,
  WEEK_WIDTH,
} from "@/src/helpers/ganttHelper";
import GanttConnectors from "./gantt-connectors";

type DragType = "move" | "resize-left" | "resize-right";

type MonthGroup = { start: number; end: number };
type WeekMonthGroup = { start: number; end: number; label: string };

type Props = {
  timelineRef: React.RefObject<HTMLDivElement | null>;
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
  startDrag: (e: React.MouseEvent, id: string, type: DragType) => void;
  priorityColorMap: Record<string, { color: string; label: string }>;
  changedTaskIds: string[];
  onReset: (id: string) => void;
  onSave: (id: string) => void;
  ghostTask: { start: Date; end: Date } | null;
};
const GanttTimeline = React.memo(function GanttTimeline({
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
  changedTaskIds,
  onReset,
  onSave,
  ghostTask,
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
        : months.length * MONTH_WIDTH;
  useEffect(() => {
    if (!timelineRef || !timelineRef.current) return;

    const container = timelineRef.current;
    const timeout = setTimeout(() => {
      const centerOffset =
        todayOffset -
        container.clientWidth / 2 +
        (viewMode === "day" ? DAY_WIDTH : MONTH_WIDTH) / 2;

      container.scrollTo({
        left: Math.max(centerOffset, 0),
        behavior: "smooth",
      });
    }, 100);

    return () => clearTimeout(timeout);
  }, [viewMode, range, timelineRef, todayOffset]);

  return (
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
      <div className="relative">
        <GanttTaskRows
          flatTasks={flatTasks}
          viewMode={viewMode}
          startDate={startDate}
          startMonth={startMonth}
          firstWeekStart={firstWeekStart}
          startDrag={startDrag}
          priorityColorMap={priorityColorMap}
          changedTaskIds={changedTaskIds}
          onReset={onReset}
          onSave={onSave}
          ghostTask={ghostTask}
        />
        <GanttConnectors
          flatTasks={flatTasks}
          viewMode={viewMode}
          startDate={startDate}
          firstWeekStart={firstWeekStart}
          startMonth={startMonth}
        />
      </div>
    </div>
  );
});

export default GanttTimeline;

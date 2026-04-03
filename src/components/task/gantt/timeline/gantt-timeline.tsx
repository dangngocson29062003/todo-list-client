"use client";

import React, { useEffect } from "react";
import { Task } from "@/src/types/task";
import GanttHeader from "./gantt-header";
import GanttSubHeader from "./gantt-sub-header";
import GanttTodayMarker from "./gantt-today-marker";
import GanttTaskRows from "./gantt-task-row";
import { calculateTodayMarker } from "@/src/helpers/ganttHelper";
import GanttConnectors from "./gantt-connectors";

type DragType = "move" | "resize-left" | "resize-right" | "create";

type MonthGroup = { start: number; end: number };
type WeekMonthGroup = { start: number; end: number; label: string };

type Props = {
  timelineRef: React.RefObject<HTMLDivElement | null>;
  viewMode: "day" | "week" | "month";
  // --- NHẬN WIDTH ĐỘNG TỪ PARENT ---
  dayWidth: number;
  weekWidth: number;
  monthWidth: number;

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
  dayWidth,
  weekWidth,
  monthWidth,
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
    dayWidth,
    weekWidth,
    monthWidth,
  );
  const width =
    viewMode === "day"
      ? totalDays * dayWidth
      : viewMode === "week"
        ? weeks.length * weekWidth
        : months.length * monthWidth;
  useEffect(() => {
    if (!timelineRef || !timelineRef.current) return;

    const container = timelineRef.current;
    const timeout = setTimeout(() => {
      const centerOffset =
        todayOffset -
        container.clientWidth / 2 +
        (viewMode === "day" ? dayWidth : monthWidth) / 2;

      container.scrollTo({
        left: Math.max(centerOffset, 0),
        behavior: "smooth",
      });
    }, 100);

    return () => clearTimeout(timeout);
  }, [viewMode, range, timelineRef, todayOffset, dayWidth, monthWidth]);

  return (
    <div className="relative" style={{ width }}>
      <GanttHeader
        viewMode={viewMode}
        dayWidth={dayWidth}
        weekWidth={weekWidth}
        monthWidth={monthWidth}
        totalDays={totalDays}
        weeks={weeks}
        monthGroups={monthGroups}
        weekMonthGroups={weekMonthGroups}
        startDate={startDate}
      />

      <GanttSubHeader
        viewMode={viewMode}
        dayWidth={dayWidth}
        weekWidth={weekWidth}
        monthWidth={monthWidth}
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
          dayWidth={dayWidth}
          weekWidth={weekWidth}
          monthWidth={monthWidth}
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
          dayWidth={dayWidth}
          weekWidth={weekWidth}
          monthWidth={monthWidth}
          startDate={startDate}
          firstWeekStart={firstWeekStart}
          startMonth={startMonth}
        />
      </div>
    </div>
  );
});

export default GanttTimeline;

"use client";

import { Task } from "@/src/types/task";
import { GanttTaskRowItem } from "./gantt-row-item";
import {
  addDays,
  addMonths,
  differenceInDays,
  differenceInMonths,
  differenceInWeeks,
  startOfMonth,
} from "date-fns";
import { useMemo } from "react";

type DragType = "move" | "resize-left" | "resize-right" | "create";

type Props = {
  flatTasks: Task[];
  viewMode: "day" | "week" | "month";
  // Nhận width động từ cha
  dayWidth: number;
  weekWidth: number;
  monthWidth: number;

  changedTaskIds: string[];
  startDate: Date;
  startMonth: Date;
  firstWeekStart: Date;

  startDrag: (e: React.MouseEvent, id: string, type: DragType) => void;

  priorityColorMap: Record<string, { color: string; label: string }>;
  onReset: (id: string) => void;
  onSave: (id: string) => void;
  ghostTask: { start: Date; end: Date } | null;
};

export default function GanttTaskRows({
  flatTasks,
  viewMode,
  dayWidth,
  weekWidth,
  monthWidth,
  startDate,
  startMonth,
  firstWeekStart,
  changedTaskIds,
  startDrag,
  priorityColorMap,
  onReset,
  onSave,
  ghostTask,
}: Props) {
  const handleCreateMouseDown = (e: React.MouseEvent) => {
    startDrag(e, "new-task-id", "create" as any);
  };
  const ghostLayout = useMemo(() => {
    if (!ghostTask || !ghostTask.start || !ghostTask.end) return null;
    let startOffset = 0;

    let duration = 0;

    const sDate = new Date(ghostTask.start);

    const eDate = new Date(ghostTask.end);

    if (viewMode === "day") {
      startOffset = differenceInDays(sDate, startDate) * dayWidth;

      duration = (differenceInDays(eDate, sDate) + 1) * dayWidth;
    }

    if (viewMode === "week") {
      const weekIndex = differenceInWeeks(sDate, firstWeekStart);

      const startOfCurrentWeek = addDays(firstWeekStart, weekIndex * 7);

      const offsetDays = differenceInDays(sDate, startOfCurrentWeek);

      startOffset =
        weekIndex * weekWidth + offsetDays * (weekWidth / 7) - weekWidth / 7;

      duration = (differenceInDays(eDate, sDate) + 1) * (weekWidth / 7);
    }

    if (viewMode === "month") {
      const daysInStartMonth = differenceInDays(
        addMonths(startOfMonth(sDate), 1),

        startOfMonth(sDate),
      );

      const monthDiff = differenceInMonths(sDate, startMonth);

      const dayOffsetInMonth = (sDate.getDate() - 1) / daysInStartMonth;

      startOffset = (monthDiff + dayOffsetInMonth) * monthWidth;

      const taskDays = differenceInDays(eDate, sDate) + 1;

      duration = (taskDays / 30) * monthWidth;
    }

    return { startOffset, duration };
  }, [ghostTask, viewMode, startDate, dayWidth, weekWidth, monthWidth]);

  return (
    <>
      {flatTasks.map((task) => {
        const isDirectlyChanged = changedTaskIds.includes(task.id);
        const hasChangedParent = !!(
          task.parentId && changedTaskIds.includes(task.parentId)
        );

        return (
          <GanttTaskRowItem
            key={task.id}
            task={task}
            viewMode={viewMode}
            dayWidth={dayWidth}
            weekWidth={weekWidth}
            monthWidth={monthWidth}
            startDate={startDate}
            startMonth={startMonth}
            firstWeekStart={firstWeekStart}
            isDirectlyChanged={isDirectlyChanged}
            hasChangedParent={hasChangedParent}
            priorityColorMap={priorityColorMap}
            startDrag={startDrag}
            onReset={onReset}
            onSave={onSave}
          />
        );
      })}
      <div
        className="relative h-12 w-full border-t border-border/50 group/create hover:bg-muted/30 transition-colors cursor-crosshair"
        onMouseDown={handleCreateMouseDown}
      >
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <span className="text-[10px] font-medium text-muted-foreground opacity-0 group-hover/create:opacity-100 transition-opacity uppercase tracking-wider">
            + Drag on timeline to create task
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover/create:opacity-100 pointer-events-none" />
      </div>
      {ghostTask && ghostLayout && (
        <div
          className="absolute h-9 border-2 border-dashed border-blue-400 rounded-md z-50 pointer-events-none flex items-center px-2 shadow-sm bg-blue-400/10"
          style={{
            left: `${ghostLayout.startOffset}px`,
            width: `${ghostLayout.duration}px`,
            bottom: 6,
          }}
        >
          <span className="text-[10px] font-bold text-blue-400 truncate">
            New Task...
          </span>
        </div>
      )}
    </>
  );
}

"use client";

import {
  buildTree,
  flatten,
  getMonthGroups,
  getWeekMonthGroups,
} from "@/src/helpers/ganttHelper";
import { Task } from "@/src/types/task";
import {
  addDays,
  addMonths,
  differenceInDays,
  differenceInMonths,
  differenceInWeeks,
  format,
  getWeek,
  startOfDay,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { useEffect, useRef, useState } from "react";
import { priorityColorMap } from "../../common/priority-badge";
import GanttTaskList from "./ganttTasklist";
import GanttToolbar from "./ganttToolbar";
import GanttTimeline from "./timeline/ganttTimeline";

const DAY_WIDTH = 50;
const WEEK_WIDTH = 140;
const MONTH_WIDTH = 260;
const MIN_TASK_WIDTH = 300;
const MAX_TASK_WIDTH = 600;
const MIN_DATE_WIDTH = 80;
const MAX_DATE_WIDTH = 160;
type DragType = "move" | "resize-left" | "resize-right";

type DragInfo = {
  id: number;
  type: DragType;
  startX: number;
} | null;

type Props = {
  tasks: Task[];
};

export default function Gantt({ tasks }: Props) {
  const [data, setData] = useState<Task[]>(tasks);
  const [taskWidth, setTaskWidth] = useState(300);
  const [startWidth, setStartWidth] = useState(90);
  const [endWidth, setEndWidth] = useState(90);
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("day");
  const [range, setRange] = useState({
    start: startOfDay(new Date(2026, 1, 1)), // 01/02/2026
    end: startOfDay(new Date(2026, 4, 1)), // 01/05/2026
  });
  const timelineRef = useRef<HTMLDivElement>(null);
  const startMonth = startOfMonth(range.start);
  const startDate = startOfDay(range.start);
  const totalDays = differenceInDays(range.end, range.start) + 1;
  const firstWeekStart = startOfWeek(startDate);

  const dates = Array.from({ length: totalDays }).map((_, i) =>
    addDays(startDate, i),
  );
  const totalWeeks =
    Math.ceil(differenceInDays(range.end, firstWeekStart) / 7) + 1;
  const weeks = Array.from({ length: totalWeeks }).map((_, i) =>
    addDays(firstWeekStart, i * 7),
  );

  const startResize = (e: React.MouseEvent, column: "task" | "start") => {
    const startX = e.clientX;

    const startWidthValue = column === "task" ? taskWidth : startWidth;

    const onMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      const newWidth = startWidthValue + delta;

      if (column === "task") {
        setTaskWidth(
          Math.min(MAX_TASK_WIDTH, Math.max(MIN_TASK_WIDTH, newWidth)),
        );
      }

      if (column === "start") {
        setStartWidth(
          Math.min(MAX_DATE_WIDTH, Math.max(MIN_DATE_WIDTH, newWidth)),
        );
      }
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const monthGroups = getMonthGroups(dates);
  const weekMonthGroups = getWeekMonthGroups(weeks);
  const totalMonthsView =
    differenceInMonths(range.end, startOfMonth(range.start)) + 1;
  const months = Array.from({ length: totalMonthsView }).map((_, i) =>
    addMonths(startOfMonth(range.start), i),
  );
  const dragInfo = useRef<DragInfo>(null);

  function updateTask(id: number, updater: (t: Task) => Task) {
    setData((prev) => prev.map((t) => (t.id === id ? updater(t) : t)));
  }

  function startDrag(e: React.MouseEvent, id: number, type: DragType) {
    dragInfo.current = {
      id,
      type,
      startX: e.clientX,
    };

    window.addEventListener("mousemove", onDrag);
    window.addEventListener("mouseup", stopDrag);
  }

  function onDrag(e: MouseEvent) {
    const info = dragInfo.current;
    if (!info) return;
    const deltaPx = e.clientX - info.startX;
    const deltaDays = Math.round(deltaPx / DAY_WIDTH);
    if (deltaDays === 0) return;
    dragInfo.current!.startX = e.clientX;
    if (info.type === "move") {
      updateTask(info.id, (t) => ({
        ...t,
        startDate: addDays(t.startDate, deltaDays),
        endDate: addDays(t.endDate, deltaDays),
      }));
    }
    if (info.type === "resize-left") {
      updateTask(info.id, (t) => ({
        ...t,
        startDate: addDays(t.startDate, deltaDays),
      }));
    }

    if (info.type === "resize-right") {
      updateTask(info.id, (t) => ({
        ...t,
        endDate: addDays(t.endDate, deltaDays),
      }));
    }
  }

  function stopDrag() {
    dragInfo.current = null;
    window.removeEventListener("mousemove", onDrag);
    window.removeEventListener("mouseup", stopDrag);
  }

  const tree = buildTree(data);

  const flatTasks = flatten(tree);

  function toggleExpand(id: number) {
    setData((prev) =>
      prev.map((t) => (t.id === id ? { ...t, expanded: !t.expanded } : t)),
    );
  }

  return (
    <div className="flex flex-col justify-center border rounded-xl overflow-hidden bg-white dark:bg-muted shadow-sm">
      <GanttToolbar
        title="Project Management"
        viewMode={viewMode}
        setViewMode={setViewMode}
        range={range}
        setRange={setRange}
      />

      <div className="flex flex-col md:flex-row ">
        {/* TASK LIST */}

        <GanttTaskList
          data={data}
          taskWidth={taskWidth}
          endWidth={endWidth}
          startWidth={startWidth}
          startResize={startResize}
          toggleExpand={toggleExpand}
        />

        {/* TIMELINE */}
        <GanttTimeline
          dates={dates}
          weeks={weeks}
          months={months}
          timelineRef={timelineRef}
          viewMode={viewMode}
          range={range}
          totalDays={totalDays}
          monthGroups={monthGroups}
          weekMonthGroups={weekMonthGroups}
          flatTasks={flatTasks}
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

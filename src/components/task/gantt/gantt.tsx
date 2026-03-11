"use client";

import { useState, useRef, useEffect } from "react";
import { differenceInDays, addDays, format } from "date-fns";
import {
  CalendarDays,
  CalendarRange,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { buildTree, flatten } from "@/src/helpers/ganttHelper";
import { startOfMonth, addMonths, differenceInMonths } from "date-fns";
import { Task } from "@/src/types/task";
import { Button } from "../../shadcn/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../shadcn/tooltip";

const DAY_WIDTH = 50;
const WEEK_WIDTH = 120;
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
  const timelineRef = useRef<HTMLDivElement>(null);
  const startMonth = new Date(2026, 0, 1);
  const startDate = new Date(2026, 1, 1);
  const totalDays = 90;
  const totalMonths = 12;

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
  }, [viewMode]);
  const dates = Array.from({ length: totalDays }).map((_, i) =>
    addDays(startDate, i),
  );
  const months = Array.from({ length: totalMonths }).map((_, i) =>
    addMonths(startOfMonth(startMonth), i),
  );
  const weeks = Array.from({ length: Math.ceil(totalDays / 7) }).map((_, i) =>
    addDays(startDate, i * 7),
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

  const tree = buildTree(data);

  const flatTasks = flatten(tree);

  const dragInfo = useRef<DragInfo>(null);

  function getMonthGroups(dates: Date[]) {
    const groups: { month: string; start: number; end: number }[] = [];

    let currentMonth: string | null = null;
    let start = 0;

    dates.forEach((date, i) => {
      const month = format(date, "yyyy-MM");

      if (month !== currentMonth) {
        if (currentMonth !== null) {
          groups.push({
            month: currentMonth,
            start,
            end: i - 1,
          });
        }

        currentMonth = month;
        start = i;
      }

      if (i === dates.length - 1) {
        groups.push({
          month,
          start,
          end: i,
        });
      }
    });

    return groups;
  }

  const monthGroups = getMonthGroups(dates);

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

  function toggleExpand(id: number) {
    setData((prev) =>
      prev.map((t) => (t.id === id ? { ...t, expanded: !t.expanded } : t)),
    );
  }

  const todayOffset =
    viewMode === "day"
      ? differenceInDays(new Date(), startDate) * DAY_WIDTH
      : differenceInMonths(new Date(), startMonth) * MONTH_WIDTH;
  return (
    <div className="flex flex-col justify-center border rounded-xl overflow-hidden bg-white dark:bg-muted shadow-sm">
      <div className="flex justify-between gap-2 border-b p-4">
        <h2 className="text-2xl font-bold">Project Management</h2>
        <TooltipProvider>
          <div className="flex items-center gap-2 bg-muted dark:bg-card p-1 rounded-lg">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={() => setViewMode("day")}
                  className={`
                    transition-all duration-200 hover:bg-transparent
                    ${
                      viewMode === "day"
                        ? "bg-green-100 text-green-700 shadow-md dark:bg-green-900 dark:text-green-200 dark:shadow-lg scale-100"
                        : "opacity-60 scale-95 dark:opacity-50"
                    }
                  `}
                >
                  Day
                </Button>
              </TooltipTrigger>

              <TooltipContent>Day view</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={() => setViewMode("week")}
                  className={`
                  transition-all duration-200 hover:bg-transparent
                  ${
                    viewMode === "week"
                      ? "bg-green-100 text-green-700 shadow-md dark:bg-green-900 dark:text-green-200 dark:shadow-lg scale-100"
                      : "opacity-60 scale-95 dark:opacity-50"
                  }
                `}
                >
                  Week
                </Button>
              </TooltipTrigger>

              <TooltipContent>Month view</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  onClick={() => setViewMode("month")}
                  className={`
            transition-all duration-200 hover:bg-transparent
            ${
              viewMode === "month"
                ? "bg-green-100 text-green-700 shadow-md dark:bg-green-900 dark:text-green-200 dark:shadow-lg scale-100"
                : "opacity-60 scale-95 dark:opacity-50"
            }
          `}
                >
                  Month
                </Button>
              </TooltipTrigger>

              <TooltipContent>Month view</TooltipContent>
            </Tooltip>
          </div>
        </TooltipProvider>
      </div>
      <div className="flex flex-col md:flex-row ">
        {/* TASK LIST */}

        <div className="min-w-[500px] border-r bg-gray-50 dark:bg-muted">
          {/* HEADER */}

          <div
            className="h-[calc(var(--gantt-height)*2)] grid items-center text-center text-sm font-semibold border-b "
            style={{
              gridTemplateColumns: `${taskWidth}px ${startWidth}px ${endWidth}px`,
            }}
          >
            <div className="relative border-r">
              Task
              <div
                onMouseDown={(e) => startResize(e, "task")}
                className="absolute right-0 top-0 w-1 h-full cursor-col-resize"
              />
            </div>

            <div className="relative border-r">
              Start
              <div
                onMouseDown={(e) => startResize(e, "start")}
                className="absolute right-0 top-0 w-1 h-full cursor-col-resize"
              />
            </div>

            <div>End</div>
          </div>

          {/* TASK ROWS */}

          {flatTasks.map((task) => {
            const hasChildren = data.some((t) => t.parentId === task.id);

            return (
              <div
                key={task.id}
                className="min-h-16 grid items-center border-b hover:bg-gray-100 hover:dark:bg-gray-900 hover:cursor-pointer text-sm py-1"
                style={{
                  gridTemplateColumns: `${taskWidth}px ${startWidth}px ${endWidth}px`,
                }}
              >
                <div
                  className="flex items-center gap-2"
                  style={{ paddingLeft: 16 + task.depth * 40 }}
                >
                  {hasChildren && (
                    <button
                      onClick={() => toggleExpand(task.id)}
                      className="text-xs w-4"
                    >
                      {task.expanded === false ? (
                        <ChevronUp size={14} />
                      ) : (
                        <ChevronDown size={14} />
                      )}
                    </button>
                  )}

                  <div className="flex flex-col leading-tight min-w-0">
                    <span className="font-medium truncate">{task.title}</span>

                    {task.description && (
                      <span className="text-[11px] text-gray-400 truncate">
                        {task.description}
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-center text-xs text-gray-500">
                  {format(task.startDate, "dd/MM")}
                </div>

                <div className="text-center text-xs text-gray-500">
                  {format(task.endDate, "dd/MM")}
                </div>
              </div>
            );
          })}
        </div>

        {/* TIMELINE */}

        <div ref={timelineRef} className="flex-1 overflow-x-auto relative">
          <div
            className="relative"
            style={{
              width:
                viewMode === "day"
                  ? totalDays * DAY_WIDTH
                  : totalMonths * MONTH_WIDTH,
            }}
          >
            {/* MONTH HEADER */}

            <div
              className="grid border-b bg-gray-50 dark:bg-muted h-(--gantt-height) items-center font-bold"
              style={{
                gridTemplateColumns: `repeat(${totalDays}, ${DAY_WIDTH}px)`,
              }}
            >
              {monthGroups.map((m, i) => (
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
            </div>

            {/* DAY HEADER */}

            <div className="grid border-b sticky top-0 bg-gray-50 dark:bg-border z-10  h-(--gantt-height) items-center text-sm text-center">
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
              ) : (
                <div
                  className="grid border-b sticky top-0 bg-gray-50 dark:bg-border z-10 h-(--gantt-height)"
                  style={{
                    gridTemplateColumns: `repeat(${months.length}, ${MONTH_WIDTH}px)`,
                  }}
                >
                  {months.map((m, i) => (
                    <div key={i} className="border-r text-center text-sm">
                      {format(m, "MMM yyyy")}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* TODAY MARKER */}

            <div
              className="absolute top-[calc(var(--gantt-height)*2-10px)] bottom-0 flex flex-col w-[100px] items-center z-20 pointer-events-none"
              style={{
                left:
                  todayOffset +
                  (viewMode === "day" ? DAY_WIDTH : MONTH_WIDTH) / 2 -
                  50,
              }}
            >
              {/* label */}
              <div className="text-[10px] text-white font-semibold p-1 bg-red-500 rounded-sm">
                {viewMode === "day" ? "Today" : "This Month"}
              </div>

              {/* line */}
              <div className="bg-red-400 w-[2px] flex-1" />
            </div>

            {/* TASK ROWS */}

            {flatTasks.map((task) => {
              const startOffset =
                viewMode === "day"
                  ? differenceInDays(task.startDate, startDate) * DAY_WIDTH
                  : differenceInMonths(task.startDate, startMonth) *
                    MONTH_WIDTH;

              const duration =
                viewMode === "day"
                  ? (differenceInDays(task.endDate, task.startDate) + 1) *
                    DAY_WIDTH
                  : (differenceInMonths(task.endDate, task.startDate) + 1) *
                    MONTH_WIDTH;

              return (
                <div key={task.id} className="relative min-h-16 border-b">
                  <div
                    className="absolute h-12 rounded-lg shadow-sm bg-indigo-500 hover:bg-indigo-600 flex items-center px-2 text-xs text-white cursor-move transition"
                    style={{
                      left: startOffset,
                      width: duration,
                      top: 6,
                    }}
                    onMouseDown={(e) => startDrag(e, task.id, "move")}
                  >
                    {task.title}
                    <div
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        startDrag(e, task.id, "resize-left");
                      }}
                      className="absolute left-0 top-0 w-2 h-full cursor-ew-resize"
                    />

                    <div
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        startDrag(e, task.id, "resize-right");
                      }}
                      className="absolute right-0 top-0 w-2 h-full cursor-ew-resize"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

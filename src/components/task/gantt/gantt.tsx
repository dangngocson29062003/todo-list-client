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
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../../shadcn/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../shadcn/tooltip";
import { priorityColorMap } from "../../common/priority-badge";
import GanttToolbar from "./ganttToolbar";

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
    start: new Date(2026, 1, 1), // 01/02/2026
    end: new Date(2026, 4, 1), // 01/05/2026
  });
  const timelineRef = useRef<HTMLDivElement>(null);
  const startMonth = startOfMonth(range.start);
  const startDate = range.start;
  const totalDays = differenceInDays(range.end, range.start) + 1;
  const firstWeekStart = startOfWeek(startDate);
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

  // Tính toán lại số tuần dựa trên phạm vi mới
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

  let todayOffset = 0;

  if (viewMode === "day") {
    todayOffset = differenceInDays(new Date(), startDate) * DAY_WIDTH + 25;
  }

  if (viewMode === "week") {
    const daysFromWeekStart = differenceInDays(new Date(), firstWeekStart);
    todayOffset = daysFromWeekStart * (WEEK_WIDTH / 7);
  }

  if (viewMode === "month") {
    const monthDiff = differenceInMonths(new Date(), startMonth);
    const daysInTodayMonth = differenceInDays(
      addMonths(startOfMonth(new Date()), 1),
      startOfMonth(new Date()),
    );
    const dayRatio = (new Date().getDate() - 1) / daysInTodayMonth;

    todayOffset = (monthDiff + dayRatio) * MONTH_WIDTH + 10;
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
                  : viewMode === "week"
                    ? weeks.length * WEEK_WIDTH
                    : totalMonths * MONTH_WIDTH,
            }}
          >
            {/* HEADER */}
            {viewMode !== "month" && (
              <div
                className="grid border-b bg-gray-50 dark:bg-muted h-(--gantt-height) items-center font-bold"
                style={{
                  gridTemplateColumns:
                    viewMode === "day"
                      ? `repeat(${totalDays}, ${DAY_WIDTH}px)`
                      : viewMode === "week"
                        ? `repeat(${weeks.length}, ${WEEK_WIDTH}px)`
                        : ``,
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
                        // gridColumn: start / end. Lưu ý: CSS Grid index bắt đầu từ 1.
                        // Cần +1 cho start và +2 cho end để bao phủ hết cột cuối cùng.
                        gridColumn: `${group.start + 1} / ${group.end + 2}`,
                      }}
                    >
                      {group.label}
                    </div>
                  ))}
              </div>
            )}

            {/* DAY HEADER */}

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
                    <div
                      key={i}
                      className="border-r text-center text-sm font-bold"
                    >
                      {format(m, "MMM yyyy")}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* TODAY MARKER */}

            <div
              className="absolute top-[calc(var(--gantt-height)*2-10px)] bottom-0 flex flex-col w-[100px] items-center z-20 select-none pointer-events-none"
              style={{
                left: todayOffset - 50,
              }}
            >
              {/* label */}
              <div className="text-[10px] text-white font-semibold p-1 bg-red-500 rounded-sm">
                Today
              </div>

              {/* line */}
              <div className="bg-red-400 w-[2px] flex-1" />
            </div>

            {/* TASK ROWS */}

            {flatTasks.map((task) => {
              let startOffset = 0;
              let duration = 0;

              if (viewMode === "day") {
                startOffset =
                  differenceInDays(task.startDate, startDate) * DAY_WIDTH;

                duration =
                  (differenceInDays(task.endDate, task.startDate) + 1) *
                  DAY_WIDTH;
              }

              if (viewMode === "week") {
                const weekIndex = differenceInWeeks(
                  task.startDate,
                  firstWeekStart,
                );

                const startOfCurrentWeek = addDays(
                  firstWeekStart,
                  weekIndex * 7,
                );

                const offsetDays = differenceInDays(
                  task.startDate,
                  startOfCurrentWeek,
                );

                startOffset =
                  weekIndex * WEEK_WIDTH +
                  offsetDays * (WEEK_WIDTH / 7) -
                  WEEK_WIDTH / 7;

                duration =
                  (differenceInDays(task.endDate, task.startDate) + 1) *
                  (WEEK_WIDTH / 7);
              }

              if (viewMode === "month") {
                // Tính xem task bắt đầu cách mốc startMonth bao nhiêu tháng (số thực)
                // Ví dụ: 1.5 tháng = 1 tháng + 15 ngày
                const daysInStartMonth = differenceInDays(
                  addMonths(startOfMonth(task.startDate), 1),
                  startOfMonth(task.startDate),
                );

                const monthDiff = differenceInMonths(
                  task.startDate,
                  startMonth,
                );
                const dayOffsetInMonth =
                  (task.startDate.getDate() - 1) / daysInStartMonth;

                startOffset = (monthDiff + dayOffsetInMonth) * MONTH_WIDTH;

                // Tính duration dựa trên tổng số ngày
                const taskDays =
                  differenceInDays(task.endDate, task.startDate) + 1;
                // Giả định trung bình 30 ngày/tháng để tính độ dài tương đối trong mode Month
                duration = (taskDays / 30) * MONTH_WIDTH;
              }

              return (
                <div key={task.id} className="relative min-h-16 border-b">
                  <div
                    className={`absolute h-12 rounded-lg shadow-sm flex items-center px-4 text-xs truncate select-none cursor-move transition
                              ${priorityColorMap[task.priority] || "bg-indigo-500 hover:bg-indigo-600"}`}
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
                      className="absolute left-0 top-0 w-2 h-full rounded-l-lg bg-muted-foreground/30 dark:bg-muted/50 cursor-ew-resize"
                    />

                    <div
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        startDrag(e, task.id, "resize-right");
                      }}
                      className="absolute right-0 top-0 w-2 h-full rounded-r-lg bg-muted-foreground/30 dark:bg-muted/50 cursor-ew-resize"
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

// src/hooks/useGanttDrag.ts
import { useRef, useCallback, useState } from "react";
import {
  addDays,
  isBefore,
  isAfter,
  differenceInDays,
  startOfMonth,
  addMonths,
  startOfWeek,
} from "date-fns";
import { Task } from "@/src/types/task";

type DragType = "move" | "resize-left" | "resize-right" | "create";

type DragInfo = {
  id: string;
  type: DragType;
  initialMouseDate: Date;
  initialStartDate: Date;
  initialEndDate: Date;
  parentId?: string;
} | null;

export function useGanttDrag(
  data: Task[],
  setData: React.Dispatch<React.SetStateAction<Task[]>>,
  dayWidth: number,
  weekWidth: number,
  monthWidth: number,
  viewMode: "day" | "week" | "month",
  chartStartDate: Date,

  onFinishCreate: (start: Date, end: Date) => void,
) {
  const dragInfo = useRef<DragInfo>(null);
  const lastDeltaDays = useRef<number>(0);
  const [ghostTask, setGhostTask] = useState<{ start: Date; end: Date } | null>(
    null,
  );
  const getDateFromX = useCallback(
    (x: number) => {
      if (viewMode === "day") {
        const deltaDays = x / dayWidth;
        return addDays(new Date(chartStartDate), deltaDays);
      }

      if (viewMode === "week") {
        const firstWeekStart = startOfWeek(chartStartDate);
        const unitWidth = weekWidth / 7;
        const totalDaysFromFirstWeek = (x + unitWidth) / unitWidth;

        return addDays(new Date(firstWeekStart), totalDaysFromFirstWeek);
      }

      if (viewMode === "month") {
        const monthIndex = Math.floor(x / monthWidth);
        const targetMonthStart = addMonths(
          startOfMonth(chartStartDate),
          monthIndex,
        );
        const remainingX = x % monthWidth;
        const daysInThisMonth = differenceInDays(
          addMonths(targetMonthStart, 1),
          targetMonthStart,
        );
        const extraDays = (remainingX / monthWidth) * daysInThisMonth;

        return addDays(targetMonthStart, extraDays);
      }

      return new Date(chartStartDate);
    },
    [viewMode, dayWidth, weekWidth, monthWidth, chartStartDate],
  );

  const updateTaskAndChildren = (
    tasks: Task[],
    targetId: string,
    deltaDays: number,
    info: DragInfo,
  ): Task[] => {
    if (!info) return tasks;
    const getAllChildIds = (parentId: string): string[] => {
      const children = tasks.filter((t) => t.parentId === parentId);
      return children.reduce((acc, child) => {
        return [...acc, child.id, ...getAllChildIds(child.id)];
      }, [] as string[]);
    };

    const childIds = getAllChildIds(targetId);
    const parentOfTarget = info.parentId
      ? tasks.find((t) => t.id === info.parentId)
      : null;
    const subTasks = tasks.filter((t) => childIds.includes(t.id));

    const subTasksMinStart =
      subTasks.length > 0
        ? new Date(
            Math.min(...subTasks.map((t) => new Date(t.startDate).getTime())),
          )
        : null;
    const subTasksMaxEnd =
      subTasks.length > 0
        ? new Date(
            Math.max(...subTasks.map((t) => new Date(t.endDate).getTime())),
          )
        : null;

    let actualDelta = deltaDays;
    if (info.type === "move" && parentOfTarget) {
      const pStart = new Date(parentOfTarget.startDate);
      const pEnd = new Date(parentOfTarget.endDate);

      let newStart = addDays(info.initialStartDate, deltaDays);
      let newEnd = addDays(info.initialEndDate, deltaDays);

      if (isBefore(newStart, pStart)) {
        actualDelta = Math.round(
          (pStart.getTime() - info.initialStartDate.getTime()) /
            (24 * 3600 * 1000),
        );
      } else if (isAfter(newEnd, pEnd)) {
        actualDelta = Math.round(
          (pEnd.getTime() - info.initialEndDate.getTime()) / (24 * 3600 * 1000),
        );
      }
    }

    return tasks.map((t) => {
      if (t.id === targetId) {
        if (info.type === "move") {
          return {
            ...t,
            startDate: addDays(info.initialStartDate, actualDelta),
            endDate: addDays(info.initialEndDate, actualDelta),
          };
        }
        if (info.type === "resize-left") {
          let newStart = addDays(info.initialStartDate, actualDelta);
          if (isAfter(newStart, info.initialEndDate))
            newStart = info.initialEndDate;
          if (subTasksMinStart && isAfter(newStart, subTasksMinStart))
            newStart = subTasksMinStart;
          if (
            parentOfTarget &&
            isBefore(newStart, new Date(parentOfTarget.startDate))
          ) {
            newStart = new Date(parentOfTarget.startDate);
          }
          return { ...t, startDate: newStart };
        }
        if (info.type === "resize-right") {
          let newEnd = addDays(info.initialEndDate, actualDelta);
          if (isBefore(newEnd, info.initialStartDate))
            newEnd = info.initialStartDate;
          if (subTasksMaxEnd && isBefore(newEnd, subTasksMaxEnd))
            newEnd = subTasksMaxEnd;
          if (
            parentOfTarget &&
            isAfter(newEnd, new Date(parentOfTarget.endDate))
          ) {
            newEnd = new Date(parentOfTarget.endDate);
          }
          return { ...t, endDate: newEnd };
        }
      }
      if (childIds.includes(t.id) && info.type === "move") {
        const originalSub = data.find((item) => item.id === t.id);
        if (originalSub) {
          return {
            ...t,
            startDate: addDays(new Date(originalSub.startDate), actualDelta),
            endDate: addDays(new Date(originalSub.endDate), actualDelta),
          };
        }
      }
      return t;
    });
  };

  const startDrag = useCallback(
    (e: React.MouseEvent, id: string, type: DragType) => {
      const container = (e.currentTarget as HTMLElement).closest(
        ".gantt-container",
      ) as HTMLElement;
      if (!container) return;

      const getX = (clientX: number) =>
        clientX - container.getBoundingClientRect().left + container.scrollLeft;

      const initialX = getX(e.clientX);
      const initialMouseDate = getDateFromX(initialX);
      if (type === "create") {
        const onDragCreate = (moveEvent: MouseEvent) => {
          const currentX = getX(moveEvent.clientX);
          const currentMouseDate = getDateFromX(currentX);
          let start = isBefore(initialMouseDate, currentMouseDate)
            ? initialMouseDate
            : currentMouseDate;
          let end = isBefore(initialMouseDate, currentMouseDate)
            ? currentMouseDate
            : initialMouseDate;
          setGhostTask({
            start: new Date(start.setHours(0, 0, 0, 0)),
            end: new Date(end.setHours(0, 0, 0, 0)),
          });
        };

        const stopDragCreate = () => {
          window.removeEventListener("mousemove", onDragCreate);
          window.removeEventListener("mouseup", stopDragCreate);
          setGhostTask((current) => {
            if (current) onFinishCreate(current.start, current.end);
            return null;
          });
          document.body.style.userSelect = "";
        };

        document.body.style.userSelect = "none";
        window.addEventListener("mousemove", onDragCreate);
        window.addEventListener("mouseup", stopDragCreate);
        return;
      }
      const task = data.find((t) => t.id === id);
      if (!task) return;

      dragInfo.current = {
        id,
        type,
        initialMouseDate,
        initialStartDate: new Date(task.startDate),
        initialEndDate: new Date(task.endDate),
        parentId: task.parentId as string,
      };

      lastDeltaDays.current = 0;
      document.body.style.userSelect = "none";

      const onDrag = (moveEvent: MouseEvent) => {
        const info = dragInfo.current;
        if (!info) return;

        const currentX = getX(moveEvent.clientX);
        const currentMouseDate = getDateFromX(currentX);
        const deltaDays = Math.round(
          (currentMouseDate.getTime() - info.initialMouseDate.getTime()) /
            (24 * 3600 * 1000),
        );

        if (deltaDays !== lastDeltaDays.current) {
          lastDeltaDays.current = deltaDays;
          setData((prev) =>
            updateTaskAndChildren(prev, info.id, deltaDays, info),
          );
        }
      };

      const stopDrag = () => {
        dragInfo.current = null;
        document.body.style.userSelect = "";
        window.removeEventListener("mousemove", onDrag);
        window.removeEventListener("mouseup", stopDrag);
      };

      window.addEventListener("mousemove", onDrag);
      window.addEventListener("mouseup", stopDrag);
    },
    [data, setData, getDateFromX, onFinishCreate],
  );

  return { startDrag, ghostTask };
}

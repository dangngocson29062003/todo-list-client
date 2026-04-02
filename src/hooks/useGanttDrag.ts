// src/hooks/useGanttDrag.ts
import { useRef, useCallback } from "react";
import { addDays, isBefore, isAfter } from "date-fns";
import { Task } from "@/src/types/task";

type DragType = "move" | "resize-left" | "resize-right";

type DragInfo = {
  id: string;
  type: DragType;
  initialMouseX: number;
  initialStartDate: Date;
  initialEndDate: Date;
  parentId?: string;
} | null;

export function useGanttDrag(
  data: Task[],
  setData: React.Dispatch<React.SetStateAction<Task[]>>,
  dayWidth: number,
) {
  const dragInfo = useRef<DragInfo>(null);
  const lastDeltaDays = useRef<number>(0);

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
          if (subTasksMinStart && isAfter(newStart, subTasksMinStart)) {
            newStart = subTasksMinStart;
          }
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
          if (subTasksMaxEnd && isBefore(newEnd, subTasksMaxEnd)) {
            newEnd = subTasksMaxEnd;
          }
          if (
            parentOfTarget &&
            isAfter(newEnd, new Date(parentOfTarget.endDate))
          ) {
            newEnd = new Date(parentOfTarget.endDate);
          }

          return { ...t, endDate: newEnd };
        }
      }
      if (childIds.includes(t.id)) {
        if (info.type === "move") {
          const originalSub = data.find((item) => item.id === t.id);
          if (originalSub) {
            return {
              ...t,
              startDate: addDays(new Date(originalSub.startDate), actualDelta),
              endDate: addDays(new Date(originalSub.endDate), actualDelta),
            };
          }
        }
      }

      return t;
    });
  };

  const startDrag = useCallback(
    (e: React.MouseEvent, id: string, type: DragType) => {
      const task = data.find((t) => t.id === id);
      if (!task) return;

      dragInfo.current = {
        id,
        type,
        initialMouseX: e.clientX,
        initialStartDate: new Date(task.startDate),
        initialEndDate: new Date(task.endDate),
        parentId: task.parentId as string,
      };

      lastDeltaDays.current = 0;
      document.body.style.userSelect = "none";

      const onDrag = (moveEvent: MouseEvent) => {
        const info = dragInfo.current;
        if (!info) return;

        const mouseDeltaPx = moveEvent.clientX - info.initialMouseX;
        const deltaDays = Math.round(mouseDeltaPx / dayWidth);

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
    [data, setData, dayWidth],
  );

  return { startDrag };
}

import { useState, useCallback } from "react";

const MIN_TASK_WIDTH = 200;
const MAX_TASK_WIDTH = 600;
const MIN_DATE_WIDTH = 80;
const MAX_DATE_WIDTH = 160;

export function useGanttResize() {
  const [taskWidth, setTaskWidth] = useState(300);
  const [startWidth, setStartWidth] = useState(90);

  const startResize = useCallback(
    (e: React.MouseEvent, column: "task" | "start") => {
      e.preventDefault();
      const startX = e.clientX;
      const initialWidth = column === "task" ? taskWidth : startWidth;

      const onMove = (moveEvent: MouseEvent) => {
        const delta = moveEvent.clientX - startX;
        const newWidth = initialWidth + delta;

        if (column === "task") {
          setTaskWidth(
            Math.min(MAX_TASK_WIDTH, Math.max(MIN_TASK_WIDTH, newWidth)),
          );
        } else {
          setStartWidth(
            Math.min(MAX_DATE_WIDTH, Math.max(MIN_DATE_WIDTH, newWidth)),
          );
        }
      };

      const onUp = () => {
        document.body.style.cursor = "default";
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };

      document.body.style.cursor = "col-resize";
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    },
    [taskWidth, startWidth],
  );

  return { taskWidth, startWidth, startResize };
}

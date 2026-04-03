// src/hooks/useGanttZoom.ts
import { useState, useCallback } from "react";

export type ViewMode = "day" | "week" | "month";

export function useGanttZoom() {
  const [viewMode, setViewMode] = useState<ViewMode>("week");
  const [widths, setWidths] = useState({
    dayWidth: 50,
    weekWidth: 140,
    monthWidth: 450,
  });

  const zoomIn = useCallback(() => {
    setViewMode((prev) => {
      if (prev === "month") return "week";
      if (prev === "week") return "day";
      return prev;
    });
  }, []);

  const zoomOut = useCallback(() => {
    setViewMode((prev) => {
      if (prev === "day") return "week";
      if (prev === "week") return "month";
      return prev;
    });
  }, []);

  return { viewMode, setViewMode, widths, zoomIn, zoomOut };
}

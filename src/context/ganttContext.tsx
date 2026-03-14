// src/context/GanttContext.tsx
import { createContext, useContext, useState } from "react";
import { Task } from "@/src/types/task";

const GanttContext = createContext<any>(null);

export function GanttProvider({
  tasks,
  children,
}: {
  tasks: Task[];
  children: React.ReactNode;
}) {
  const [data, setData] = useState(tasks);
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("day");
  const [range, setRange] = useState({
    start: new Date(2026, 1, 1),
    end: new Date(2026, 4, 1),
  });

  return (
    <GanttContext.Provider
      value={{ data, setData, viewMode, setViewMode, range, setRange }}
    >
      {children}
    </GanttContext.Provider>
  );
}

export const useGantt = () => useContext(GanttContext);

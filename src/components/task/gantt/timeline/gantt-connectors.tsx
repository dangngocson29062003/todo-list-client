"use client";

import { Task } from "@/src/types/task";
import { calculateTaskLayout } from "@/src/helpers/ganttHelper";

type Props = {
  flatTasks: Task[];
  viewMode: "day" | "week" | "month";
  // --- NHẬN WIDTH ĐỘNG TỪ PARENT ---
  dayWidth: number;
  weekWidth: number;
  monthWidth: number;

  startDate: Date;
  firstWeekStart: Date;
  startMonth: Date;
};

export default function GanttConnectors({
  flatTasks,
  viewMode,
  dayWidth,
  weekWidth,
  monthWidth,
  startDate,
  firstWeekStart,
  startMonth,
}: Props) {
  const ROW_HEIGHT = 64;
  const BAR_CENTER_OFFSET = 32;

  return (
    <svg className="absolute inset-0 pointer-events-none w-full h-full overflow-visible z-0">
      <defs>
        <marker
          id="dot"
          viewBox="0 0 10 10"
          refX="5"
          refY="5"
          markerWidth="4"
          markerHeight="4"
        >
          <circle cx="5" cy="5" r="5" fill="#3b82f6" />
        </marker>
        <marker
          id="arrow"
          viewBox="0 0 10 10"
          refX="8"
          refY="5"
          markerWidth="6"
          markerHeight="6"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#3b82f6" />
        </marker>
      </defs>

      {flatTasks.map((task, index) => {
        if (!task.parentId) return null;

        const parentIndex = flatTasks.findIndex((t) => t.id === task.parentId);
        if (parentIndex === -1) return null;

        const parentTask = flatTasks[parentIndex];
        const isDeepSubtask = !!parentTask.parentId;
        const parentLayout = calculateTaskLayout(
          parentTask,
          viewMode,
          startDate,
          firstWeekStart,
          startMonth,
          dayWidth,
          weekWidth,
          monthWidth,
        );
        const childLayout = calculateTaskLayout(
          task,
          viewMode,
          startDate,
          firstWeekStart,
          startMonth,
          dayWidth,
          weekWidth,
          monthWidth,
        );

        let x1: number;
        let xOffset: number;
        let x2: number;
        const y1 = parentIndex * ROW_HEIGHT + BAR_CENTER_OFFSET;

        if (isDeepSubtask) {
          x1 = parentLayout.startOffset + parentLayout.duration;
          xOffset = x1 + 20;
          x2 = childLayout.startOffset + childLayout.duration;
        } else {
          x1 = parentLayout.startOffset;
          xOffset = x1 - 20;
          x2 = childLayout.startOffset;
        }

        const y2 = index * ROW_HEIGHT + BAR_CENTER_OFFSET;

        return (
          <g key={`connector-${task.id}`}>
            <path
              d={`M ${x1} ${y1} H ${xOffset} V ${y2} H ${x2}`}
              stroke="#3b82f6"
              strokeWidth="2"
              fill="none"
              markerStart="url(#dot)"
              markerEnd="url(#arrow)"
              strokeLinejoin="round"
              strokeDasharray={isDeepSubtask ? "4 3" : "none"}
              style={{
                opacity: isDeepSubtask ? 0.7 : 1,
                transition: "d 0.1s ease-out",
              }}
            />
          </g>
        );
      })}
    </svg>
  );
}

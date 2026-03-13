import { calculateTaskLayout } from "@/src/helpers/ganttHelper";
import { priorityColorMap } from "../../common/priority-badge";

// src/components/gantt/Timeline.tsx
export default function Timeline({ tasks, viewMode, range, onDragStart }: any) {
  return (
    <div className="flex-1 overflow-x-auto relative">
      {tasks.map((task: any) => {
        const { left, width } = calculateTaskLayout(
          task,
          viewMode,
          range.start,
        );

        return (
          <div key={task.id} className="relative min-h-16 border-b">
            <div
              className="absolute h-12 bg-indigo-500 rounded-lg cursor-move"
              style={{ left, width, top: 6 }}
              onMouseDown={(e) => onDragStart(e, task.id, "move")}
            >
              {task.title}
              <div
                className="absolute left-0 w-2 h-full cursor-ew-resize"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  onDragStart(e, task.id, "resize-left");
                }}
              />
              <div
                className="absolute right-0 w-2 h-full cursor-ew-resize"
                onMouseDown={(e) => {
                  e.stopPropagation();
                  onDragStart(e, task.id, "resize-right");
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

import { format } from "date-fns";

import { Badge } from "@/src/components/shadcn/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/src/components/shadcn/tooltip";
import { calculateTaskLayout } from "@/src/helpers/ganttHelper";
import { Task } from "@/src/types/task";

type DragType = "move" | "resize-left" | "resize-right";

type Props = {
  flatTasks: Task[];
  viewMode: "day" | "week" | "month";

  startDate: Date;
  startMonth: Date;
  firstWeekStart: Date;

  startDrag: (e: React.MouseEvent, id: number, type: DragType) => void;

  priorityColorMap: Record<string, string>;
};

export default function GanttTaskRows({
  flatTasks,
  viewMode,
  startDate,
  startMonth,
  firstWeekStart,
  startDrag,
  priorityColorMap,
}: Props) {
  return (
    <>
      {flatTasks.map((task) => {
        let { startOffset, duration } = calculateTaskLayout(
          task,
          viewMode,
          startDate,
          firstWeekStart,
          startMonth,
        );
        return (
          <div key={task.id} className="relative min-h-16 border-b">
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className={`absolute h-12 rounded-lg shadow-sm flex items-center px-4 text-xs truncate select-none cursor-move transition ${
                    priorityColorMap[task.priority] ||
                    "bg-indigo-500 hover:bg-indigo-600"
                  }`}
                  style={{ left: startOffset, width: duration, top: 6 }}
                  onMouseDown={(e) => startDrag(e, task.id, "move")}
                >
                  {task.title}
                  {/* Các div resize giữ nguyên ở đây */}
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
              </TooltipTrigger>

              <TooltipContent
                side="right"
                sideOffset={10}
                className="flex shadow flex-col gap-1 p-2"
              >
                <div className="flex items-center gap-2">
                  <h2 className="font-bold truncate">{task.title}</h2>
                  <Badge className={`${priorityColorMap[task.priority]}`}>
                    {task.priority}
                  </Badge>
                </div>

                <div className="text-xs font-bold">
                  {format(task.startDate, "MMM dd")} -{" "}
                  {format(task.endDate, "MMM dd")}
                </div>
                <div className="flex gap-1">
                  <div className="flex size-5 items-center justify-center rounded-full bg-muted-foreground   dark:bg-sidebar-primary dark:text-sidebar-primary-foreground">
                    D
                  </div>
                  <div className="flex size-5 items-center justify-center rounded-full bg-muted-foreground   dark:bg-sidebar-primary dark:text-sidebar-primary-foreground">
                    D
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        );
      })}
    </>
  );
}

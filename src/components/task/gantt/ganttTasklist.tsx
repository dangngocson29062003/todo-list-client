import { format } from "date-fns";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Task } from "@/src/types/task";
import { buildTree, flatten } from "@/src/helpers/ganttHelper";

type Props = {
  data: Task[];
  taskWidth: number;
  startWidth: number;
  endWidth: number;

  startResize: (e: React.MouseEvent, column: "task" | "start") => void;
  toggleExpand: (id: string) => void;
};

export default function GanttTaskList({
  data,
  taskWidth,
  startWidth,
  endWidth,
  startResize,
  toggleExpand,
}: Props) {
  const tree = buildTree(data);

  const flatTasks = flatten(tree);
  return (
    <div className="min-w-[500px] border-r bg-muted dark:bg-muted/50">
      {/* HEADER */}

      <div
        className="h-[calc(var(--gantt-height)*2)] grid items-center text-center text-sm font-semibold border-b"
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
            {/* TASK NAME */}
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
                <span className="font-medium truncate">{task.name}</span>

                {task.description && (
                  <span className="text-[11px] text-gray-400 truncate">
                    {task.description}
                  </span>
                )}
              </div>
            </div>

            {/* START DATE */}

            <div className="text-center text-xs text-gray-500">
              {format(task.startDate, "dd/MM")}
            </div>

            {/* END DATE */}

            <div className="text-center text-xs text-gray-500">
              {format(task.endDate, "dd/MM")}
            </div>
          </div>
        );
      })}
    </div>
  );
}

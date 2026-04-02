"use client";

import React from "react";
import { format } from "date-fns";
import { ChevronDown, ChevronRight, Plus } from "lucide-react"; // Thêm Plus icon
import { Task } from "@/src/types/task";
import { Button } from "../../shadcn/button";

interface GanttTask extends Task {
  depth: number;
  expanded?: boolean;
}

type Props = {
  flatTasks: GanttTask[];
  allTasks: Task[];
  taskWidth: number;
  startWidth: number;
  endWidth: number;
  startResize: (e: React.MouseEvent, column: "task" | "start") => void;
  toggleExpand: (id: string) => void;
  onAddTask: (parentId: string) => void;
};

const GanttTaskList = React.memo(function GanttTaskList({
  flatTasks,
  allTasks,
  taskWidth,
  startWidth,
  endWidth,
  startResize,
  toggleExpand,
  onAddTask,
}: Props) {
  return (
    <div className="border-r bg-muted/30 dark:bg-muted/10 shrink-0">
      <div
        className="h-[calc(var(--gantt-height)*2)] grid items-center text-center text-sm font-semibold border-b bg-muted/50"
        style={{
          gridTemplateColumns: `${taskWidth}px ${startWidth}px ${endWidth}px`,
        }}
      >
        <div className="relative h-full flex items-center justify-center">
          Task
          <div
            onMouseDown={(e) => startResize(e, "task")}
            className="resizer"
          />
        </div>
        <div className="relative h-full flex items-center justify-center">
          Start
          <div
            onMouseDown={(e) => startResize(e, "start")}
            className="resizer"
          />
        </div>
        <div>End</div>
      </div>
      <div className="flex flex-col">
        {flatTasks.map((task) => {
          const hasChildren = allTasks.some((t) => t.parentId === task.id);

          return (
            <div
              key={task.id}
              className="group h-16 grid items-center border-b hover:bg-accent/50 transition-colors text-sm"
              style={{
                gridTemplateColumns: `${taskWidth}px ${startWidth}px ${endWidth}px`,
              }}
            >
              <div
                className="relative flex items-center gap-4 h-full overflow-hidden pr-2"
                style={{ paddingLeft: 12 + (task.depth || 0) * 20 }}
              >
                <div className="w-5 flex shrink-0 items-center justify-center">
                  {hasChildren ? (
                    <button
                      onClick={() => toggleExpand(task.id)}
                      className="hover:bg-muted p-1 rounded"
                    >
                      {task.expanded ? (
                        <ChevronDown size={14} />
                      ) : (
                        <ChevronRight size={14} />
                      )}
                    </button>
                  ) : (
                    <div className="w-4 h-4" />
                  )}
                </div>
                <div className="flex items-center justify-between w-full min-w-0 group/info">
                  <div className="flex flex-col leading-tight min-w-0">
                    <span className="font-medium truncate">{task.name}</span>
                    {task.description && (
                      <span className="text-[10px] text-muted-foreground truncate">
                        {task.description}
                      </span>
                    )}
                  </div>
                </div>
                {(task.depth || 0) < 2 && (
                  <Button
                    variant={"secondary"}
                    size={"icon-xs"}
                    onClick={() => onAddTask(task.id)}
                    className="cursor-pointer"
                    title={`Add subtask level ${(task.depth || 0) + 1}`}
                  >
                    <Plus className="size-3" />
                  </Button>
                )}
                <div
                  onMouseDown={(e) => startResize(e, "task")}
                  className="resizer"
                />
              </div>
              <div className="relative text-center text-xs text-muted-foreground h-full flex items-center justify-center">
                <div
                  onMouseDown={(e) => startResize(e, "start")}
                  className="resizer"
                />
                {format(new Date(task.startDate), "dd/MM")}
              </div>
              <div className="relative text-center text-xs text-muted-foreground h-full flex items-center justify-center">
                {format(new Date(task.endDate), "dd/MM")}
              </div>
            </div>
          );
        })}
        <div
          className="group h-12 grid items-center border-b bg-background/50 hover:bg-accent/30 transition-colors cursor-crosshair"
          style={{
            gridTemplateColumns: `${taskWidth}px ${startWidth}px ${endWidth}px`,
          }}
        >
          <div className="flex items-center gap-3 h-full px-4 text-muted-foreground">
            <div className="flex items-center justify-center w-5 h-5 rounded-md border border-dashed border-muted-foreground/50">
              <Plus className="size-3" />
            </div>
            <span className="text-[11px] font-medium uppercase tracking-tight opacity-70 group-hover:opacity-100 transition-opacity">
              Drag on right to create
            </span>
          </div>
          <div className="border-l border-transparent h-full" />
          <div className="border-l border-transparent h-full" />
        </div>
      </div>
    </div>
  );
});

export default GanttTaskList;

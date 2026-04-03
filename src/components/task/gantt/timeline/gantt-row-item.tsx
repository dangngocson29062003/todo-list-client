"use client";

import { format } from "date-fns";
import { PriorityBadge } from "@/src/components/priority-badge";
import { Button } from "@/src/components/shadcn/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/shadcn/popover";
import { calculateTaskLayout } from "@/src/helpers/ganttHelper";
import { Task } from "@/src/types/task";
import { Calendar, Info, RotateCcw, Save } from "lucide-react";
import React from "react";
import { AssigneeStack } from "../../assignee-stack";

type DragType = "move" | "resize-left" | "resize-right";

export const GanttTaskRowItem = React.memo(
  ({
    task,
    viewMode,
    dayWidth,
    weekWidth,
    monthWidth,
    startDate,
    firstWeekStart,
    startMonth,
    isDirectlyChanged,
    hasChangedParent,
    priorityColorMap,
    startDrag,
    onReset,
    onSave,
  }: {
    task: Task;
    viewMode: "day" | "week" | "month";
    dayWidth: number;
    weekWidth: number;
    monthWidth: number;
    startDate: Date;
    startMonth: Date;
    firstWeekStart: Date;
    isDirectlyChanged: boolean;
    hasChangedParent: boolean;
    priorityColorMap: Record<string, { color: string; label: string }>;
    startDrag: (e: React.MouseEvent, id: string, type: DragType) => void;
    onReset: (id: string) => void;
    onSave: (id: string) => void;
  }) => {
    const { startOffset, duration } = calculateTaskLayout(
      task,
      viewMode,
      startDate,
      firstWeekStart,
      startMonth,
      dayWidth,
      weekWidth,
      monthWidth,
    );

    const shouldShowSave = isDirectlyChanged && !hasChangedParent;

    return (
      <div className="relative min-h-16 border-b group">
        {shouldShowSave && (
          <div
            className="absolute z-50 flex items-center gap-1.5 animate-in fade-in zoom-in"
            style={{
              left: startOffset + duration + 12,
              top: "50%",
              transform: "translateY(-50%)",
            }}
          >
            <Button
              size="icon-lg"
              variant="outline"
              className="rounded-full shadow-lg text-blue-700 hover:text-blue-900 transition-transform hover:scale-110 bg-background"
              onClick={(e) => {
                e.stopPropagation();
                onSave(task.id);
              }}
            >
              <Save className="size-4" />
            </Button>
            <Button
              size="icon-lg"
              variant="outline"
              className="rounded-full shadow-lg text-orange-600 transition-transform hover:scale-110 bg-background"
              title="Reset changes"
              onClick={(e) => {
                e.stopPropagation();
                onReset(task.id);
              }}
            >
              <RotateCcw className="size-4" />
            </Button>
          </div>
        )}

        <Popover>
          <PopoverTrigger asChild>
            <div
              className={`absolute h-12 rounded-lg shadow-sm flex items-center px-4 text-xs truncate select-none transition group/task cursor-pointer active:cursor-grabbing ${
                (priorityColorMap[task.priority].color as string) ||
                "bg-indigo-500 hover:bg-indigo-600"
              }`}
              style={{
                left: startOffset,
                width: duration,
                top: 6,
                transition: "left 0.1s ease-out, width 0.1s ease-out",
              }}
              onMouseDown={(e) => startDrag(e, task.id, "move")}
            >
              {((viewMode === "day" && duration > 80) ||
                viewMode === "week" ||
                viewMode === "month") && (
                <span className="truncate w-full pr-4 font-medium">
                  {task.name}
                </span>
              )}
              <div
                className={`absolute top-1/2 -translate-y-1/2 flex items-center gap-1.5 opacity-0 group-hover/task:opacity-100 transition-all duration-200 pointer-events-none text-black dark:text-white font-medium whitespace-nowrap
                ${
                  viewMode === "week" || viewMode === "month" || duration >= 120
                    ? "right-3"
                    : "left-1/2 -translate-x-1/2"
                }`}
              >
                <Info className="size-4 shrink-0" />
              </div>
              <div
                onMouseDown={(e) => {
                  e.stopPropagation();
                  startDrag(e, task.id, "resize-left");
                }}
                className="absolute left-0 top-0 w-2 h-full rounded-l-lg bg-black/10 hover:bg-black/20 cursor-ew-resize"
              />
              <div
                onMouseDown={(e) => {
                  e.stopPropagation();
                  startDrag(e, task.id, "resize-right");
                }}
                className="absolute right-0 top-0 w-2 h-full rounded-r-lg bg-black/10 hover:bg-black/20 cursor-ew-resize"
              />
            </div>
          </PopoverTrigger>

          <PopoverContent
            side="left"
            className="flex shadow flex-col gap-2 p-2 w-64"
          >
            <div className="flex items-center justify-between gap-2">
              <h2 className="font-bold truncate">{task.name}</h2>
              <PriorityBadge priority={task.priority} />
            </div>
            <div className="flex items-center gap-2 text-xs font-bold">
              <Calendar className="size-4 text-muted-foreground" />
              {format(new Date(task.startDate), "MMM dd")} -{" "}
              {format(new Date(task.endDate), "MMM dd, yyyy")}
            </div>
            <div className="pt-1">
              <AssigneeStack assignees={task.assignees} />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  },
);

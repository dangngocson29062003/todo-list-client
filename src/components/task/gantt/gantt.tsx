"use client";

import {
  buildTree,
  flatten,
  getAllDescendantIds,
} from "@/src/helpers/ganttHelper";
import { Task } from "@/src/types/task";
import { addMonths, subMonths } from "date-fns";
import { useCallback, useMemo, useRef, useState } from "react";

import { useGanttDrag } from "@/src/hooks/useGanttDrag";
import { useGanttResize } from "@/src/hooks/useGanttResize";
import { useGanttTime } from "@/src/hooks/useGanttTime";
import CreateTaskModal from "../create-task-modal";
import GanttTaskList from "./gantt-task-list";
import GanttToolbar from "./gantt-toolbar";
import GanttTimeline from "./timeline/gantt-timeline";
import { toast } from "sonner";
import { Button } from "../../shadcn/button";
import { Check, Loader2, Save } from "lucide-react";
import { useProject } from "@/src/context/projectContext";
const priorityConfig: Record<string, { color: string; label: string }> = {
  LOW: {
    color: "bg-slate-500/10 text-slate-500 border-slate-500/20",
    label: "Low",
  },
  MEDIUM: {
    color: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    label: "Medium",
  },
  HIGH: {
    color: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    label: "High",
  },
  URGENT: {
    color: "bg-red-500/10 text-red-500 border-red-500/20",
    label: "Urgent",
  },
};
const DAY_WIDTH = 50;
type Props = {
  tasks: Task[];
};
export default function Gantt({ tasks }: Props) {
  const { project } = useProject();
  const [currentOriginTasks, setCurrentOriginTasks] = useState(tasks);

  const [data, setData] = useState<Task[]>(() =>
    currentOriginTasks.map((task) => ({ ...task, expanded: true })),
  );
  const [viewMode, setViewMode] = useState<"day" | "week" | "month">("day");
  const [range, setRange] = useState({
    start: subMonths(new Date(), 2),
    end: addMonths(new Date(), 2),
  });
  const { taskWidth, startWidth, startResize } = useGanttResize();
  const timeContext = useGanttTime(range, viewMode);
  const { startDrag } = useGanttDrag(data, setData, DAY_WIDTH);
  const flatTasks = useMemo(() => flatten(buildTree(data)), [data]);
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [parentTaskId, setParentTaskId] = useState<string | null>(null);
  const [parentDates, setParentDates] = useState<{ start?: Date; end?: Date }>(
    {},
  );

  const changedTaskIds = useMemo(() => {
    return data
      .filter((current) => {
        const original = currentOriginTasks.find((t) => t.id === current.id);
        if (!original) return false;
        return (
          new Date(current.startDate).getTime() !==
            new Date(original.startDate).getTime() ||
          new Date(current.endDate).getTime() !==
            new Date(original.endDate).getTime()
        );
      })
      .map((t) => t.id);
  }, [data, currentOriginTasks]);
  const handleReset = (taskId: string) => {
    setData((prevData) => {
      const allDescendantIds = getAllDescendantIds(prevData, taskId);
      const idsToReset = [taskId, ...allDescendantIds];
      return prevData.map((currentTask) => {
        if (idsToReset.includes(currentTask.id)) {
          const original = tasks.find((t) => t.id === currentTask.id);
          if (original) {
            return {
              ...original,
              expanded: currentTask.expanded,
            };
          }
        }
        return currentTask;
      });
    });
  };
  const handleOpenCreateModal = (parentId: string | null = null) => {
    setParentTaskId(parentId);
    if (parentId) {
      const parentTask = data.find((t) => t.id === parentId);
      if (parentTask) {
        setParentDates({
          start: new Date(parentTask.startDate),
          end: new Date(parentTask.endDate),
        });
      }
    } else {
      setParentDates({});
    }
    setIsModalOpen(true);
  };
  const toggleExpand = useCallback((id: string) => {
    setData((prev) =>
      prev.map((t) => (t.id === id ? { ...t, expanded: !t.expanded } : t)),
    );
  }, []);
  const handleSave = async (taskId: string) => {
    const descendantIds = getAllDescendantIds(data, taskId);
    const allIdsToSave = [taskId, ...descendantIds];
    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("Authentication required. Please log in.");
      return;
    }

    const tasksToUpdate = data.filter(
      (t) => allIdsToSave.includes(t.id) && changedTaskIds.includes(t.id),
    );

    if (tasksToUpdate.length === 0) return;
    const savePromise = async () => {
      await Promise.all(
        tasksToUpdate.map((task) =>
          fetch(`/api/projects/${project.id}/tasks/${task.id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              startDate: task.startDate,
              endDate: task.endDate,
            }),
          }).then((res) => {
            if (!res.ok) throw new Error("Failed to update some tasks");
            return res.json();
          }),
        ),
      );
      setCurrentOriginTasks((prev) =>
        prev.map((origin) => {
          const updated = tasksToUpdate.find((u) => u.id === origin.id);
          return updated
            ? {
                ...origin,
                startDate: updated.startDate,
                endDate: updated.endDate,
              }
            : origin;
        }),
      );
    };
    toast.promise(savePromise(), {
      loading: (
        <div className="flex items-center gap-2">
          <Loader2 className="size-4 text-muted-foreground animate-spin" />
          <p>Saving...</p>
        </div>
      ),
      success: (data) => (
        <div className="flex items-center gap-2">
          <Check className="size-4 text-green-400" />
          <p>Saved</p>
        </div>
      ),
      error: (err) =>
        err.message || "Failed to save changes. Please try again.",
      icon: null,
    });
  };
  return (
    <div className="flex flex-col justify-center border rounded-xl overflow-hidden bg-muted dark:bg-muted/50 shadow-sm">
      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        parentId={parentTaskId as string}
        defaultStartDate={parentDates.start}
        defaultEndDate={parentDates.end}
        onCreated={(newTask) => {
          setData((prev) => [newTask, ...prev]);
          if (parentTaskId) {
            setData((prev) =>
              prev.map((t) =>
                t.id === parentTaskId ? { ...t, expanded: true } : t,
              ),
            );
          }
        }}
      />
      <GanttToolbar
        title="Project Management"
        viewMode={viewMode}
        setViewMode={setViewMode}
        range={range}
        setRange={setRange}
      />

      <div className="flex flex-col md:flex-row ">
        <GanttTaskList
          flatTasks={flatTasks}
          allTasks={data}
          taskWidth={taskWidth}
          startWidth={startWidth}
          endWidth={90}
          startResize={startResize}
          toggleExpand={toggleExpand}
          onAddTask={(id) => handleOpenCreateModal(id)}
        />
        <div
          ref={timelineContainerRef}
          className="flex-1 overflow-x-auto relative bg-background/50"
        >
          <GanttTimeline
            {...timeContext}
            timelineRef={timelineContainerRef}
            viewMode={viewMode}
            range={range}
            flatTasks={flatTasks}
            startDrag={startDrag}
            priorityColorMap={priorityConfig}
            changedTaskIds={changedTaskIds}
            onReset={handleReset}
            onSave={handleSave}
          />
        </div>
      </div>
    </div>
  );
}

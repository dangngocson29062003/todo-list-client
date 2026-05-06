"use client";

import { useProject } from "@/src/context/projectContext";
import { getTasks, handleDuplicateTask } from "@/src/lib/api-task";

import { Priority } from "@/src/types/enum";
import { Task } from "@/src/types/task";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { toast } from "sonner";
import CreateTaskModal from "../create-task-modal";
import { TaskEmptyState } from "../task-empty-state";
import { ListRow } from "./listRow";

export default function ListView() {
  const { project } = useProject();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [priority, setPriority] = useState<Priority>(Priority.LOW);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!project?.id) return;

      try {
        setLoading(true);
        setError(null);
        const data = await getTasks(project.id, {
          isParentOnly: true,
        });

        setTasks(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [project?.id]);

  const handleMoveTask = async (taskId: string, toPriority: Priority) => {
    if (!project?.id) return;

    const previousTasks = tasks;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, priority: toPriority } : task,
      ),
    );

    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("Unauthorized");

      const res = await fetch(`/api/projects/${project.id}/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          priority: toPriority,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Failed to update task");
      }

      const updatedTask = data?.data ?? data;
      if (updatedTask) {
        setTasks((prev) =>
          prev.map((task) => (task.id === taskId ? updatedTask : task)),
        );
      }
    } catch (error) {
      setTasks(previousTasks);
      console.error(error);
    }
  };
  const onDuplicate = async (taskId: string) => {
    if (!project?.id) return;
    try {
      const newTask = await handleDuplicateTask(taskId, project.id);
      setTasks((prev) => [newTask, ...prev]);
      toast.success("Duplicated");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center p-6 text-sm text-muted-foreground">
        <Loader2 className="size-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-sm text-red-500">{error}</div>;
  }

  return (
    <>
      <CreateTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        defaultPriority={priority}
        onCreated={(newTask) => {
          setTasks((prev) => [newTask, ...prev]);
        }}
      />

      {tasks.length === 0 ? (
        <TaskEmptyState
          onCreate={() => {
            setPriority(Priority.LOW);
            setIsModalOpen(true);
          }}
        />
      ) : (
        <DndProvider backend={HTML5Backend}>
          {(Object.values(Priority) as Priority[]).map((priority) => (
            <ListRow
              key={priority}
              priority={priority}
              tasks={tasks}
              moveTask={handleMoveTask}
              setIsModalNewTaskOpen={setIsModalOpen}
              setPriority={setPriority}
              onDuplicate={onDuplicate}
            />
          ))}
        </DndProvider>
      )}
    </>
  );
}

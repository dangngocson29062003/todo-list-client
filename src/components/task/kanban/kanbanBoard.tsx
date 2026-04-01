"use client";

import { Task } from "@/src/types/task";
import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { KanbanColumn } from "./kanbanColumn";
import { TaskStatus } from "@/src/types/enum";
import { Loader2 } from "lucide-react";
import { useProject } from "@/src/context/projectContext";
import CreateTaskModal from "../create-task-modal";
export default function KanbanBoard() {
  const { project } = useProject();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [status, setStatus] = useState<TaskStatus>(TaskStatus.TODO);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!project?.id) return;

      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        if (!token) throw new Error("Unauthorized");

        const res = await fetch(`/api/projects/${project.id}/tasks`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          cache: "no-store",
        });

        const result = await res.json().catch(() => null);

        if (!res.ok) {
          throw new Error(result?.error || "Failed to get tasks");
        }

        const data = result?.data ?? result ?? [];
        setTasks(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to get tasks");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [project?.id]);

  const handleMoveTask = async (taskId: string, toStatus: TaskStatus) => {
    if (!project?.id) return;

    const previousTasks = tasks;

    setTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: toStatus } : task,
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
          status: toStatus,
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Failed to update task");
      }
      console.log(data.data);
      setTasks((prev) =>
        prev.map((task) => (task.id === taskId ? data.data : task)),
      );
    } catch (error) {
      setTasks(previousTasks);
      console.error(error);
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
        defaultStatus={status}
        onCreated={(newTask) => {
          setTasks((prev) => [newTask, ...prev]);
        }}
      />
      <DndProvider backend={HTML5Backend}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {Object.values(TaskStatus).map((status) => (
            <KanbanColumn
              key={status}
              status={status}
              tasks={tasks || []}
              moveTask={handleMoveTask}
              setIsModalNewTaskOpen={() => console.log("open modal")}
              setStatus={setStatus}
            />
          ))}
        </div>
      </DndProvider>
    </>
  );
}

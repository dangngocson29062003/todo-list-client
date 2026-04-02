"use client";
import Gantt from "@/src/components/task/gantt/gantt";
import { useProject } from "@/src/context/projectContext";
import { Priority, TaskStatus } from "@/src/types/enum";
import { Task } from "@/src/types/task";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
export default function TimeLine() {
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

  // const handleMoveTask = async (taskId: string, toPriority: Priority) => {
  //   if (!project?.id) return;

  //   const previousTasks = tasks;

  //   setTasks((prev) =>
  //     prev.map((task) =>
  //       task.id === taskId ? { ...task, priority: toPriority } : task,
  //     ),
  //   );

  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token) throw new Error("Unauthorized");

  //     const res = await fetch(`/api/projects/${project.id}/tasks/${taskId}`, {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //       body: JSON.stringify({
  //         priority: toPriority,
  //       }),
  //     });

  //     const data = await res.json().catch(() => null);

  //     if (!res.ok) {
  //       throw new Error(data?.error || "Failed to update task");
  //     }

  //     const updatedTask = data?.data ?? data;
  //     if (updatedTask) {
  //       setTasks((prev) =>
  //         prev.map((task) => (task.id === taskId ? updatedTask : task)),
  //       );
  //     }
  //   } catch (error) {
  //     setTasks(previousTasks);
  //     console.error(error);
  //   }
  // };

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
  return <Gantt tasks={tasks} />;
}

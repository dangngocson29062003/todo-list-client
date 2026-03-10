"use client";

import { Task, TaskStatus } from "@/src/types/task";
import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { KanbanColumn } from "./kanbanColumn";
const taskStatus = ["TODO", "IN_PROGRESS", "REVIEW", "DONE"];
const initialTasks: Task[] = [
  {
    id: 1,
    title: "Design login page",
    description: "Create UI for login and register pages",
    tags: "frontend,ui",
    priority: "HIGH",
    status: TaskStatus.TODO,
  },
  {
    id: 2,
    title: "Setup Spring Boot API",
    description: "Initialize project structure and authentication APIs",
    tags: "backend,api",
    priority: "HIGH",
    status: TaskStatus.IN_PROGRESS,
  },
  {
    id: 3,
    title: "Implement task service",
    description: "Create CRUD endpoints for tasks",
    tags: "backend",
    priority: "MEDIUM",
    status: TaskStatus.REVIEW,
  },
  {
    id: 4,
    title: "Connect frontend with APIIIIIIIIIIIIIII",
    description: "Integrate task APIs with Next.js frontend",
    tags: "frontend,api",
    priority: "MEDIUM",
    status: TaskStatus.TODO,
  },
  {
    id: 5,
    title: "Add drag and drop",
    description: "Implement kanban drag and drop using dnd-kit",
    tags: "frontend,kanban",
    priority: "LOW",
    status: TaskStatus.DONE,
  },
];
export default function KanbanBoard() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  useEffect(() => {
    console.log(tasks);
  }, [tasks]);
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2 xl:grid-cols-4">
        {Object.values(TaskStatus).map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasks || []}
            moveTask={(taskId, toStatus) => {
              setTasks((prev) =>
                prev.map((task) =>
                  task.id === taskId ? { ...task, status: toStatus } : task,
                ),
              );
            }}
            setIsModalNewTaskOpen={() => console.log("open modal")}
          />
        ))}
      </div>
    </DndProvider>
  );
}

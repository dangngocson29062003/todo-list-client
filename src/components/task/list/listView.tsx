"use client";

import { Task, TaskStatus } from "@/src/types/task";
import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { ListRow } from "./listRow";
const taskStatus = ["TODO", "IN_PROGRESS", "REVIEW", "DONE"];
const initialTasks: Task[] = [
  {
    id: 1,
    title: "Design login page",
    description: "Create UI for login and register pages",
    tags: "frontend,ui",
    priority: "HIGH",
    status: TaskStatus.TODO,
    type: "task",
    progress: 45,
    parentId: null,
    startDate: new Date(2026, 2, 10),
    endDate: new Date(2026, 2, 14),
  },
  {
    id: 2,
    title: "Setup Spring Boot API",
    description: "Initialize project structure and authentication APIs",
    tags: "backend,api",
    priority: "HIGH",
    status: TaskStatus.IN_PROGRESS,
    type: "task",
    progress: 45,
    parentId: 1,
    startDate: new Date(2026, 2, 9),
    endDate: new Date(2026, 2, 15),
  },
  {
    id: 3,
    title: "Implement task service",
    description: "Create CRUD endpoints for tasks",
    tags: "backend",
    priority: "MEDIUM",
    status: TaskStatus.REVIEW,
    type: "task",
    progress: 45,
    parentId: 1,
    startDate: new Date(2026, 2, 11),
    endDate: new Date(2026, 2, 16),
  },
  {
    id: 4,
    title: "Connect frontend with API",
    description: "Integrate task APIs with Next.js frontend",
    tags: "frontend,api",
    priority: "MEDIUM",
    status: TaskStatus.TODO,
    type: "task",
    progress: 45,
    parentId: null,
    startDate: new Date(2026, 2, 12),
    endDate: new Date(2026, 2, 18),
  },
  {
    id: 5,
    title: "Add drag and drop",
    description: "Implement kanban drag and drop using dnd-kit",
    tags: "frontend,kanban",
    priority: "LOW",
    status: TaskStatus.DONE,
    type: "task",
    progress: 45,
    parentId: 2,
    startDate: new Date(2026, 2, 5),
    endDate: new Date(2026, 2, 10),
  },
];
export default function ListView() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  useEffect(() => {
    console.log(tasks);
  }, [tasks]);
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="gap-4 p-4">
        {Object.values(TaskStatus).map((status) => (
          <ListRow
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

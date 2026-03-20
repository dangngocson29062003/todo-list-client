"use client";
import Gantt from "@/src/components/task/gantt/gantt";
import { Task, TaskStatus } from "@/src/types/task";
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
    expanded: true,
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
    expanded: true,
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
    expanded: true,
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
    expanded: true,
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
    expanded: true,
    startDate: new Date(2026, 2, 5),
    endDate: new Date(2026, 2, 10),
  },
];
export default function TimeLine() {
  return (
    <div className="w-full">
      <Gantt tasks={initialTasks} />
    </div>
  );
}

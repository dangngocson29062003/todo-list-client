import { Task, TaskStatus } from "@/src/types/task";
import { DataTable } from "./data-table";
import { columns } from "./columns";

export default function TaskTablePage() {
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
    return (
         <div className="container mx-auto py-10">
            <DataTable columns={columns} data={initialTasks} />
        </div>
    )
}
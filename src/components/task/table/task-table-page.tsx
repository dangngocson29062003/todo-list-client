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
        startDate: "2026-03-05",
        endDate: "2026-03-10",
        type: "",
        progress: 0,
        isDisabled: false,
        assignees: [
          {name: "John Doe"},
          { name: "Anna"},
          { name: "Bob", avatar: "https://i.pravatar.cc/150?img=3" },
          { name: "Alice", avatar: "https://i.pravatar.cc/150?img=4" },
        ]
      },
      {
        id: 2,
        title: "Setup Spring Boot API",
        description: "Initialize project structure and authentication APIs",
        tags: "backend,api",
        priority: "HIGH",
        status: TaskStatus.IN_PROGRESS,
        startDate: "2026-03-05",
        endDate: "2026-03-10",
        type: "",
        progress: 0,
        isDisabled: false
      },
      {
        id: 3,
        title: "Implement task service",
        description: "Create CRUD endpoints for tasks",
        tags: "backend",
        priority: "MEDIUM",
        status: TaskStatus.REVIEW,
        startDate: "2026-03-05",
        endDate: "2026-03-10",
        type: "",
        progress: 0,
        isDisabled: false
      },
      {
        id: 4,
        title: "Connect frontend with API",
        description: "Integrate task APIs with Next.js frontend",
        tags: "frontend,api",
        priority: "MEDIUM",
        status: TaskStatus.TODO,
        startDate: "2026-03-05",
        endDate: "2026-03-10",
        type: "",
        progress: 0,
        isDisabled: false
      },
      {
        id: 5,
        title: "Add drag and drop",
        description: "Implement kanban drag and drop using dnd-kit",
        tags: "frontend,kanban",
        priority: "LOW",
        status: TaskStatus.DONE,
        startDate: "2026-03-05",
        endDate: "2026-03-10",
        type: "",
        progress: 0,
        isDisabled: false
      },
    ];
    return (
         <div className="container mx-auto py-10">
            <DataTable columns={columns} data={initialTasks} />
        </div>
    )
}
import { Task } from "@/src/types/task";
import { MoreHorizontalIcon } from "lucide-react";

import { useDrag } from "react-dnd";
import { Badge } from "../../shadcn/badge";
import { Button } from "../../shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../shadcn/dropdown-menu";
import { TableCell, TableRow } from "../../shadcn/table";
import PriorityBadge from "../../common/priority-badge";

interface KanbanItem {
  task: Task;
}
export function ListItem({ task }: KanbanItem) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor: any) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const taskTagsSplit = task.tags ? task.tags.split(",") : [];

  //   const formattedStartDate = task.startDate
  //     ? format(new Date(task.startDate), "P")
  //     : "";
  //   const formattedDueDate = task.dueDate
  //     ? format(new Date(task.dueDate), "P")
  //     : "";

  //   const numberOfComments = (task.comments && task.comments.length) || 0;

  // const PriorityTag = ({ priority }: { priority: Task["priority"] }) => (
  //   <Badge
  //     className={`text-xs ${
  //       priority === "URGENT"
  //         ? "bg-red-200 text-red-700"
  //         : priority === "HIGH"
  //           ? "bg-yellow-200 text-yellow-700"
  //           : priority === "MEDIUM"
  //             ? "bg-green-200 text-green-700"
  //             : priority === "LOW"
  //               ? "bg-blue-200 text-blue-700"
  //               : "bg-gray-200 text-gray-700"
  //     }`}
  //   >
  //     {priority}
  //   </Badge>
  // );

  return (
    <TableRow
      ref={(instance) => {
        drag(instance);
      }}
      className={`mb-4 rounded-md cursor-grab active:cursor-grabbing shadow ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <TableCell className="text-muted-foreground">AB-001</TableCell>
      <TableCell>
        <h4 className="text-md truncate font-bold dark:text-white">
          {task.title}
        </h4>
      </TableCell>
      <TableCell>
        {task.priority && <PriorityBadge priority={task.priority} />}
      </TableCell>
      <TableCell>
        <p className="mt-2 text-sm text-gray-600 dark:text-neutral-500">
          {task.description}
        </p>
      </TableCell>
      <TableCell>
        <div className="flex gap-1">
          <div className="flex size-5 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
            D
          </div>
          <div className="flex size-5 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
            D
          </div>
        </div>
      </TableCell>
      <TableCell>Tue, 16 May 2026</TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreHorizontalIcon />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Edit</DropdownMenuItem>
            <DropdownMenuItem>Duplicate</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

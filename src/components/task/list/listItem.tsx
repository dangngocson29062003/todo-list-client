import { Task } from "@/src/types/task";
import {
  CheckCircle2,
  Copy,
  Eye,
  Link2,
  MoreHorizontalIcon,
  Pencil,
  Trash2,
  UserPlus,
} from "lucide-react";

import { useDrag } from "react-dnd";
import { Button } from "../../shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../shadcn/dropdown-menu";
import { TableCell, TableRow } from "../../shadcn/table";
import { format } from "date-fns";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../shadcn/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "../../shadcn/avatar";
import { PriorityBadge } from "../../priority-badge";

interface ListItemProps {
  task: Task;
}
export function ListItem({ task }: ListItemProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor: any) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <TableRow
      ref={(instance) => {
        drag(instance);
      }}
      className={`mb-4 rounded-md cursor-grab active:cursor-grabbing hover:bg-gray-100 hover:dark:bg-gray-900 shadow ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      <TableCell>
        <h4 className="text-md truncate font-bold dark:text-white">
          {task.name}
        </h4>
      </TableCell>
      <TableCell>{task.status}</TableCell>
      <TableCell>
        {task.priority && <PriorityBadge priority={task.priority} />}
      </TableCell>
      <TableCell className="whitespace-normal break-words align-top py-4">
        <p className="text-sm text-gray-600 dark:text-neutral-500">
          {task.description}
        </p>
      </TableCell>
      <TableCell className="align-middle">
        <div className="flex gap-2 items-center ">
          <TooltipProvider>
            {task.assignees?.map((assignee, i) => (
              <Tooltip key={i}>
                <TooltipTrigger asChild>
                  <Avatar className="z-30 cursor-pointer transition-transform hover:scale-110">
                    <AvatarImage src={assignee.avatarUrl} />
                    <AvatarFallback className="text-xs bg-muted-foreground/20">
                      {assignee.email[0].toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </TooltipTrigger>
                <TooltipContent side="top">
                  <p className="text-xs font-medium">{assignee.email}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </div>
      </TableCell>
      <TableCell>
        {format(task.startDate, "LLL dd")} -{" "}
        {format(task.endDate, "LLL dd, yyyy")}
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-8">
              <MoreHorizontalIcon />
              <span className="sr-only">Open menu</span>
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem>
              <Eye className="size-4 mr-2" />
              View details
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Pencil className="size-4 mr-2" />
              Edit task
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Copy className="size-4 mr-2" />
              Duplicate task
            </DropdownMenuItem>

            <DropdownMenuItem>
              <Link2 className="size-4 mr-2" />
              Copy link
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem>
              <CheckCircle2 className="size-4 mr-2" />
              Mark as done
            </DropdownMenuItem>

            <DropdownMenuItem>
              <UserPlus className="size-4 mr-2" />
              Assign user
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem variant="destructive">
              <Trash2 className="size-4 mr-2" />
              Delete task
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
}

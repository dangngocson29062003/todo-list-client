"use client"
import { Task } from "@/src/types/task";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../../shadcn/badge";
import PriorityBadge from "../../common/priority-badge";
import { ArrowDown, ArrowUp, ArrowUpDown, Calendar, MoreHorizontalIcon } from "lucide-react";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "../../shadcn/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "../../shadcn/dropdown-menu";
import { Button } from "../../shadcn/button";


const statusConfig = {
  TODO: {
    label: "Todo",
    color: "#2563EB",
  },
  IN_PROGRESS: {
    label: "In Progress",
    color: "#d5d906",
  },
  REVIEW: {
    label: "Review",
    color: "#D97706",
  },
  DONE: {
    label: "Done",
    color: "#059669",
  },
};

export const columns: ColumnDef<Task>[] = [
    {
        accessorKey: "id",
        header: "ID",
    },
    {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => {
            const title = row.original.title;
            return (
                <div className="flex flex-col gap-1">
                    <span className="">{title}</span>
                    <PriorityBadge priority = {row.original.priority}/>
                </div>
            )
        }
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
        const status = row.original.status;
        const config = statusConfig[status];

        return (
            <Badge
                variant="outline"
                className="flex text-md items-center gap-2 px-2 py-1 rounded-md border-l-4"
                style={{
                    borderLeftColor: config.color,
                }}
            >
            <span
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: config.color }}
            />
            {config.label}
            </Badge>
        );
        },
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        accessorKey: "assignees",
        header: () => {
            return (            
                <div className="flex items-center justify-center">
                    <span>Assignees</span>
                </div>
            );
        },
        cell: ({ row }) => {
        const assignees = row.original.assignees || [];

        if (assignees.length === 0) return;

        return (
            <div className="flex items-center justify-center">
            {assignees.slice(0, 2).map((user, index) => (
                <Avatar
                key={index}
                className="h-8 w-8 border-2 border-white -ml-3 first:ml-0"
                title={user.name}
                >
                <AvatarImage src={user.avatar} />
                <AvatarFallback>
                    {user.name.slice(0, 1).toUpperCase()}
                </AvatarFallback>
                </Avatar>
            ))}

            {assignees.length > 2 && (
                <span className="-ml-2 z-10 border-2 border-white text-xs text-gray-400 bg-gray-100 px-2 py-1.5 rounded-full">
                +{assignees.length - 2}
                </span>
            )}
            </div>
        );
        },
    },
    {
        accessorKey: "startDate",
        header: () => {
            return (            
                <div className="flex items-center justify-center">
                    <span>Timeline</span>
                </div>
            );
        },
        cell: ({ row }) => {
        const start = row.original.startDate;
        const end = row.original.endDate;

        if (!start && !end) return "-";

        return (
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Calendar size={14} />
            <span className="font-medium text-foreground">
                {start ? format(new Date(start), "dd MMM") : "-"}
            </span>
            <span>→</span>
            <span className="font-medium text-foreground">
                {end ? format(new Date(end), "dd MMM") : "-"}
            </span>
            </div>
        );
        },
    },
    {
        accessorKey: "actions",
        header: () => {
            return (            
                <div className="flex items-center justify-center">
                    <span>Actions</span>
                </div>
            );
        },
        cell: () => {
            return (
                <div className="flex justify-center">
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
                </div>
            )
        }
    }
]
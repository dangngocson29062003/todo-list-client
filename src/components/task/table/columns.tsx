"use client"
import { Task } from "@/src/types/task";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../../shadcn/badge";
import PriorityBadge from "../../common/priority-badge";

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
                <div className="flex flex-col">
                    <span className="font-medium">{title}</span>
                    <PriorityBadge priority = {row.original.priority}/>
                </div>
            )
        }
    },
    {
        accessorKey: "description",
        header: "Description",
    },
    {
        accessorKey: "tags",
        header: "Tags",
    },
    {
        accessorKey: "status",
        header: "Status",
    }
]
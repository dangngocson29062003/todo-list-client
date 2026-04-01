"use client";
import { Task } from "@/src/types/task";
import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import {
  ArrowDownAZ,
  ArrowUpZA,
  Calendar,
  ChartBarBig,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Copy,
  Eye,
  Link2,
  MoreHorizontalIcon,
  Pencil,
  Settings2,
  TextAlignStart,
  Trash2,
  TypeOutline,
  UserPlus,
  UsersRound,
} from "lucide-react";

import { PriorityBadge } from "../../priority-badge";
import { Button } from "../../shadcn/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../shadcn/dropdown-menu";
import { StatusIndicator } from "../../status-badge";
import { AssigneeFilter } from "./assignee-filter";
import { AssigneeStack } from "./assignee-stack";
import { PriorityFilter } from "./priority-filter";
import { ProjectMember } from "@/src/types/project-member";
import { Assignee } from "@/src/types/assignee";

export const getColumns = (members: ProjectMember[]): ColumnDef<Task>[] => [
  {
    accessorKey: "name",
    header: ({ column }) => {
      const isSorted = column.getIsSorted();

      return (
        <div
          onClick={() => {
            const isSorted = column.getIsSorted();
            if (isSorted === "desc") {
              column.clearSorting();
            } else {
              column.toggleSorting(isSorted === "asc");
            }
          }}
          className="flex items-center justify-between text-muted-foreground hover:text-foreground transition-colors group"
        >
          <div className="flex items-center gap-2">
            <div className="relative">
              <TypeOutline
                className={`size-4 transition-opacity ${isSorted ? "opacity-0" : "opacity-100"}`}
              />
              {isSorted === "asc" && (
                <ArrowDownAZ className="size-4 absolute inset-0 text-blue-500" />
              )}
              {isSorted === "desc" && (
                <ArrowUpZA className="size-4 absolute inset-0 text-blue-500" />
              )}
            </div>

            <p className="text-xs font-medium">Name</p>
          </div>

          <div className="flex flex-col">
            <ChevronUp
              className={`size-3.5 -mb-1 ${isSorted === "asc" ? "text-blue-500" : "opacity-30"}`}
            />
            <ChevronDown
              className={`size-3.5 ${isSorted === "desc" ? "text-blue-500" : "opacity-30"}`}
            />
          </div>
        </div>
      );
    },
    cell: ({ row }) => {
      const name = row.original.name;
      const id = row.original.id;
      return (
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold">{name}</span>
          <span className="text-xs text-muted-foreground">{id}</span>
        </div>
      );
    },
  },
  {
    accessorKey: "priority",
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    header: ({ column }) => {
      return <PriorityFilter column={column} />;
    },
    cell: ({ row }) => {
      return <PriorityBadge priority={row.original.priority} />;
    },
  },

  {
    accessorKey: "description",
    header: () => {
      return (
        <div className="flex items-center gap-2 text-muted-foreground">
          <TextAlignStart className="size-4" />
          <p className="text-xs font-medium">Description</p>
        </div>
      );
    },
    size: 300,
    minSize: 300,
    cell: ({ row }) => (
      <p
        className="line-clamp-3 whitespace-normal break-words leading-relaxed overflow-hidden text-sm text-muted-foreground text-xs"
        title={row.original.description}
      >
        {row.original.description || "-"}
      </p>
    ),
  },

  {
    accessorKey: "assignees",
    header: ({ column }) => {
      return <AssigneeFilter column={column} members={members || []} />;
    },
    filterFn: (row, userId, filterValue: string[]) => {
      if (!filterValue?.length) return true;
      const taskAssignees = row.getValue(userId) as Assignee[];
      console.log(filterValue);
      return taskAssignees.some((assignee) =>
        filterValue.includes(assignee.id),
      );
    },
    cell: ({ row }) => {
      return <AssigneeStack assignees={row.original.assignees} />;
    },
  },
  {
    accessorKey: "startDate",
    header: () => {
      return (
        <div className="flex items-center gap-2 text-muted-foreground">
          <Calendar className="size-4" />
          <p className="text-xs font-medium">Timeline</p>
        </div>
      );
    },
    cell: ({ row }) => {
      const start = row.original.startDate;
      const end = row.original.endDate;

      if (!start && !end) return "-";

      return (
        <div className="flex items-center gap-2 text-[12px] text-muted-foreground">
          <span className="">
            {start ? format(new Date(start), "MMM dd") : "-"}
          </span>
          -
          <span className="">
            {end ? format(new Date(end), "MMM dd, yyyy") : "-"}
          </span>
        </div>
      );
    },
  },

  {
    accessorKey: "status",
    header: () => {
      return (
        <div className="flex items-center gap-2 text-muted-foreground">
          <ChartBarBig className="size-4" />
          <p className="text-xs font-medium">Status</p>
        </div>
      );
    },
    cell: ({ row }) => {
      const status = row.original.status;
      return <StatusIndicator status={status} />;
    },
  },
  {
    accessorKey: "actions",
    enableResizing: false,
    header: () => {
      return (
        <div className="flex justify-center items-center gap-2 text-muted-foreground">
          <Settings2 className="size-4" />
          <p className="text-xs font-medium">Actions</p>
        </div>
      );
    },
    size: 80,
    minSize: 80,
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
        </div>
      );
    },
  },
];

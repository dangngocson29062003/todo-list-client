"use client";

import { useProject } from "@/src/context/projectContext";
import { Task } from "@/src/types/task";
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../shadcn/table";
import { getColumns } from "./columns";
import { toast } from "sonner";
import { getTasks, handleDuplicateTask } from "@/src/lib/api-task";

export default function TaskTablePage() {
  const { project } = useProject();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const onDuplicate = async (taskId: string) => {
    if (!project?.id) return;
    try {
      const newTask = await handleDuplicateTask(taskId, project.id);
      setTasks((prev) => [newTask, ...prev]);
      toast.success("Duplicated");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };
  const columns = useMemo(
    () => getColumns(project?.members || [], onDuplicate),
    [project?.members, onDuplicate],
  );
  const table = useReactTable({
    data: tasks,
    columns,
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    getCoreRowModel: getCoreRowModel(),
    state: {
      sorting,
      columnFilters,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
  });
  useEffect(() => {
    const fetchTasks = async () => {
      if (!project?.id) return;

      try {
        setLoading(true);
        setError(null);
        const data = await getTasks(project.id, {
          isParentOnly: true,
        });

        setTasks(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message);
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [project?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-6 text-sm text-muted-foreground">
        <Loader2 className="size-8 animate-spin" />
      </div>
    );
  }
  return (
    <div className="p-2 block max-w-full bg-muted rounded-md">
      <Table
        style={{
          width: table.getTotalSize(),
          minWidth: "100%",
          tableLayout: "auto",
        }}
      >
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    colSpan={header.colSpan}
                    style={{
                      position: "relative",
                      width: header.getSize(),
                      overflow: "visible",
                    }}
                    className="px-4 py-2"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    {header.column.getCanResize() && (
                      <div
                        onMouseDown={header.getResizeHandler()}
                        onTouchStart={header.getResizeHandler()}
                        className={`resizer ${
                          header.column.getIsResizing() ? "isResizing" : ""
                        }`}
                      ></div>
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => {
            return (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => {
                  return (
                    <TableCell
                      key={cell.id}
                      style={{ width: cell.column.getSize() }}
                      className="px-4 py-4"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

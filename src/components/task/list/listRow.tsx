import { Priority } from "@/src/types/enum";
import { Task } from "@/src/types/task";
import {
  Calendar,
  ChevronDown,
  ChevronUp,
  Dot,
  Plus,
  Settings,
  TextAlignStart,
  TriangleAlert,
  TypeOutline,
  UsersRound,
} from "lucide-react";
import { useMemo, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { Button } from "../../shadcn/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../shadcn/table";
import { ListItem } from "./listItem";
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { getColumns } from "../table/columns";
import { useProject } from "@/src/context/projectContext";

type KanbanColumnProps = {
  priority: Priority;
  tasks: Task[];
  moveTask: (taskId: string, toPriority: Priority) => Promise<void> | void;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
  setPriority: (priority: Priority) => void;
};

export function ListRow({
  priority,
  tasks,
  moveTask,
  setIsModalNewTaskOpen,
  setPriority,
}: KanbanColumnProps) {
  const { project } = useProject();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item: { id: string }) => moveTask(item.id, priority),
    collect: (monitor: any) => ({
      isOver: !!monitor.isOver(),
    }),
  }));
  const filteredTasks = useMemo(
    () => tasks.filter((task) => task.priority === priority),
    [tasks, priority],
  );
  const [open, setOpen] = useState(filteredTasks.length > 0);

  const priorityColor: Record<Priority, string> = {
    LOW: "bg-slate-500",
    MEDIUM: "bg-blue-500",
    HIGH: "bg-orange-500",
    URGENT: "bg-red-500",
  };
  const columns = useMemo(
    () => getColumns(project?.members || []),
    [project?.members],
  );
  const table = useReactTable({
    data: filteredTasks,
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
  return (
    <div
      ref={(instance) => {
        drop(instance);
      }}
      className={`rounded-lg py-2 xl:px-2 ${isOver ? "bg-blue-100 dark:bg-neutral-950" : ""}`}
    >
      <div className="flex w-full">
        <div className={`w-2 rounded-s-lg ${priorityColor[priority]}`} />
        <div className="flex w-full items-center justify-between rounded-e-lg bg-muted px-5 py-2 dark:bg-muted/50">
          <div
            className="flex flex-1 cursor-pointer items-center text-lg font-semibold"
            onClick={() => setOpen(!open)}
          >
            <h3>{priority}</h3>
            <Dot className="text-ring" />
            <span className="text-sm leading-none text-ring">
              {filteredTasks.length}
            </span>
          </div>

          <div className="flex shrink-none items-center gap-4">
            <Button
              variant="outline"
              size="icon-xs"
              onClick={() => {
                setPriority(priority);
                setIsModalNewTaskOpen(true);
              }}
            >
              <Plus size={16} />
            </Button>

            {open ? (
              <Button size="icon-xs" onClick={() => setOpen(false)}>
                <ChevronUp size={16} strokeWidth={3} />
              </Button>
            ) : (
              <Button size="icon-xs" onClick={() => setOpen(true)}>
                <ChevronDown size={16} strokeWidth={3} />
              </Button>
            )}
          </div>
        </div>
      </div>

      {open && (
        <div className="p-2">
          <Table
            style={{
              width: table.getTotalSize(),
              minWidth: "100%",
              tableLayout: "auto",
            }}
          >
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
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
              {table.getRowModel().rows.map((row) => (
                <ListItem key={row.id} row={row} />
              ))}
            </TableBody>
          </Table>

          {filteredTasks.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
              <p className="text-sm">No tasks in this column</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

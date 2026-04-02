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
import { useDrop } from "react-dnd";
import { Button } from "../../shadcn/button";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../../shadcn/table";
import { ListItem } from "./listItem";

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
          <Table className="table-fixed w-full">
            {filteredTasks.length > 0 && (
              <>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[15%] ">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <TypeOutline className="size-4" />
                        Name
                      </div>
                    </TableHead>
                    <TableHead className="w-[10%]">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <TriangleAlert className="size-4" />
                        Status
                      </div>
                    </TableHead>
                    <TableHead className="w-[10%]">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <TriangleAlert className="size-4" />
                        Priority
                      </div>
                    </TableHead>
                    <TableHead className="w-[40%]">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <TextAlignStart className="size-4" />
                        Description
                      </div>
                    </TableHead>
                    <TableHead className="w-[10%]">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <UsersRound className="size-4" />
                        Assignees
                      </div>
                    </TableHead>
                    <TableHead className="w-[15%]">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="size-4" />
                        Due Date
                      </div>
                    </TableHead>
                    <TableHead className="w-[10%] align-end">
                      <div className="flex items-center justify-end gap-2 text-muted-foreground">
                        <Settings className="size-4" />
                        Actions
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {filteredTasks.map((task) => (
                    <ListItem key={task.id} task={task} />
                  ))}
                </TableBody>
              </>
            )}
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

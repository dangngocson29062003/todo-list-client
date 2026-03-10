import { Task, TaskStatus } from "@/src/types/task";
import { ChevronDown, Dot, Plus } from "lucide-react";
import { useState } from "react";
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
  status: TaskStatus;
  tasks: Task[];
  moveTask: (taskId: number, toStatus: TaskStatus) => void;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};
export function ListRow({
  status,
  tasks,
  moveTask,
  setIsModalNewTaskOpen,
}: KanbanColumnProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "task",
    drop: (item: { id: number }) => moveTask(item.id, status),
    collect: (monitor: any) => ({
      isOver: !!monitor.isOver(),
    }),
  }));
  const [open, setOpen] = useState(true);
  const statusColor: any = {
    TODO: "#2563EB",
    IN_PROGRESS: "#d5d906",
    REVIEW: "#D97706",
    DONE: "#059669",
  };

  return (
    <div
      ref={(instance) => {
        drop(instance);
      }}
      className={`sl:py-4 rounded-lg py-2 xl:px-2 ${isOver ? "bg-blue-100 dark:bg-neutral-950" : ""}`}
    >
      <div className=" flex w-full">
        <div
          className={`w-2 !bg-[${statusColor[status]}] rounded-s-lg`}
          style={{ backgroundColor: statusColor[status] }}
        />
        <div className="flex w-full items-center justify-between rounded-e-lg bg-muted dark:bg-muted/50 px-5 py-2">
          <div className="flex items-center text-lg font-semibold">
            <h3>{status}</h3>
            <Dot className="text-ring" />
            <span className="text-sm leading-none text-ring">
              {tasks.filter((item) => item.status === status).length}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon-xs"
              onClick={() => console.log("open modal")}
            >
              <Plus size={16} />
            </Button>
            <Button size="icon-xs" onClick={() => setOpen(!open)}>
              <ChevronDown size={16} strokeWidth={3} />
            </Button>
          </div>
        </div>
      </div>
      {open && (
        <div className="p-2">
          <Table className="table-fixed w-full">
            <TableHeader>
              <TableRow className="">
                <TableHead className="w-[100px] text-muted-foreground">
                  ID
                </TableHead>
                <TableHead className="w-[400px] text-muted-foreground "></TableHead>
                <TableHead className="w-[120px] text-muted-foreground">
                  Priority
                </TableHead>
                <TableHead className="w-[600px] text-muted-foreground">
                  Description
                </TableHead>
                <TableHead className="w-[140px] text-muted-foreground">
                  Assignees
                </TableHead>
                <TableHead className="w-[160px] text-muted-foreground">
                  Due Date
                </TableHead>
                <TableHead className="text-right text-muted-foreground">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks
                .filter((task) => task.status === status)
                .map((task) => (
                  <ListItem key={task.id} task={task} />
                ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

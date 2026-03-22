import { TaskStatus } from "@/src/types/enum";
import { Task } from "@/src/types/task";
import { Dot, Plus } from "lucide-react";
import { useDrop } from "react-dnd";
import { Button } from "../../shadcn/button";
import { KanbanItem } from "./kanbanItem";
type KanbanColumnProps = {
  status: TaskStatus;
  tasks: Task[];
  moveTask: (taskId: number, toStatus: TaskStatus) => void;
  setIsModalNewTaskOpen: (isOpen: boolean) => void;
};
export function KanbanColumn({
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
      <div className="mb-3 flex w-full">
        <div
          className={`w-2 !bg-[${statusColor[status]}] rounded-s-lg`}
          style={{ backgroundColor: statusColor[status] }}
        />
        <div className="flex w-full items-center justify-between rounded-e-lg bg-muted dark:bg-muted/50 px-5 py-4">
          <div className="flex items-center text-lg font-semibold">
            <h3>{status}</h3>
            <Dot className="text-ring" />
            <span className="text-sm leading-none text-ring">
              {tasks.filter((item) => item.status === status).length}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="icon-xs"
              onClick={() => console.log("open modal")}
            >
              <Plus size={16} />
            </Button>
          </div>
        </div>
      </div>

      {tasks
        .filter((task) => task.status === status)
        .map((task) => (
          <KanbanItem key={task.id} task={task} />
        ))}
    </div>
  );
}

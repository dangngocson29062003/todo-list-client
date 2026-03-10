import { Task } from "@/src/types/task";
import { EllipsisVertical, MessageSquareMore } from "lucide-react";
import { useDrag } from "react-dnd";
import { Badge } from "../shadcn/badge";

interface KanbanItem {
  task: Task;
}
export function KanbanItem({ task }: KanbanItem) {
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

  const PriorityTag = ({ priority }: { priority: Task["priority"] }) => (
    <Badge
      className={`text-xs ${
        priority === "URGENT"
          ? "bg-red-200 text-red-700"
          : priority === "HIGH"
            ? "bg-yellow-200 text-yellow-700"
            : priority === "MEDIUM"
              ? "bg-green-200 text-green-700"
              : priority === "LOW"
                ? "bg-blue-200 text-blue-700"
                : "bg-gray-200 text-gray-700"
      }`}
    >
      {priority}
    </Badge>
  );

  return (
    <div
      ref={(instance) => {
        drag(instance);
      }}
      className={`mb-4 rounded-md cursor-grab active:cursor-grabbing bg-muted shadow dark:bg-muted/50 ${
        isDragging ? "opacity-50" : "opacity-100"
      }`}
    >
      {/* {task.attachments && task.attachments.length > 0 && (
        <Image
          src={`https://pm-s3-images.s3.us-east-2.amazonaws.com/${task.attachments[0].fileURL}`}
          alt={task.attachments[0].fileName}
          width={400}
          height={200}
          className="h-auto w-full rounded-t-md"
        />
      )} */}
      <div className="p-4 md:p-6">
        <div className="my-3 flex justify-between gap-4 w-full">
          <div className="flex items-start gap-2 flex-1 min-w-0">
            <h4 className="text-md truncate font-bold dark:text-white">
              {task.title}
            </h4>
            {task.priority && <PriorityTag priority={task.priority} />}
          </div>
          <button className="flex h-6 w-4 flex-none items-center justify-center cursor-pointer dark:text-neutral-500">
            <EllipsisVertical size={26} />
          </button>
        </div>

        <div className="text-xs text-gray-500 dark:text-neutral-500">
          {/* {formattedStartDate && <span>{formattedStartDate} - </span>}
          {formattedDueDate && <span>{formattedDueDate}</span>} */}
          <span>09/03/2026 - 14/03/2026</span>
        </div>
        <p className="mt-2 text-sm text-gray-600 dark:text-neutral-500">
          {task.description}
        </p>
        <div className="mt-4 border-t border-gray-200 dark:border-stroke-dark" />

        {/* Users */}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex gap-1">
            <div className="flex size-5 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
              D
            </div>
            <div className="flex size-5 items-center justify-center rounded-full bg-sidebar-primary text-sidebar-primary-foreground">
              D
            </div>
          </div>
          <div className="flex items-center text-gray-500 dark:text-neutral-500">
            <MessageSquareMore size={20} />
            <span className="ml-1 text-sm dark:text-neutral-400">10</span>
          </div>
        </div>
      </div>
    </div>
  );
}

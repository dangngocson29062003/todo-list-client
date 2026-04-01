import { Task } from "@/src/types/task";
import { differenceInDays, format, formatDistanceToNow } from "date-fns";
import {
  CheckCircle2,
  Clock9,
  Copy,
  Eye,
  Link2,
  ListChecks,
  MessageSquareMore,
  MoreHorizontalIcon,
  Pencil,
  Timer,
  Trash2,
  UserPlus,
} from "lucide-react";
import { useDrag } from "react-dnd";
import { PriorityBadge } from "../../priority-badge";
import { Avatar, AvatarFallback, AvatarImage } from "../../shadcn/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../shadcn/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../shadcn/tooltip";

interface KanbanItem {
  task: Task;
}
export function KanbanItem({ task }: KanbanItem) {
  const duration =
    differenceInDays(new Date(task.endDate), new Date(task.startDate)) + 1;

  const [{ isDragging }, drag] = useDrag(() => ({
    type: "task",
    item: { id: task.id },
    collect: (monitor: any) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={(instance) => {
        drag(instance);
      }}
      className={`
        group mb-3 flex flex-col rounded-xl border border-border bg-card p-4
        transition-all duration-200 hover:border-primary/30 hover:shadow-md
        cursor-grab active:cursor-grabbing
        ${isDragging ? "opacity-40 scale-95" : "opacity-100"}
      `}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {task.priority && <PriorityBadge priority={task.priority} />}
          <div className="flex items-center gap-1 rounded-md bg-secondary/50 px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground border border-border/50">
            <Timer className="size-4" />
            <span>{duration}d</span>
          </div>
        </div>

        <div className="flex items-center gap-1 ">
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground/50 ">
            <Clock9 size={10} />
            <span>
              {formatDistanceToNow(task.createdAt, {
                addSuffix: true,
              })}
            </span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild={true}>
              <div
                role="button"
                className="flex items-center justify-center rounded-md size-7 transition-colors hover:bg-secondary focus-visible:outline-none cursor-pointer"
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontalIcon className="size-4 text-muted-foreground" />
                <span className="sr-only">Open menu</span>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              <DropdownMenuItem>
                <Eye className="size-4 mr-2" /> View details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Pencil className="size-4 mr-2" /> Edit task
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="size-4 mr-2" /> Duplicate task
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link2 className="size-4 mr-2" /> Copy link
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <CheckCircle2 className="size-4 mr-2" /> Mark as done
              </DropdownMenuItem>
              <DropdownMenuItem>
                <UserPlus className="size-4 mr-2" /> Assign user
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <Trash2 className="size-4 mr-2" /> Delete task
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="mb-3">
        <h4 className="text-sm font-bold text-foreground mb-1 line-clamp-1 italic tracking-tight">
          {task.name}
        </h4>
        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
          {task.description || "No description provided."}
        </p>
      </div>
      <div className="flex items-center justify-between gap-2 mb-4 py-2 px-2.5 rounded-lg bg-muted-foreground/10 dark:bg-muted">
        <div className="flex flex-col">
          <span className="text-[9px] uppercase text-muted-foreground font-semibold tracking-tighter">
            Start
          </span>
          <span className="text-[11px] font-medium">
            {format(new Date(task.startDate), "MMM dd")}
          </span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[9px] uppercase text-muted-foreground font-semibold tracking-tighter">
            End
          </span>
          <span className="text-[11px] font-medium">
            {format(new Date(task.endDate), "MMM dd")}
          </span>
        </div>
      </div>
      <div className="mt-auto pt-3 flex items-center justify-between border-t border-dashed border-border">
        <div className="flex shrink-none items-center gap-3">
          {task.commentCount && (
            <div className="flex items-center gap-2 text-muted-foreground/70">
              <MessageSquareMore className="size-3.5" />
              <span className="text-xs font-medium">{task.commentCount}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-muted-foreground/70">
            <ListChecks className="size-3.5" />
            <span className="text-xs font-medium">{task.commentCount}</span>
          </div>
        </div>

        <div className="flex flex-1 justify-end -space-x-2">
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
      </div>
    </div>
  );
}

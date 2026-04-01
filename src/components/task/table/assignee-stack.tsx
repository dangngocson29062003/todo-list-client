"use client";
import { Assignee } from "@/src/types/assignee";
import { Avatar, AvatarFallback, AvatarImage } from "../../shadcn/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../shadcn/tooltip";

interface AssigneeStackProps {
  assignees?: Assignee[];
}

export const AssigneeStack = ({ assignees }: AssigneeStackProps) => {
  if (!assignees || assignees.length === 0) {
    return (
      <div className="flex items-center text-muted-foreground/40 italic text-xs">
        <span>Unassigned</span>
      </div>
    );
  }

  const displayLimit = 2;
  const mainAssignees = assignees.slice(0, displayLimit).reverse();
  const remainingCount = assignees.length - displayLimit;

  return (
    <div className="flex items-center pr-2 group cursor-default">
      <TooltipProvider>
        {mainAssignees.map((user, index) => (
          <Tooltip key={index} delayDuration={0}>
            <TooltipTrigger asChild>
              <Avatar className="z-20 -ml-2 h-8 w-8 border-2 border-background transition-all duration-300 group-hover:-ml-1 hover:z-50 hover:scale-110">
                <AvatarImage src={user?.avatarUrl} />
                <AvatarFallback className="bg-primary text-[10px] font-bold text-primary-foreground uppercase">
                  {user?.email?.charAt(0) || "?"}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent side="top" className="p-2 shadow-xl border-border">
              <p className="text-xs font-medium">{user?.email}</p>
            </TooltipContent>
          </Tooltip>
        ))}
        {remainingCount > 0 && (
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Avatar className="z-30 -ml-2 h-8 w-8 bg-muted border-2 border-background transition-all duration-300 group-hover:-ml-1 hover:z-50 hover:scale-110">
                <AvatarFallback className="bg-muted text-[10px] font-bold text-muted-foreground uppercase">
                  +{remainingCount}
                </AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent
              side="top"
              className="flex flex-col gap-1 p-2 shadow-xl border-border"
            >
              <p className="text-[10px] font-semibold text-muted-foreground mb-1 uppercase tracking-tight">
                Remaining Assignees
              </p>
              {assignees.slice(displayLimit).map((user, idx) => (
                <p key={idx} className="text-xs font-medium">
                  {user.email}
                </p>
              ))}
            </TooltipContent>
          </Tooltip>
        )}
      </TooltipProvider>
    </div>
  );
};

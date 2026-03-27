"use client";
import { Project } from "@/src/types/project";
import { format, formatDistanceToNow } from "date-fns";
import { Calendar, Clock9 } from "lucide-react";
import { useRouter } from "next/navigation";
import { PriorityBadge } from "../priority-badge";
import { Avatar, AvatarFallback, AvatarImage } from "../shadcn/avatar";
import { Progress } from "../shadcn/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../shadcn/tooltip";
import { StageBadge } from "../stage-bade";
import { TechBadge } from "../tech-bage";
import { ProjectActionsDropdown } from "./project-actions-dropdown";
import { useSidebar } from "../shadcn/sidebar";

export function ProjectCard({
  project,
  onToggleFavorite,
}: {
  project: Project;
  onToggleFavorite: (projectId: string, isFavorite: boolean) => void;
}) {
  const router = useRouter();
  const { isMobile } = useSidebar();
  const progress =
    project.taskCount > 0
      ? Math.round((project.doneTaskCount * 100) / project.taskCount)
      : 0;

  return (
    <div
      key={project.id}
      onClick={() => router.push(`/project/${project.id}/overview`)}
      className="group relative flex flex-col rounded-2xl border bg-card p-4 sm:p-6 cursor-pointer transition-all duration-300 hover:border-primary/20 hover:shadow-xl"
    >
      <div className="mb-4 flex justify-between gap-3 sm:mb-2 sm:items-center">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 min-w-0">
          <StageBadge stage={project.stage} />
          <PriorityBadge priority={project.priority} />
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 shrink items-center gap-1 text-[10px] text-muted-foreground sm:text-[10px]">
            <Clock9 size={12} />
            <span className="truncate">
              Created{" "}
              {formatDistanceToNow(new Date(project.createdAt), {
                addSuffix: true,
              })}
            </span>
          </div>
          <div
            className="relative z-20 shrink-0"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <ProjectActionsDropdown
              projectId={project.id}
              isFavorite={project.isFavorite}
              onToggleFavorite={onToggleFavorite}
              variant="card"
            />
          </div>
        </div>
      </div>
      <div className="mb-4 flex-1 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="flex size-8 shrink-0 items-center justify-center truncate rounded-[4px] border border-border bg-background text-sm font-bold shadow-sm transition-colors group-hover/item:border-primary/50">
            {project.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="truncate text-base font-bold transition-colors group-hover:text-primary sm:text-xl">
              {project.name}
            </h3>
          </div>
        </div>

        <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground sm:text-xs">
          {project.description || "No description provided for this project."}
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {project.techStack && project.techStack.length > 0 ? (
          project.techStack
            .slice(0, 4)
            .map((tech, index) => <TechBadge tech={tech} key={index} />)
        ) : (
          <span className="text-[10px] italic text-muted-foreground/50">
            No technologies specified
          </span>
        )}
        {project.techStack && project.techStack.length > 4 && (
          <span className="text-[10px] text-muted-foreground">
            +{project.techStack.length - 4} more
          </span>
        )}
      </div>

      <div className="mb-4 space-y-2">
        <div className="flex justify-between text-[11px] font-bold uppercase tracking-tight sm:text-xs">
          <span className="text-muted-foreground">Progress</span>
          <span>{progress}%</span>
        </div>

        <Progress value={progress} className="h-1.5" />

        <div className="flex gap-1 text-[10px] font-medium text-muted-foreground items-center justify-between">
          <span>
            {project.doneTaskCount} / {project.taskCount} Tasks
          </span>

          <span className="flex items-center gap-1">
            <Calendar size={12} />
            {format(project.startDate || new Date(), "LLL dd")} -{" "}
            {format(project.endDate || new Date(), "LLL dd, yyyy")}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-border/50 pt-4">
        <div className="flex items-center -space-x-2 transition-all duration-300 ease-in-out hover:space-x-1">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="z-30 h-8 w-8 cursor-pointer transition-transform hover:scale-110">
                  <AvatarImage src={project.createdBy.avatarUrl} />
                  <AvatarFallback className="bg-primary text-[10px] font-bold text-primary-foreground">
                    {project.createdBy.email.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                className="hidden sm:flex flex-col gap-1 p-2 shadow"
              >
                <p className="text-xs uppercase tracking-wider text-muted-foreground">
                  Creator
                </p>
                <p className="text-sm font-semibold">
                  {project.createdBy.email}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {project.memberCount > 1 && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="z-20 flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted-foreground/20 text-[10px] font-bold text-muted-foreground">
                    +{project.memberCount - 1}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="hidden sm:block">
                  <p>{project.memberCount - 1} other members in this project</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>

        <div className="text-[10px] font-bold text-primary transition-transform group-hover:translate-x-1 sm:text-[11px]">
          <span>VIEW DETAILS →</span>
        </div>
      </div>
    </div>
  );
}

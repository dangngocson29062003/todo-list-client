"use client";
import { useProject } from "@/src/context/projectContext";
import { Leaf, Loader2, MoreHorizontal, Star } from "lucide-react";
import { InlineEditField } from "../inline-edit-input";
import { PriorityBadge } from "../priority-badge";
import { Badge } from "../shadcn/badge";
import { Button } from "../shadcn/button";
import { StageBadge } from "../stage-bade";
import ProjectTabs from "./projectTab";
import { useProjects } from "@/src/context/homeContext";
import { updateProject } from "@/src/lib/api-project";
import { useEffect, useState } from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../shadcn/tooltip";

export default function ProjectHeader() {
  const { project, loading, refreshProject } = useProject();
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const { refresh, toggleFavorite } = useProjects();
  const handleToggle = async () => {
    if (isUpdating) return;

    setIsUpdating(true);

    try {
      await toggleFavorite(project.id, project.isFavorite);
      await refreshProject();
    } catch (error) {
      console.error("Fail to update favorite:", error);
    } finally {
      setIsUpdating(false);
    }
  };
  if (loading) return <div>Loading project details...</div>;
  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-600/20">
            <Leaf size={20} className="text-green-400" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <InlineEditField
                value={project.name}
                renderDisplay={(value) => (
                  <h2 className="font-bold text-xl">{value}</h2>
                )}
                onSave={async (value) => {
                  await updateProject(project.id, {
                    name: value,
                  });
                  await refreshProject();
                  await refresh();
                }}
              />
              {project.tags?.split(",").map((tag) => (
                <Badge key={tag}>{tag.trim()}</Badge>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span>
                <strong className="text-foreground mr-1">ID:</strong>{" "}
                {project.id}
              </span>
              <span className="flex items-center">
                <strong className="text-foreground mr-1">Priority:</strong>
                <PriorityBadge priority={project.priority} />
              </span>
              <span className="flex items-center">
                <strong className="text-foreground mr-1">Stage:</strong>
                <StageBadge stage={project.stage} />
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2 self-start md:self-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={
                  project.isFavorite
                    ? "text-yellow-500"
                    : "text-muted-foreground"
                }
                onClick={handleToggle}
              >
                {isUpdating ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Star
                    size={18}
                    fill={project.isFavorite ? "currentColor" : "none"}
                  />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{project.isFavorite ? "Unfavorite" : "Favorite"}</p>
            </TooltipContent>
          </Tooltip>

          <Button variant="ghost" size="icon">
            <MoreHorizontal size={18} />
          </Button>
        </div>
      </div>
      <ProjectTabs projectId={project.id} />
    </div>
  );
}

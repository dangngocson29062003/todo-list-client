"use client";
import { Badge } from "../shadcn/badge";
import { Button } from "../shadcn/button";
import { Star, MoreHorizontal, Leaf } from "lucide-react";
import ProjectTabs from "./projectTab";
import { useProject } from "@/src/context/projectContext";
import { PriorityBadge } from "../priority-badge";
import { StageBadge } from "../stage-bade";

export default function ProjectHeader() {
  const { project, loading } = useProject();
  if (loading) return <div>Loading project details...</div>;
  return (
    <div className="px-4 md:px-6 pt-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-600/20">
            <Leaf size={20} className="text-green-400" />
          </div>
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xl md:text-2xl font-semibold leading-tight">
                {project.name}
              </h2>
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
          <Button variant="ghost" size="icon">
            <Star size={18} />
          </Button>

          <Button variant="ghost" size="icon">
            <MoreHorizontal size={18} />
          </Button>
        </div>
      </div>
      <ProjectTabs projectId={project.id} />
    </div>
  );
}

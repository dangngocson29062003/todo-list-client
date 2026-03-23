"use client";
import { PriorityBadge } from "@/src/components/priority-badge";
import CustomFilter from "@/src/components/project/custom-filter";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/shadcn/avatar";
import { Badge } from "@/src/components/shadcn/badge";
import { Button } from "@/src/components/shadcn/button";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/src/components/shadcn/input-group";
import { Progress } from "@/src/components/shadcn/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/shadcn/tooltip";
import { StageBadge } from "@/src/components/stage-bade";
import { TechBadge } from "@/src/components/tech-bage";

import { Priority } from "@/src/types/enum";
import { Project } from "@/src/types/project";
import { format } from "date-fns";
import {
  Calendar,
  MoreVertical,
  Plus,
  SearchIcon,
  TriangleAlert,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/projects`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) {
        throw new Error(`Failed to fetch projects: ${res.statusText}`);
      }

      const result = await res.json();
      const projectsData = result.data || [];
      console.log("Dữ liệu từ API:", result);
      setProjects(projectsData);
    } catch (error) {
      console.error("fetchProperties error:", error);
      return [];
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProjects();
  }, []);
  return (
    <div className="w-full p-4 mx-auto space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight">Projects</h1>
          <p className="text-md text-muted-foreground">
            Manage, track, and collaborate on your active workspaces.
          </p>
        </div>
        <Button size={"icon-xs"}>
          <Plus />
        </Button>
      </div>
      <div className="flex items-center gap-4 bg-muted/30 p-2 rounded-xl shadow border border-border/50">
        <InputGroup className="bg-transparent! border-none! shadow-none! has-[[data-slot=input-group-control]:focus-visible]:ring-0!">
          <InputGroupInput placeholder="Search..." />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <CustomFilter />
          </InputGroupAddon>
        </InputGroup>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects?.map((project) => (
          <div
            key={project.id}
            onClick={() => router.push(`/project/${project.id}/overview`)}
            className="group w-full relative flex flex-col bg-card border rounded-2xl p-6 hover:shadow-xl hover:border-primary/20 transition-all duration-300 cursor-pointer"
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex gap-4 items-center">
                <StageBadge stage={project.stage} />
                <PriorityBadge priority={project.priority} />
              </div>
              <button className="text-muted-foreground hover:text-foreground p-1">
                <MoreVertical size={16} />
              </button>
            </div>

            <div className="mb-4 flex-1">
              <h3 className="text-xl font-bold group-hover:text-primary transition-colors">
                {project.name}
              </h3>

              <p className="mt-2 text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                {project.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.techStack.map((tech, index) => (
                <TechBadge tech={tech} key={index} />
              ))}
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                <span className="text-muted-foreground">Progress</span>
                <span>
                  {(project.doneTaskCount * 100) / project.taskCount}%
                </span>
              </div>
              <Progress
                value={(project.doneTaskCount * 100) / project.taskCount}
                className="h-1.5"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground font-medium">
                <span>
                  {project.doneTaskCount} / {project.taskCount} Tasks
                </span>
                <span className="flex items-center gap-1">
                  <Calendar size={12} />{" "}
                  {format(project.endDate || new Date(), "LLL dd, yyyy")}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-border/50">
              <div className="flex items-center -space-x-2 hover:space-x-1 transition-all duration-300 ease-in-out">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Avatar className="z-30 w-8 h-8 cursor-pointer hover:scale-110 transition-transform">
                        <AvatarImage src={project.createdBy.avatarUrl} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-[10px] font-bold">
                          {project.createdBy.email.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </TooltipTrigger>
                    <TooltipContent
                      side="bottom"
                      className="flex shadow flex-col gap-1 p-2"
                    >
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">
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
                        <div className="z-20 flex items-center justify-center w-8 h-8 rounded-full border-2 border-background bg-muted-foreground/20 text-[10px] font-bold text-muted-foreground cursor-default">
                          +{project.memberCount - 1}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>
                          {project.memberCount - 1} other members in this
                          project
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                )}
              </div>
              <div className="text-[11px] font-bold text-primary group-hover:translate-x-1 transition-transform">
                VIEW DETAILS →
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

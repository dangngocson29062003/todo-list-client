"use client";
import { PriorityBadge } from "@/src/components/priority-badge";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/shadcn/avatar";
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

import { Project } from "@/src/types/project";
import { format } from "date-fns";
import {
  ArrowDownAZ,
  Calendar,
  Check,
  ChevronDown,
  Clock9,
  ClockPlus,
  Loader2,
  MoreVertical,
  Plus,
  SearchIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

export default function ProjectList() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasNext, setHasNext] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentSort, setCurrentSort] = useState<
    "recent" | "alphabetical" | "created"
  >("recent");
  const [currentSearch, setCurrentSearch] = useState<string>();
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();
  const fetchProjects = useCallback(
    async (
      isLoadMore = false,
      searchQuery = "",
      sortType = "recent",
      pageToFetch = 0,
    ) => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const params = new URLSearchParams();
        params.append("page", pageToFetch.toString());
        params.append("limit", "6");
        params.append("sortBy", sortType);

        if (searchQuery) {
          params.append("name", searchQuery);
        }

        const res = await fetch(`/api/projects?${params.toString()}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Failed to fetch");
        const result = await res.json();
        const {
          projects,
          currentPage: pageResponse,
          hasNext: more,
        } = result.data;

        setProjects((prev) => (isLoadMore ? [...prev, ...projects] : projects));
        setCurrentPage(pageResponse);
        setHasNext(more);
      } catch (error) {
        console.error("fetch error:", error);
      } finally {
        setLoading(false);
      }
    },
    [],
  );
  useEffect(() => {
    fetchProjects(false, currentSearch, currentSort, 0);
  }, [currentSearch, currentSort, fetchProjects]);
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setCurrentSearch(searchTerm);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);
  const handleLoadMore = () => {
    fetchProjects(true, currentSearch, currentSort, currentPage + 1);
  };
  return (
    <div className="w-full p-4 mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-lg font-bold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground">
            Manage, track, and collaborate on your active workspaces.
          </p>
        </div>
        <Button className="gap-2 shadow-sm">
          <Plus size={16} />
          New Project
        </Button>
      </div>
      <div className="flex items-center gap-4 bg-muted/30 p-2 rounded-xl shadow border border-border/50 mt-4">
        <InputGroup className="bg-transparent! border-none! shadow-none! has-[[data-slot=input-group-control]:focus-visible]:ring-0!">
          <InputGroupInput
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <InputGroupAddon>
            <SearchIcon />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <TooltipProvider>
              <div className="flex items-center gap-2 bg-muted-foreground/10 p-1 rounded-lg">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      onClick={() => setCurrentSort("recent")}
                      className={`
                    transition-all duration-200 hover:bg-transparent
                    ${
                      currentSort === "recent"
                        ? "bg-green-100 text-green-700 shadow-md dark:bg-green-900 dark:text-green-200 dark:shadow-lg scale-100"
                        : "opacity-60 scale-95 dark:opacity-50"
                    }
                  `}
                    >
                      <Clock9 />
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent>Recents</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      onClick={() => setCurrentSort("alphabetical")}
                      className={`
                  transition-all duration-200 hover:bg-transparent
                  ${
                    currentSort === "alphabetical"
                      ? "bg-green-100 text-green-700 shadow-md dark:bg-green-900 dark:text-green-200 dark:shadow-lg scale-100"
                      : "opacity-60 scale-95 dark:opacity-50"
                  }
                `}
                    >
                      <ArrowDownAZ />
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent>Alphabetical</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      onClick={() => setCurrentSort("created")}
                      className={`
            transition-all duration-200 hover:bg-transparent
            ${
              currentSort === "created"
                ? "bg-green-100 text-green-700 shadow-md dark:bg-green-900 dark:text-green-200 dark:shadow-lg scale-100"
                : "opacity-60 scale-95 dark:opacity-50"
            }
          `}
                    >
                      <ClockPlus />
                    </Button>
                  </TooltipTrigger>

                  <TooltipContent>Created</TooltipContent>
                </Tooltip>
              </div>
            </TooltipProvider>
          </InputGroupAddon>
        </InputGroup>
      </div>
      <div className="border-b pb-4 mb-2"></div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center p-4 gap-6">
        {projects?.map((project) => (
          <div
            key={project.id}
            onClick={() => router.push(`/project/${project.id}/overview`)}
            className="group relative flex flex-col bg-card border rounded-2xl p-6 hover:shadow-xl hover:border-primary/20 transition-all duration-300 cursor-pointer"
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
                {project.description ||
                  "No description provided for this project."}
              </p>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
              {project.techStack && project.techStack.length > 0 ? (
                project.techStack.map((tech, index) => (
                  <TechBadge tech={tech} key={index} />
                ))
              ) : (
                <span className="text-[10px] text-muted-foreground/50 italic">
                  No technologies specified
                </span>
              )}
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                <span className="text-muted-foreground">Progress</span>
                <span>
                  {project.taskCount > 0
                    ? (project.doneTaskCount * 100) / project.taskCount
                    : 0}
                  %
                </span>
              </div>
              <Progress
                value={
                  project.taskCount > 0
                    ? (project.doneTaskCount * 100) / project.taskCount
                    : 0
                }
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
      <div className="flex flex-col items-center justify-center pt-12 pb-6">
        {hasNext ? (
          <div className="relative w-full flex justify-center">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-border/50"></div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                handleLoadMore();
              }}
              disabled={loading}
              className="relative bg-background px-8 rounded-full border-border/60 hover:border-primary/50 hover:bg-accent transition-all duration-300 shadow-sm gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span className="text-xs font-medium">Fetching...</span>
                </>
              ) : (
                <>
                  <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground">
                    Show More Projects
                  </span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </>
              )}
            </Button>
          </div>
        ) : (
          projects.length > 0 && (
            <div className="w-full space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-border to-transparent"></div>
                <div className="flex flex-col items-center gap-1">
                  <div className="p-1.5 rounded-full bg-muted/50">
                    <Check className="h-3 w-3 text-muted-foreground/70" />
                  </div>
                </div>
                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-border to-transparent"></div>
              </div>
              <p className="text-center text-[10px] uppercase tracking-widest text-muted-foreground/60 font-semibold">
                All projects caught up
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}

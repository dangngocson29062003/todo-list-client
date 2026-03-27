"use client";
import { PriorityBadge } from "@/src/components/priority-badge";
import { CreateProjectModal } from "@/src/components/project/create-project-modal";
import { ProjectCard } from "@/src/components/project/project-card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/shadcn/avatar";
import { Button } from "@/src/components/shadcn/button";
import { Dialog, DialogTrigger } from "@/src/components/shadcn/dialog";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/src/components/shadcn/input-group";
import { Progress } from "@/src/components/shadcn/progress";
import { useSidebar } from "@/src/components/shadcn/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/src/components/shadcn/tooltip";
import { StageBadge } from "@/src/components/stage-bade";
import { TechBadge } from "@/src/components/tech-bage";
import { useProjects } from "@/src/context/homeContext";

import { Project } from "@/src/types/project";
import { format, formatDistanceToNow } from "date-fns";
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
  const [open, setOpen] = useState(false);
  const { isMobile } = useSidebar();
  const {
    projects,
    limit,
    setLimit,
    currentSort,
    setCurrentSort,
    loading,
    loadMore,
    hasNext,
    searchTerm,
    setSearchTerm,
    toggleFavorite,
  } = useProjects();
  const [currentSearch, setCurrentSearch] = useState<string>();

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setSearchTerm(currentSearch as string);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [currentSearch]);
  const handleSuccess = useCallback(() => {
    setOpen(false);
  }, [currentSearch, currentSort]);
  return (
    <div className="w-full py-4 px-8 mx-auto">
      <div className="relative w-full overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-background to-muted/40 p-6 sm:p-8 shadow-sm">
        <div className="pointer-events-none absolute -top-20 -right-20 h-60 w-60 md:w-2xl rounded-full bg-primary/10 blur-3xl" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-2xl">
            <div className="mb-2 items-center rounded-full text-xs font-medium text-muted-foreground">
              Project Management
            </div>

            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Build, track, and deliver your projects with clarity
            </h1>

            <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
              Organize your work, monitor progress, and collaborate with your
              team — all in one place.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3 shrink-0">
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button size="lg" className="w-full sm:w-auto">
                  <Plus className="size-4" />
                  <span>New Project</span>
                </Button>
              </DialogTrigger>

              <CreateProjectModal onSuccess={handleSuccess} />
            </Dialog>
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-border/50 p-1 bg-muted/30 shadow">
        <div className="flex flex-col lg:flex-row lg:items-center">
          <InputGroup className="min-w-0 flex-1 bg-transparent! border-none! shadow-none! has-[[data-slot=input-group-control]:focus-visible]:ring-0!">
            <InputGroupInput
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setCurrentSearch(e.target.value)}
              className="min-w-0"
            />
            <InputGroupAddon>
              <SearchIcon className="size-4" />
            </InputGroupAddon>
          </InputGroup>
          {!isMobile && (
            <div className="flex justify-center gap-4">
              <TooltipProvider>
                <div className="flex flex-wrap  items-center gap-2 rounded-lg bg-muted-foreground/10 p-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setLimit(3)}
                        className={`min-w-10 transition-all duration-200 hover:bg-transparent ${
                          limit === 3
                            ? "bg-green-100 text-green-700 shadow-md dark:bg-green-900 dark:text-green-200 dark:shadow-lg scale-100"
                            : "opacity-60 scale-95 dark:opacity-50"
                        }`}
                      >
                        3
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>3 items</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setLimit(6)}
                        className={`min-w-10 transition-all duration-200 hover:bg-transparent ${
                          limit === 6
                            ? "bg-green-100 text-green-700 shadow-md dark:bg-green-900 dark:text-green-200 dark:shadow-lg scale-100"
                            : "opacity-60 scale-95 dark:opacity-50"
                        }`}
                      >
                        6
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>6 items</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setLimit(9)}
                        className={`min-w-10 transition-all duration-200 hover:bg-transparent ${
                          limit === 9
                            ? "bg-green-100 text-green-700 shadow-md dark:bg-green-900 dark:text-green-200 dark:shadow-lg scale-100"
                            : "opacity-60 scale-95 dark:opacity-50"
                        }`}
                      >
                        9
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>9 items</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setLimit(12)}
                        className={`min-w-10 transition-all duration-200 hover:bg-transparent ${
                          limit === 12
                            ? "bg-green-100 text-green-700 shadow-md dark:bg-green-900 dark:text-green-200 dark:shadow-lg scale-100"
                            : "opacity-60 scale-95 dark:opacity-50"
                        }`}
                      >
                        12
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>12 items</TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>

              <TooltipProvider>
                <div className="flex flex-wrap items-center gap-2 rounded-lg bg-muted-foreground/10 p-1">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => setCurrentSort("recent")}
                        className={`transition-all duration-200 hover:bg-transparent ${
                          currentSort === "recent"
                            ? "bg-green-100 text-green-700 shadow-md dark:bg-green-900 dark:text-green-200 dark:shadow-lg scale-100"
                            : "opacity-60 scale-95 dark:opacity-50"
                        }`}
                      >
                        <Clock9 className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Recents</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => setCurrentSort("alphabetical")}
                        className={`transition-all duration-200 hover:bg-transparent ${
                          currentSort === "alphabetical"
                            ? "bg-green-100 text-green-700 shadow-md dark:bg-green-900 dark:text-green-200 dark:shadow-lg scale-100"
                            : "opacity-60 scale-95 dark:opacity-50"
                        }`}
                      >
                        <ArrowDownAZ className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Alphabetical</TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon-sm"
                        variant="ghost"
                        onClick={() => setCurrentSort("created")}
                        className={`transition-all duration-200 hover:bg-transparent ${
                          currentSort === "created"
                            ? "bg-green-100 text-green-700 shadow-md dark:bg-green-900 dark:text-green-200 dark:shadow-lg scale-100"
                            : "opacity-60 scale-95 dark:opacity-50"
                        }`}
                      >
                        <ClockPlus className="size-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>Created</TooltipContent>
                  </Tooltip>
                </div>
              </TooltipProvider>
            </div>
          )}
        </div>
      </div>
      {isMobile && (
        <div className="flex justify-between gap-4 px-4 mt-4">
          <TooltipProvider>
            <div className="flex flex-wrap  items-center gap-2 rounded-lg bg-muted-foreground/10 p-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setLimit(3)}
                    className={`min-w-10 transition-all duration-200 hover:bg-transparent ${
                      limit === 3
                        ? "bg-green-100 text-green-700 shadow-md dark:bg-green-900 dark:text-green-200 dark:shadow-lg scale-100"
                        : "opacity-60 scale-95 dark:opacity-50"
                    }`}
                  >
                    3
                  </Button>
                </TooltipTrigger>
                <TooltipContent>3 items</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setLimit(6)}
                    className={`min-w-10 transition-all duration-200 hover:bg-transparent ${
                      limit === 6
                        ? "bg-green-100 text-green-700 shadow-md dark:bg-green-900 dark:text-green-200 dark:shadow-lg scale-100"
                        : "opacity-60 scale-95 dark:opacity-50"
                    }`}
                  >
                    6
                  </Button>
                </TooltipTrigger>
                <TooltipContent>6 items</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setLimit(9)}
                    className={`min-w-10 transition-all duration-200 hover:bg-transparent ${
                      limit === 9
                        ? "bg-green-100 text-green-700 shadow-md dark:bg-green-900 dark:text-green-200 dark:shadow-lg scale-100"
                        : "opacity-60 scale-95 dark:opacity-50"
                    }`}
                  >
                    9
                  </Button>
                </TooltipTrigger>
                <TooltipContent>9 items</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setLimit(12)}
                    className={`min-w-10 transition-all duration-200 hover:bg-transparent ${
                      limit === 12
                        ? "bg-green-100 text-green-700 shadow-md dark:bg-green-900 dark:text-green-200 dark:shadow-lg scale-100"
                        : "opacity-60 scale-95 dark:opacity-50"
                    }`}
                  >
                    12
                  </Button>
                </TooltipTrigger>
                <TooltipContent>12 items</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>

          <TooltipProvider>
            <div className="flex flex-wrap items-center gap-2 rounded-lg bg-muted-foreground/10 p-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => setCurrentSort("recent")}
                    className={`transition-all duration-200 hover:bg-transparent ${
                      currentSort === "recent"
                        ? "bg-green-100 text-green-700 shadow-md dark:bg-green-900 dark:text-green-200 dark:shadow-lg scale-100"
                        : "opacity-60 scale-95 dark:opacity-50"
                    }`}
                  >
                    <Clock9 className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Recents</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => setCurrentSort("alphabetical")}
                    className={`transition-all duration-200 hover:bg-transparent ${
                      currentSort === "alphabetical"
                        ? "bg-green-100 text-green-700 shadow-md dark:bg-green-900 dark:text-green-200 dark:shadow-lg scale-100"
                        : "opacity-60 scale-95 dark:opacity-50"
                    }`}
                  >
                    <ArrowDownAZ className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Alphabetical</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon-sm"
                    variant="ghost"
                    onClick={() => setCurrentSort("created")}
                    className={`transition-all duration-200 hover:bg-transparent ${
                      currentSort === "created"
                        ? "bg-green-100 text-green-700 shadow-md dark:bg-green-900 dark:text-green-200 dark:shadow-lg scale-100"
                        : "opacity-60 scale-95 dark:opacity-50"
                    }`}
                  >
                    <ClockPlus className="size-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Created</TooltipContent>
              </Tooltip>
            </div>
          </TooltipProvider>
        </div>
      )}
      <div className="border-b pb-4 mb-4"></div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-center gap-6">
        {projects?.map((project, index) => (
          <ProjectCard
            project={project}
            onToggleFavorite={toggleFavorite}
            key={index}
          />
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
                loadMore();
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

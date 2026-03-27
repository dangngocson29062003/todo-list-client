"use client";

import {
  ArrowUpRight,
  Check,
  ChevronRight,
  ExternalLink,
  Hash,
  Link as LinkIcon,
  ListFilter,
  MoreHorizontal,
  Plus,
  Star,
  StarOff,
  Trash2,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/src/components/shadcn/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/src/components/shadcn/sidebar";
import { useProjects } from "@/src/context/homeContext";
import Link from "next/link";
import { useState } from "react";
import { CreateProjectModal } from "../project/create-project-modal";
import { Button } from "../shadcn/button";
import { Dialog, DialogTrigger } from "../shadcn/dialog";
import { useAuthContext } from "@/src/context/authContext";
import { ProjectActionsDropdown } from "../project/project-actions-dropdown";

export function NavProjects() {
  const { isMobile } = useSidebar();
  const [open, setOpen] = useState(false);
  const {
    projects,
    limit,
    setLimit,
    currentSort,
    setCurrentSort,
    refresh,
    toggleFavorite,
  } = useProjects();
  const [isExpanded, setIsExpanded] = useState(true);

  const getSortLabel = (val: string) => {
    if (val === "recent") return "Recents";
    if (val === "alphabetical") return "Alphabetical";
    if (val === "created") return "Date Created";
    return val;
  };
  const handleSuccess = () => {
    setOpen(false);
  };
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel asChild className="group/projects">
        <div
          className="group/label flex w-full items-center justify-between cursor-pointer hover:bg-muted-foreground/10 hover:text-foreground"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-2 transition-colors">
            <span className="font-semibold">Projects</span>
            <div className=" opacity-0 group-hover/projects:opacity-100 group-has-[[data-state=open]]/label:opacity-100 transition-all duration-200">
              <ChevronRight
                className={`size-3.5 transition-transform duration-200 ${
                  isExpanded ? "rotate-90" : "rotate-0"
                }`}
              />
            </div>
          </div>
          <div
            className="flex items-center gap-2 -mr-1 opacity-0 group-hover/projects:opacity-100 transition-opacity group-has-[[data-state=open]]/label:opacity-100 transition-opacity"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
            }}
          >
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  size={"icon-xs"}
                  variant={"ghost"}
                  className="cursor-pointer"
                >
                  <Plus className="size-4" />
                </Button>
              </DialogTrigger>

              <CreateProjectModal onSuccess={handleSuccess} />
            </Dialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size={"icon-xs"}
                  variant={"ghost"}
                  className="cursor-pointer"
                >
                  <MoreHorizontal className="size-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent side="right" align="start" className="w-56">
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <Hash className="size-4" />
                    <div className="flex flex-1 items-center justify-between">
                      <span className="text-sm">Show</span>
                      <span className="text-xs text-muted-foreground">
                        {limit}
                      </span>
                    </div>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent className="w-56">
                      {[3, 6, 9, 12].map((value) => (
                        <DropdownMenuItem
                          key={value}
                          onClick={() => setLimit(value)}
                          className="flex items-center justify-between"
                        >
                          <span>{value} items</span>
                          {limit === value && (
                            <Check className="ml-2 h-4 w-4 text-primary" />
                          )}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <ListFilter className="size-4" />
                    <div className="flex flex-1 items-center justify-between">
                      <span className="text-sm">Sort by</span>
                      <span className="text-xs text-muted-foreground">
                        {getSortLabel(currentSort)}
                      </span>
                    </div>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent className="w-56">
                      {(["recent", "alphabetical", "created"] as const).map(
                        (value) => (
                          <DropdownMenuItem
                            key={value}
                            onClick={() => setCurrentSort(value)}
                            className="flex items-center justify-between cursor-pointer"
                          >
                            <span>{getSortLabel(value)}</span>
                            {currentSort === value && (
                              <Check className="size-4 text-primary" />
                            )}
                          </DropdownMenuItem>
                        ),
                      )}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href="/project" className="flex items-center gap-2">
                    <ExternalLink className="size-4" />
                    <span className="text-sm">Expands</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </SidebarGroupLabel>
      {isExpanded && (
        <SidebarMenu>
          {projects.map((item) => (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton asChild>
                <Link
                  href={`/project/${item.id}`}
                  className="flex items-center gap-3"
                >
                  <div className="flex size-5 shrink-0 items-center justify-center rounded-[4px] border border-border bg-background text-[10px] font-bold shadow-sm group-hover/item:border-primary/50 transition-colors">
                    {item.name.charAt(0).toUpperCase()}
                  </div>

                  <span className="truncate text-xs font-medium text-sidebar-foreground/90">
                    {item.name}
                  </span>
                </Link>
              </SidebarMenuButton>
              <ProjectActionsDropdown
                projectId={item.id}
                isFavorite={item.isFavorite}
                onToggleFavorite={toggleFavorite}
                variant="sidebar"
              />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      )}
    </SidebarGroup>
  );
}

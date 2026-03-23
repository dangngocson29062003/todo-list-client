"use client";

import {
  ArrowUpRight,
  Link,
  MoreHorizontal,
  Pin,
  PinOff,
  StarOff,
  Trash2,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
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
import { useHomeContext } from "@/src/context/homeContext";
import { useEffect, useRef, useState } from "react";
import { useAuthContext } from "@/src/context/authContext";

export function NavProjects() {
  const { isMobile } = useSidebar();
  const { projects, projectHasNext, fetchProjects, pinProject } = useHomeContext();
  const { authUser } = useAuthContext()
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);
  const scrollRef = useRef(null);

  function handleUpdateProjectPinStatus(projectId: string) {
    if (authUser == null) return;
    pinProject(projectId, authUser.id);
  }

  useEffect(() => {
    if (projects.length === 0 || !loaderRef.current || !scrollRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];

        if (first.isIntersecting && projectHasNext && !loadingRef.current) {
          loadingRef.current = true;
          setLoading(true);

          fetchProjects().finally(() => {
            loadingRef.current = false;
            setLoading(false);
          });
        }
      },
      {
        root: scrollRef.current,
        rootMargin: "50px",
      }
    );

    observer.observe(loaderRef.current);

    return () => observer.disconnect();
  }, [projectHasNext, fetchProjects]);

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu ref={scrollRef} className="custom-scrollbar max-h-45 overflow-y-auto overflow-x-hidden pr-2 scroll-smooth">
        {projects.map((project) => (
          <SidebarMenuItem key={project.id}>
            <SidebarMenuButton asChild>
              <span className="flex gap-1 items-center cursor">
                {project?.avatarUrl ? (
                  <img
                    src={project.avatarUrl}
                    className="w-7 h-7 shrink-0 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-7 h-7 shrink-0 flex items-center justify-center rounded-full bg-green-900 text-gray-200">
                    {project?.name.charAt(0).toUpperCase()}
                  </div>
                )}

                <p className="text-sm font-normal text-foreground truncate">
                  {project.name}
                </p>
              </span>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction
                  onClick={(e) => e.currentTarget.blur()}
                  className="group/action peer focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0">
                  <div className="relative w-6 h-6 flex items-center justify-center">
                    {project.isPinned && (
                      <Pin className="w-4 h-4 text-muted-foreground transition-all duration-200 absolute group-hover/action:-translate-x-6" />
                    )}

                    <MoreHorizontal className="w-5 h-5 text-muted-foreground transition-all duration-200 absolute opacity-0 translate-x-6 group-hover/action:opacity-100 group-hover/action:translate-x-0" />
                  </div>
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                sideOffset={6}
                alignOffset={4}
                className="w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
                <DropdownMenuItem onClick={() => handleUpdateProjectPinStatus(project.id)}>
                  {!project.isPinned ? (
                    <>
                      <Pin className="text-muted-foreground" />
                      <span>Pin project</span>
                    </>) : (
                    <>
                      <PinOff className="text-muted-foreground" />
                      <span>Remove pin</span>
                    </>
                  )}

                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link className="text-muted-foreground" />
                  <span>Copy Link</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ArrowUpRight className="text-muted-foreground" />
                  <span>Open in New Tab</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        ))}
        {projectHasNext && (
          <div
            ref={loaderRef}
            className="h-10 flex items-center justify-center"
          >
            <span className="text-xs text-muted-foreground">
              {loading ? "Loading..." : "Scroll to load more"}
            </span>
          </div>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}

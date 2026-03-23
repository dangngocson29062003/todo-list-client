"use client";

import { JSX, useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  CheckCircle2,
  Clock,
  Eye,
  Link,
  LoaderCircle,
  MoreHorizontal,
  Pin,
  PinOff,
  StarOff,
  Trash2,
  XCircle,
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
import { useAuthContext } from "@/src/context/authContext";

export function NavTasks() {
  const { isMobile } = useSidebar();
  const { tasks, taskHasNext, fetchTasks, pinTask } = useHomeContext();
  const { authUser } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);
  const scrollRef = useRef(null);

  const baseStyle =
    "w-7 h-7 flex items-center justify-center rounded-full border shadow-sm";

  const statusMap: Record<string, JSX.Element> = {
    TODO: (
      <div className={`${baseStyle} bg-muted`}>
        <Clock className="w-4 h-4 text-muted-foreground" />
      </div>
    ),
    IN_PROGRESS: (
      <div className={`${baseStyle} bg-blue-100 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800`}>
        <LoaderCircle className="w-4 h-4 text-blue-600 animate-spin" />
      </div>
    ),
    REVIEW: (
      <div className={`${baseStyle} bg-yellow-100 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800`}>
        <Eye className="w-4 h-4 text-yellow-600" />
      </div>
    ),
    DONE: (
      <div className={`${baseStyle} bg-green-100 dark:bg-green-900/30 border-green-200 dark:border-green-800`}>
        <CheckCircle2 className="w-4 h-4 text-green-600" />
      </div>
    ),
    IGNORE: (
      <div className={`${baseStyle} bg-red-100 dark:bg-red-900/30 border-red-200 dark:border-red-800`}>
        <XCircle className="w-4 h-4 text-red-600" />
      </div>
    ),
  };

  function handleUpdateTaskPinStatus(taskId: number) {
    if (!authUser) return;
    pinTask(taskId, authUser.id);
  }

  useEffect(() => {
    if (!tasks?.length || !loaderRef.current || !scrollRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const first = entries[0];

        if (first.isIntersecting && taskHasNext && !loadingRef.current) {
          loadingRef.current = true;
          setLoading(true);

          fetchTasks().finally(() => {
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
  }, [taskHasNext, fetchTasks, tasks]);

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>My tasks</SidebarGroupLabel>
      <SidebarMenu ref={scrollRef} className="custom-scrollbar max-h-45 overflow-y-auto overflow-x-hidden pr-2 scroll-smooth">
        {tasks?.map((task) => (
          <SidebarMenuItem key={task.id}>
            <SidebarMenuButton asChild>
              <span className="flex gap-1 items-center cursor-pointer">
                <div className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800">
                  {statusMap[task.status] || (
                    <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )}
                </div>

                <p className="text-sm font-normal text-foreground truncate">
                  {task.name}
                </p>
              </span>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction
                  onClick={(e) => e.currentTarget.blur()}
                  className="group/action peer focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0"
                >
                  <div className="relative w-6 h-6 flex items-center justify-center">
                    {task.isPinned && (
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
                <DropdownMenuItem onClick={() => handleUpdateTaskPinStatus(task.id)}>
                  {!task.isPinned ? (
                    <>
                      <Pin className="text-muted-foreground" />
                      <span>Pin task</span>
                    </>
                  ) : (
                    <>
                      <PinOff className="text-muted-foreground" />
                      <span>Remove pin</span>
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <StarOff className="text-muted-foreground" />
                  <span>Remove from Favorites</span>
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
        {taskHasNext && (
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

"use client";

import { JSX } from "react";
import {
  Activity,
  ArrowUpRight,
  CheckCircle2,
  Circle,
  CircleX,
  Clock,
  Eye,
  Link,
  ListTodo,
  Loader2,
  LoaderCircle,
  MoreHorizontal,
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

export function NavTasks() {
  const { isMobile } = useSidebar();
  const { data } = useHomeContext();

  const statusMap: Record<string, JSX.Element> = {
    TODO: (
      <div className=" rounded-full bg-gray-100 dark:bg-gray-800">
        <Clock className="w-5 h-5 text-gray-700 dark:text-gray-300" />
      </div>
    ),
    IN_PROGRESS: (
      <div className=" rounded-full bg-blue-100 dark:bg-blue-900/40">
        <LoaderCircle className="w-5 h-5 text-blue-600 dark:text-blue-300" />
      </div>
    ),
    REVIEW: (
      <div className=" rounded-full bg-yellow-100 dark:bg-yellow-900/40">
        <Eye className="w-5 h-5 text-yellow-600 dark:text-yellow-300" />
      </div>
    ),
    DONE: (
      <div className=" rounded-full bg-green-100 dark:bg-green-900/40">
        <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-300" />
      </div>
    ),
    IGNORE: (
      <div className=" rounded-full bg-red-100 dark:bg-red-900/40">
        <XCircle className="w-5 h-5 text-red-600 dark:text-red-300" />
      </div>
    )
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>My tasks</SidebarGroupLabel>
      <SidebarMenu>
        {data?.tasks.map((tasks) => (
          <SidebarMenuItem key={tasks.id}>
            <SidebarMenuButton asChild>
              <span className="flex gap-1 items-center cursor">
                <div className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-800">
                  {statusMap[tasks.status] || (
                    <Clock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )}
                </div>

                <p className="text-sm font-normal text-foreground truncate">
                  {tasks.name}
                </p>
              </span>
            </SidebarMenuButton>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}
              >
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
      </SidebarMenu>
    </SidebarGroup>
  );
}

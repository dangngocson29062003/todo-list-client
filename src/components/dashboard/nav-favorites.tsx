"use client";

import {
  ArrowUpRight,
  LinkIcon,
  MoreHorizontal,
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

import { useEffect, useState } from "react";
import { useAuthContext } from "@/src/context/authContext";
import { Project } from "@/src/types/project";
import Link from "next/link";
import { useProjects } from "@/src/context/homeContext";
import { ProjectActionsDropdown } from "../project/project-actions-dropdown";

export function NavFavorites() {
  const { isMobile } = useSidebar();

  const { favoriteProjects, toggleFavorite } = useProjects();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Favorites</SidebarGroupLabel>

      <SidebarMenu>
        {favoriteProjects.map((item) => (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton asChild>
              <Link
                href={`/project/${item.id}`}
                className="flex items-center gap-3"
              >
                <div className="flex size-5 shrink-0 items-center justify-center rounded-[4px] border border-border bg-background text-[10px] font-bold shadow-sm transition-colors group-hover/item:border-primary/50">
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
    </SidebarGroup>
  );
}

"use client";

import {
  ArrowUpRight,
  LinkIcon,
  MoreHorizontal,
  MoreVertical,
  Star,
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
import { SidebarMenuAction, useSidebar } from "../shadcn/sidebar";
import { Button } from "../shadcn/button";

interface ProjectActionsDropdownProps {
  projectId: string;
  isFavorite: boolean;
  onToggleFavorite: (projectId: string, isFavorite: boolean) => void;
  onDelete?: (projectId: string) => void;
  variant?: "sidebar" | "card";
}

export function ProjectActionsDropdown({
  projectId,
  isFavorite,
  onToggleFavorite,
  onDelete,
  variant = "card",
}: ProjectActionsDropdownProps) {
  const { isMobile } = useSidebar();
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/project/${projectId}`,
      );
    } catch (error) {
      console.error("Copy link failed:", error);
    }
  };

  const handleOpenInNewTab = () => {
    window.open(`/project/${projectId}`, "_blank", "noopener,noreferrer");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {variant === "sidebar" ? (
          <SidebarMenuAction
            showOnHover
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <MoreHorizontal />
            <span className="sr-only">More</span>
          </SidebarMenuAction>
        ) : (
          <Button
            variant={"ghost"}
            size={"icon-xs"}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          >
            {isMobile ? (
              <MoreVertical className="size-4" />
            ) : (
              <MoreHorizontal className="size-4" />
            )}
          </Button>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="z-50 w-56 rounded-lg"
        side={isMobile ? "top" : "bottom"}
        align={isMobile ? "center" : "start"}
        onClick={(e) => e.stopPropagation()}
      >
        <DropdownMenuItem
          onClick={() => onToggleFavorite(projectId, isFavorite)}
        >
          {isFavorite ? (
            <>
              <StarOff className="text-muted-foreground" />
              <span>Remove from Favorites</span>
            </>
          ) : (
            <>
              <Star className="text-muted-foreground" />
              <span>Add to Favorites</span>
            </>
          )}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleCopyLink}>
          <LinkIcon className="text-muted-foreground" />
          <span>Copy Link</span>
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleOpenInNewTab}>
          <ArrowUpRight className="text-muted-foreground" />
          <span>Open in New Tab</span>
        </DropdownMenuItem>

        {onDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => onDelete(projectId)}>
              <Trash2 className="text-muted-foreground" />
              <span>Move to Bin</span>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

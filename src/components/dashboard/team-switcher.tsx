"use client";

import * as React from "react";
import {
  ChevronDown,
  PersonStanding,
  Plus,
  Settings,
  Settings2,
  SettingsIcon,
  UserRoundPlus,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/src/components/shadcn/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/src/components/shadcn/sidebar";
import { Button } from "../shadcn/button";

export function TeamSwitcher({
  teams,
}: {
  teams: {
    name: string;
    logo: React.ElementType;
    plan: string;
  }[];
}) {
  const [activeTeam, setActiveTeam] = React.useState(teams[0]);

  if (!activeTeam) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="w-full px-1.5">
              <div className="flex aspect-square size-5 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                D
              </div>
              <span className="truncate font-medium w-full">
                dangngocson29062003@gmail.com
              </span>
              <ChevronDown className="opacity-50" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-84 rounded-lg"
            align="start"
            side="bottom"
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground flex gap-2 items-center">
              <div className="flex aspect-square size-5 items-center justify-center rounded-md bg-sidebar-primary text-sidebar-primary-foreground">
                D
              </div>
              <span className="truncate font-medium w-full">
                dangngocson29062003@gmail.com
              </span>
            </DropdownMenuLabel>
            <DropdownMenuLabel
              onClick={() => console.log("Settings")}
              className="flex gap-5 p-2 hover:bg-transparent text-muted-foreground"
            >
              <Button
                variant="outline"
                size="sm"
                className="font-normal text-xs"
              >
                <SettingsIcon />
                Settings
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="font-normal text-xs"
              >
                <UserRoundPlus />
                Invite members
              </Button>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="text-xs text-muted-foreground">Log out</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

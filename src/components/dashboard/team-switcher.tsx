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
import { useAuthContext } from "@/src/context/authContext";
import { useRouter } from "next/navigation";

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
  const { authUser, authLogout } = useAuthContext();
  const router = useRouter();

  if (!activeTeam) {
    return null;
  }


  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton className="flex gap-2 items-center">
              {authUser?.avatarUrl ? (
                <img
                  src={authUser.avatarUrl}
                  className="w-7 h-7 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="w-7 h-7 shrink-0 flex items-center justify-center rounded-full bg-blue-500 text-white">
                  {authUser?.email.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="truncate font-medium w-full">
                {authUser?.email}
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
            <DropdownMenuLabel className=" text-muted-foreground flex gap-2 items-center">
              {authUser?.avatarUrl ? (
                <img
                  src={authUser.avatarUrl}
                  className="w-7 h-7 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="w-7 h-7 shrink-0 flex items-center justify-center rounded-full bg-blue-500 text-white">
                  {authUser?.email.charAt(0).toUpperCase()}
                </div>
              )}
              <span className="truncate font-medium w-full">
                {authUser?.email}
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
            <DropdownMenuItem
              className="gap-2 p-2"
              onClick={() => {
                authLogout();
                router.push('/login')
              }}>
              <div className="text-xs text-muted-foreground">Log out</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

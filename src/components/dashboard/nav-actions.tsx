"use client";

import {
  Bell,
  LogOut,
  Moon,
  MoreHorizontal,
  Settings,
  Star,
  Sun,
} from "lucide-react";
import * as React from "react";

import { Button } from "@/src/components/shadcn/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/shadcn/popover";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/src/components/shadcn/sidebar";
import { useTheme } from "next-themes";

const data = [
  [
    {
      label: "Setting",
      icon: Settings,
    },
  ],
  [
    {
      label: "Logout",
      icon: LogOut,
    },
  ],
];

export function NavActions() {
  const [isOpen, setIsOpen] = React.useState(false);
  const { setTheme, theme } = useTheme();

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="font-medium text-muted-foreground md:inline-block">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          <Sun className="h-[1.5rem] w-[1.3rem] dark:hidden" />
          <Moon className="hidden h-[1.5rem] w-[1.3rem] dark:block" />
        </Button>
      </div>
      <Button variant="ghost" size="icon-lg" className="relative">
        <div className="absolute size-3 top-2 right-2 absolute bg-red-500  rounded-full flex items-center justify-center text-white text-xs">
          1
        </div>
        <Bell />
      </Button>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 data-[state=open]:bg-accent"
          >
            <MoreHorizontal />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          className="w-56 overflow-hidden rounded-lg p-0"
          align="end"
        >
          <Sidebar collapsible="none" className="bg-transparent">
            <SidebarContent>
              {data.map((group, index) => (
                <SidebarGroup key={index} className="border-b last:border-none">
                  <SidebarGroupContent className="gap-0">
                    <SidebarMenu>
                      {group.map((item, index) => (
                        <SidebarMenuItem key={index}>
                          <SidebarMenuButton>
                            <item.icon /> <span>{item.label}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ))}
            </SidebarContent>
          </Sidebar>
        </PopoverContent>
      </Popover>
    </div>
  );
}

"use client";
import React, { useState } from "react";
import { type LucideIcon } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/src/components/shadcn/sidebar";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/shadcn/popover";

import { BinPanel } from "./bin-panel";
import SettingModal from "./settings/settings-modal";

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string;
    url?: string;
    icon: LucideIcon;
    badge?: React.ReactNode;
  }[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const { isMobile } = useSidebar();

  const [openSettings, setOpenSettings] = useState(false);

  return (
    <>
      <SidebarGroup {...props}>
        <SidebarGroupContent>
          <SidebarMenu>
            {items.map((item: any) => (
              <SidebarMenuItem key={item.title}>
                {/* BIN */}
                {item.title === "Bin" ? (
                  <Popover modal>
                    <PopoverTrigger asChild>
                      <SidebarMenuButton>
                        <item.icon />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                    </PopoverTrigger>

                    <PopoverContent
                      side={isMobile ? "top" : "right"}
                      align="start"
                      sideOffset={-8}
                      className="
                        h-[460px]
                        lg:w-[400px]
                        mb-2 p-0
                        shadow-lg border
                        rounded-xl
                      "
                    >
                      <BinPanel />
                    </PopoverContent>
                  </Popover>
                ) : item.title === "Settings" ? (
                  <SidebarMenuButton onClick={() => setOpenSettings(true)}>
                    <item.icon />
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                ) : (
                  /* NORMAL ITEM */
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                )}

                {item.badge && (
                  <SidebarMenuBadge>{item.badge}</SidebarMenuBadge>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      <SettingModal open={openSettings} onOpenChange={setOpenSettings} />
    </>
  );
}

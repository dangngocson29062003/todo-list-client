"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import {
  AudioWaveform,
  Calendar,
  Command,
  Home,
  Inbox,
  MessageCircleQuestion,
  Search,
  Settings2,
  Trash2,
} from "lucide-react";

import { NavFavorites } from "@/src/components/dashboard/nav-favorites";
import { NavMain } from "@/src/components/dashboard/nav-main";
import { NavSecondary } from "@/src/components/dashboard/nav-secondary";
import { TeamSwitcher } from "@/src/components/dashboard/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarRail,
} from "@/src/components/shadcn/sidebar";
import { NavProjects } from "./nav-project";
import { NavTasks } from "./nav-tasks";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/src/components/shadcn/dialog";

const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: Command,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Search",
      url: "#",
      icon: Search,
    },
    {
      title: "Home",
      url: "/home",
      icon: Home,
    },
    {
      title: "Calendar",
      url: "/calendar",
      icon: Calendar,
    },
    {
      title: "Inbox",
      url: "/inbox",
      icon: Inbox,
      badge: "10",
    },
  ],
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
    },
    {
      title: "Bin",
      icon: Trash2,
      action: "open-bin",
    },
    {
      title: "Help",
      url: "#",
      icon: MessageCircleQuestion,
    },
  ],
  tasks: [
    {
      name: "Implement login feature",
      url: "#",
      emoji: "✅",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const [openBinModal, setOpenBinModal] = React.useState(false);

  const navMainItemsActive = data.navMain.map((item) => ({
    ...item,
    isActive: pathname === item.url,
  }));

  const navSecondaryItems = data.navSecondary.map((item) => ({
    ...item,
    onClick:
      item.action === "open-bin" ? () => setOpenBinModal(true) : undefined,
  }));
  return (
    <>
      <Sidebar className="border-r-0" {...props}>
        <SidebarHeader>
          <TeamSwitcher teams={data.teams} />
          <NavMain items={navMainItemsActive} />
        </SidebarHeader>

        <SidebarContent>
          <NavProjects />
          <NavTasks tasks={data.tasks} />
          <NavFavorites />
          <NavSecondary items={navSecondaryItems} className="mt-auto" />
        </SidebarContent>

        <SidebarRail />
      </Sidebar>

      <Dialog open={openBinModal} onOpenChange={setOpenBinModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Bin</DialogTitle>
          </DialogHeader>

          <div className="text-sm text-muted-foreground">
            Nội dung modal của Bin đặt ở đây.
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

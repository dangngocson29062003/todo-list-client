"use client";

import {
  LogOut,
  Moon,
  MoreHorizontal,
  Settings,
  Sun,
} from "lucide-react";

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
import Link from "next/link";
import { Dispatch, SetStateAction, useState } from "react";
import { NotificationDropdown } from "./notification-dropdown";
import { NotificationMarkRequest, NotificationResponse } from "@/src/types/notification";

const data = [
  [
    {
      label: "Setting",
      icon: Settings,
      href: "/settings",
    },
  ],
  [
    {
      label: "Logout",
      icon: LogOut,
      href: "/logout",
    },
  ],
];

interface INavActionsProps {
  notifications: NotificationResponse[],
  setNotifications: Dispatch<SetStateAction<NotificationResponse[]>>;
  unreadCount: number;
  setUnreadCount: Dispatch<SetStateAction<number>>;
  loading?: boolean
  onLoadMore: () => void;
  onCollapse: () => void;
  hasMore: boolean
}

export function NavActions(props: INavActionsProps) {
  const { notifications, setNotifications, setUnreadCount, unreadCount, loading, onLoadMore, onCollapse, hasMore } = props;

  const [isOpen, setIsOpen] = useState(false);
  const { setTheme, theme } = useTheme();

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const handleMarkAllAsRead = async () => {
    try {
      const payload = {
        notificationUserIds: notifications.map(n => n.id)
      } as NotificationMarkRequest;
      const authToken = localStorage.getItem("token");
      const res = await fetch(`/api/notifications/read`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(payload)
      });

      const data: ApiResponse<NotificationResponse> = await res.json();

      if (data.status !== 200) {
        throw new Error(data.message || "Failed to mark all notifications as read");
      }

      setNotifications(prev =>
        prev.map(n => ({
          ...n,
          isRead: true
        }))
      )

      setUnreadCount(0);

    } catch (error) {
      console.error(">>>> ERROR mark all notifications as read", error)
    }

  }

  const handleMarkAsRead = async (id: number) => {
    try {
      const authToken = localStorage.getItem("token");
      const res = await fetch(`/api/notifications/${id}/read`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        }
      });

      const data: ApiResponse<NotificationResponse> = await res.json();

      if (data.status !== 200) {
        throw new Error(data.message || "Failed to mark a notification as read");
      }

      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, isRead: true } : n)
      )

      setUnreadCount(prev => (prev - 1 <= 0 ? 0 : prev - 1));

    } catch (error) {
      console.error(">>>> ERROR cannot mark as read", error)
    }
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="font-medium text-muted-foreground md:inline-block cursor-pointer">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          <Sun className="h-[1.5rem] w-[1.3rem] dark:hidden" />
          <Moon className="hidden h-[1.5rem] w-[1.3rem] dark:block" />
        </Button>
      </div>
      <>
        <NotificationDropdown
          notifications={notifications}
          open={isNotificationOpen}
          onOpenChange={setIsNotificationOpen}
          onMarkAllAsRead={handleMarkAllAsRead}
          onMarkAsRead={handleMarkAsRead}
          unreadCount={unreadCount}
          onLoadMore={onLoadMore}
          loading={loading}
          onCollapse={onCollapse}
          hasMore={hasMore}
        />
      </>
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
                          <Link href={item.href}>
                            <SidebarMenuButton>
                              <item.icon /> <span>{item.label}</span>
                            </SidebarMenuButton>
                          </Link>
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

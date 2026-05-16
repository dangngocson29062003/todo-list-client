'use client';
import Link from 'next/link';

import { Bell } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '../shadcn/popover';
import { Button } from '../shadcn/button';
import { Separator } from '../shadcn/separator';
import { ScrollArea } from '../shadcn/scroll-area';
import { formatDateDistanceToNow } from '@/src/utils/helpers';

export interface NotificationDropdownProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    notifications: {
        id: number;
        title: string;
        message: string;
        isRead: boolean;
        createdAt: string;
        actionUrl?: string;
    }[];
    onMarkAllAsRead: () => void;
    onMarkAsRead: (id: number) => void;
    loading?: boolean;
    unreadCount: number;
    onLoadMore: () => void;
    onCollapse: () => void;
    hasMore: boolean
}


export function NotificationDropdown({
    open,
    onOpenChange,
    notifications,
    onMarkAllAsRead,
    onMarkAsRead,
    unreadCount,
    loading = false,
    onLoadMore,
    onCollapse,
    hasMore
}: NotificationDropdownProps) {

    const handleNotificationClick = (notification: {
        id: number;
        actionUrl?: string;
    }) => {
        onMarkAsRead(notification.id);
    };

    const handleOpenChange = (open: boolean) => {
        onOpenChange(open);
        if (!open) {
            onCollapse();
        }
    }

    const skeletonLoaders = Array.from({ length: 3 }).map((_, i) => (
        <div key={`skeleton-${i}`} className="px-4 py-3">
            <div className="h-4 bg-muted/60 rounded w-3/4 mb-2 animate-pulse" />
            <div className="h-3 bg-muted/40 rounded w-full mb-2 animate-pulse" />
            <div className="h-2 bg-muted/40 rounded w-1/3 animate-pulse" />
        </div>
    ));

    return (
        <Popover open={open} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-9 w-9"
                >
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs font-semibold text-white">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[380px] p-0" align="end" side='bottom'>
                <div className="flex flex-col h-[480px] min-h-0">
                    <div className="flex items-center justify-between px-4 py-3">
                        <h2 className="text-lg font-semibold">Notifications</h2>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-xs h-auto px-2 py-1"
                            onClick={onMarkAllAsRead}
                            disabled={loading || unreadCount === 0}
                        >
                            Mark all as read
                        </Button>
                    </div>
                    <Separator />

                    {loading ? (
                        <ScrollArea className="flex-1">
                            {skeletonLoaders}
                        </ScrollArea>
                    ) : notifications.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center gap-2 text-center">
                            <Bell className="h-8 w-8 text-muted-foreground/50" />
                            <p className="text-sm text-muted-foreground">
                                No notifications
                            </p>
                        </div>
                    ) : (
                        <ScrollArea className="flex-1 min-h-0">
                            <div>
                                {notifications.map((notification) => {
                                    const notificationContent = (
                                        <div
                                            className={`px-4 py-3 border-b last:border-b-0 transition-colors cursor-pointer ${notification.isRead
                                                ? 'bg-background hover:bg-accent'
                                                : 'bg-blue-50 hover:bg-blue-100/80'
                                                }`}
                                            onClick={() => handleNotificationClick(notification)}
                                        >
                                            <div className="flex gap-3">
                                                <div className="flex-1">
                                                    <div className="flex items-start gap-2">
                                                        <p className="text-sm font-semibold text-foreground flex-1">
                                                            {notification.title}
                                                        </p>
                                                        {!notification.isRead && (
                                                            <div className="h-2 w-2 rounded-full bg-blue-500 shrink-0 mt-1" />
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-muted-foreground mt-1">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground/70 mt-1">
                                                        {formatDateDistanceToNow(notification.createdAt)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );

                                    if (notification.actionUrl) {
                                        return (
                                            <Link
                                                key={notification.id}
                                                href={notification.actionUrl}
                                                className="block no-underline"
                                                onClick={() => handleNotificationClick(notification)}
                                            >
                                                {notificationContent}
                                            </Link>
                                        );
                                    }

                                    return (
                                        <div key={notification.id}
                                            onClick={() => handleNotificationClick(notification)}>
                                            {notificationContent}
                                        </div>
                                    );
                                })}

                                <div className="p-3">

                                    <Button
                                        variant="outline"
                                        className="w-full cursor-pointer"
                                        onClick={hasMore ? onLoadMore : onCollapse}
                                        disabled={loading}
                                    >
                                        {loading ? (
                                            <ScrollArea>
                                                {skeletonLoaders}
                                            </ScrollArea>
                                        ) : hasMore ? "Load More" : "Collapse"}
                                    </Button>

                                </div>
                            </div>
                        </ScrollArea>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}

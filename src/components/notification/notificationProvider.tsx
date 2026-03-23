"use client";

import { createContext, useContext, useState } from "react";
import Notification from "./notification";

type NotifyType = "success" | "error" | "info" | "warning";

interface Notification {
    id: number;
    title: string;
    description?: string;
    type: NotifyType;
}

interface NotificationContextType {
    notify: (type: NotifyType, title: string, description?: string) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    function notify(type: NotifyType, title: string, description?: string) {
        const id = Date.now();

        setNotifications((prev) => [
            ...prev,
            { id, type, title, description },
        ]);

        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, 5000);
    }

    function remove(id: number) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    }

    return (
        <NotificationContext.Provider value={{ notify }}>
            {children}

            {notifications.map((n) => (
                <Notification
                    key={n.id}
                    title={n.title}
                    description={n.description}
                    type={n.type}
                    onClose={() => remove(n.id)}
                />
            ))}
        </NotificationContext.Provider>
    );
}

export function useNotifyContext() {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error("useNotify must be used inside NotificationProvider");
    return ctx.notify;
}
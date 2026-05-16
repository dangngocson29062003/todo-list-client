"use client";

import { useEffect, useRef, useState } from "react";
import { websocketService } from "../service/websocket-service";

interface NotificationMessage {
  title: string;
  message: string;
  actionUrl?: string;
  isRead: boolean;
  id: number;
  createdAt: string;
}

interface Props {
  onNotification?: (notification: NotificationMessage) => void;
  onUnreadCount?: (count: number) => void;
}

export const useNotificationWebSocket = (props: Props) => {
  const { onNotification, onUnreadCount } = props;

  const notificationSubRef = useRef<any>(null);
  const unreadSubRef = useRef<any>(null);

  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    websocketService.connect(token, () => {
      notificationSubRef.current = websocketService.subscribe(
        "/user/queue/notifications",
        (message: NotificationMessage) => {
          onNotification?.(message);
        },
      );

      setConnected(true);

      unreadSubRef.current = websocketService.subscribe(
        "/user/queue/unread",
        (count: number) => {
          onUnreadCount?.(count);
        },
      );
    });

    return () => {
      notificationSubRef.current?.unsubscribe();
      unreadSubRef.current?.unsubscribe();
      setConnected(false);
      websocketService.disconnect();
    };
  }, []);
};

import { NotificationType } from "./enum";

export interface NotificationMarkRequest {
  notificationUserIds: number[];
}

export interface NotificationResponse {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  // type: NotificationType;
}

export interface UnreadCountNotification {
  unreadCount: number;
}

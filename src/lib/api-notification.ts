export async function getAllNotifications() {
  const accessToken = localStorage.getItem("token");

  const res = await fetch(`/api/notifications`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data: ApiResponse<NotificationResponse[]> = await res.json();

  if (!res.ok) {
    throw new Error("Failed to retrieve all notifications");
  }

  return data;
}

export async function getUnreadQuantityNotifications(): Promise<
  ApiResponse<UnreadCountNotification>
> {
  const accessToken = localStorage.getItem("token");

  const res = await fetch(`/api/notifications/unread`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  });

  const data: ApiResponse<UnreadCountNotification> = await res.json();

  if (!res.ok) {
    throw new Error("Failed to retrieve quantity of unread notifications");
  }

  return data;
}

export async function markAllAsRead(payload: NotificationMarkRequest) {
  const token = localStorage.getItem("token");
  const res = await fetch(`/api/read`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to mark all notifications");
  }

  return data;
}

export async function markSingleAsRead(id: number) {
  const token = localStorage.getItem("token");
  const res = await fetch(`/api/${id}/read`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to mark single notification");
  }

  return data;
}

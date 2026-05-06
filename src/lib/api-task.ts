export const getTasks = async (
  projectId: string,
  filters: {
    status?: string;
    priority?: string;
    type?: string;
    isParentOnly?: boolean;
  } = {},
) => {
  const token = localStorage.getItem("token");
  const queryParams = new URLSearchParams();

  if (filters.status) queryParams.append("status", filters.status);
  if (filters.priority) queryParams.append("priority", filters.priority);
  if (filters.type) queryParams.append("type", filters.type);
  if (filters.isParentOnly !== undefined) {
    queryParams.append("isParentOnly", String(filters.isParentOnly));
  }
  const res = await fetch(
    `/api/projects/${projectId}/tasks?${queryParams.toString()}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to fetch tasks");
  }

  const result = await res.json();
  return result.data || result;
};
export const handleDuplicateTask = async (
  taskId: string,
  projectId: string,
) => {
  const token = localStorage.getItem("token");
  const res = await fetch(
    `/api/projects/${projectId}/tasks/${taskId}/duplicate`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!res.ok) throw new Error("Failed to duplicate");
  const result = await res.json();
  const newTask = result.data || result;
  return newTask;
};

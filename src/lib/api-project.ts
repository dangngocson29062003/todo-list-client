export async function updateProject(
  id: string,
  payload: Record<string, unknown>,
) {
  const token = localStorage.getItem("token");
  const res = await fetch(`/api/projects/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to update project");
  }

  return data;
}
export async function moveToBin(id: string) {
  const token = localStorage.getItem("token");
  const res = await fetch(`/api/projects/${id}/delete`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to update project");
  }

  return true;
}
export async function restore(id: string) {
  const token = localStorage.getItem("token");
  const res = await fetch(`/api/projects/${id}/restore`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to update project");
  }

  return true;
}
export async function deleteProject(id: string) {
  const token = localStorage.getItem("token");
  const res = await fetch(`/api/projects/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Failed to update project");
  }

  return true;
}

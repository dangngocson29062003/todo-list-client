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

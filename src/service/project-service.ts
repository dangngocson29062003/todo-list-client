import { api } from "../lib/api-client";

export function getProjects(
  lastAccessCursor: Date | null,
  createdAtCursor: Date | null,
  limit?: number) {
  
  return api(`/projects/simple`, {
    method: "GET",
    params: {
      lastAccessCursor,
      createdAtCursor,
      limit
    }
  });
}
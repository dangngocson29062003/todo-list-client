import { api } from "../lib/api-client";

export function getTasks(
  lastAccessCursor: Date | null,
  idCursor: number | null,
  limit?: number) {
  
  return api(`/tasks/simple`, {
    method: "GET",
    params: {
      lastAccessCursor,
      idCursor,
      limit
    }
  });
}
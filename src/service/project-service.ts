import { api } from "../lib/api-client";

export function getProjects(cursor?: Date) {
  return api(`/projects`, {
    method: "GET",
    params: {
      cursor: cursor?.toISOString()
    }
  });
}
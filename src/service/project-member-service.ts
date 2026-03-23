import { api } from "../lib/api-client";

export function updateProjectPinStatus(projectId:string,userId:string) {
  return api(`/projects/${projectId}/members/${userId}/pin`, {
    method: "POST",
    body: JSON.stringify({ projectId, userId }),
  });
}
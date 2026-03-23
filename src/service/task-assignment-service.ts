import { api } from "../lib/api-client";

export function updateTaskPinStatus(taskId:number,userId:string) {
  return api(`/tasks/${taskId}/assignments/${userId}/pin`, {
    method: "POST",
    body: JSON.stringify({ taskId, userId }),
  });
}
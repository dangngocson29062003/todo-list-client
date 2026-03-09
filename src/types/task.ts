export interface Task {
  id: number;
  title: string;
  description: string;
  tags: string;
  priority: string;
  status: TaskStatus;
}
export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  REVIEW = "REVIEW",
  DONE = "DONE",
}

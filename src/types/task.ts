export interface Task {
  id: number;
  title: string;
  description: string;
  tags: string;
  priority: string;
  status: TaskStatus;
  startDate: Date;
  endDate: Date;
  type: string;
  progress: number;
  parentId: number | null;
  expanded?: boolean;
  assignees?: { name: string; avatar?: string }[];
}
export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  REVIEW = "REVIEW",
  DONE = "DONE",
}

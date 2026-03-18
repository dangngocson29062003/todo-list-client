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
  assignees?: { name: string; avatar?: string }[];
  expanded?: boolean;
}
export enum Priority {
  LOW = "LOW",
  NORMAL = "NORMAL",
  HIGH = "HIGH",
  URGENT = "URGENT",
}
export enum TaskStatus {
  TODO = "TODO",
  IN_PROGRESS = "IN_PROGRESS",
  REVIEW = "REVIEW",
  DONE = "DONE",
}

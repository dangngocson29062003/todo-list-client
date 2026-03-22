import { TaskStatus } from "./enum";

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

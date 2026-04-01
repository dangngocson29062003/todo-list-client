import { Assignee } from "./assignee";
import { Priority, TaskStatus } from "./enum";

export interface Task {
  id: string;
  name: string;
  description: string;
  tags: string;
  priority: Priority;
  status: TaskStatus;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  type: string;
  progress: number;
  parentId: string | null;
  assignees?: Assignee[];
  expanded?: boolean;
  commentCount?: number;
}

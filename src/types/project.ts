import { Priority, Stage, TechStack } from "./enum";
import { ProjectMember } from "./project-member";

export interface Project {
  id: string;
  createdBy: User;
  name: string;
  description?: string;
  tags?: string;
  stage: Stage;
  priority: Priority;
  startDate: Date;
  endDate: Date;
  goals?: string[];
  techStack: TechStack[];
  githubUrl?: string;
  figmaUrl?: string;
  members: ProjectMember[];
  memberCount: number;
  taskCount: number;
  doneTaskCount: number;
  stats?: {
    total: number;
    todo: number;
    inprogress: number;
    review: number;
    done: number;
    blocked: number;
  };
}
